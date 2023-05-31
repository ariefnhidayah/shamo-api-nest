import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductGallery } from "src/entities/product-gallery.entity";
import { Product } from "src/entities/product.entity";
import { TransactionItem } from "src/entities/transaction-item.entity";
import { Transaction } from "src/entities/transaction.entity";
import { ResponseApi } from "src/response-api";
import { DataSource, IsNull, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
import { UpdatePaymentProofDto } from "./dto/update-payment-proof.dto";
const Validator = require("fastest-validator");

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transaction: Repository<Transaction>,
    @InjectRepository(TransactionItem) private transactionItem: Repository<TransactionItem>,
    @InjectRepository(Product) private product: Repository<Product>,
    @InjectRepository(ProductGallery) private productGallery: Repository<ProductGallery>,
    private dataSource: DataSource
  ) { }

  async add(request, createTransactionDto: CreateTransactionDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()

    const schema = {
      address: "string|empty:false",
      shipping_price: "number|empty:false",
      transaction_items: "array|empty:false"
    }

    const validate = validator.validate(createTransactionDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const userData = request.user.data

    const { address, shipping_price, transaction_items } = createTransactionDto

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.save(Transaction, {
        user_id: userData.id,
        address,
        shipping_price
      })

      let total_price: number = 0

      for (const item of transaction_items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: {
            id: item.product_id,
            deleted_at: IsNull()
          }
        })
        if (product) {
          await queryRunner.manager.save(TransactionItem, {
            transaction_id: transaction.id,
            product_id: product.id,
            price: product.price,
            quantity: item.quantity,
            total_price: (product.price * item.quantity)
          })
          total_price += (product.price * item.quantity)
        } else {
          throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error('Product not found!') })
        }
      }

      const subtotal = total_price + shipping_price

      const updated = await queryRunner.manager.update(Transaction, {
        id: transaction.id
      }, {
        total_price,
        subtotal
      })

      if (updated) {
        await queryRunner.commitTransaction()

        response.data = null
        response.success = true
        return response
      } else {
        throw Error()
      }

    } catch (error) {
      console.log(`Transaction Error: ${error.name}`)
      await queryRunner.rollbackTransaction();
      response.success = false
      response.data = null
      response.message = "Something wen't wrong!"
      throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error("") })
    }
  }

  async gets(request, getsTransactionDto: GetsTransactionDto): Promise<ResponseApi> {
    const response = new ResponseApi()

    let { page, limit, transaction_status, payment_status } = getsTransactionDto

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    let offset = (page - 1) * limit

    const userData = request.user.data

    const transactions = this.transaction
      .createQueryBuilder('t')
      .select('id')
      .addSelect('total_price')
      .addSelect('created_at')
      .addSelect('shipping_price')
      .addSelect('subtotal')
      .addSelect('transaction_status')
      .addSelect('payment_status')
      .where(`user_id = ${userData.id}`)
      .limit(limit)
      .offset(offset)

    if (transaction_status) {
      transactions.andWhere(`transaction_status = '${transaction_status}'`)
    }

    if (payment_status) {
      transactions.andWhere(`payment_status = '${payment_status}'`)
    }

    response.success = true
    response.data = {
      data: (await transactions.getRawMany()).map(item => {
        item.created_at = new Date(item.created_at).toLocaleString()
        return item
      }),
      count: await transactions.getCount()
    }

    return response
  }

  async get(request, id: number): Promise<ResponseApi> {
    const response = new ResponseApi()

    const userData = request.user.data
    const transaction = await this.transaction.findOne({
      where: {
        id,
        user_id: userData.id,
      },
      select: ['id', 'created_at', 'address', 'total_price', 'shipping_price', 'subtotal', 'transaction_status', 'transaction_status', 'payment_status', 'payment_proof']
    })

    if (!transaction) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error('Transaction not found!') })
    }

    const transaction_items = await this.transactionItem.find({
      where: {
        transaction_id: transaction.id
      },
      select: ['price', 'quantity', 'total_price']
    })

    const temps = []
    for (const item of transaction_items) {
      const product = await this.product.findOne({
        where: {
          id: item.product_id
        },
        select: ['name']
      })
      const productGallery = await this.productGallery.findOne({
        where: {
          id: item.product_id,
          is_primary: 1,
        },
        select: ['url']
      })
      temps.push({
        ...item,
        product: {
          ...product,
          product_gallery: productGallery
        }
      })
    }

    response.success = true
    response.data = {
      ...transaction,
      created_at: new Date(transaction.created_at).toLocaleString(),
      transaction_items: temps
    }

    return response
  }

  async updatePaymentProof(request, id: number, updatePaymentProof: UpdatePaymentProofDto): Promise<ResponseApi> {
    const response = new ResponseApi()

    const userData = request.user.data;

    const transaction = await this.transaction.findOne({
      where: {
        id,
        user_id: userData.id
      }
    })

    if (!transaction) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error('Transaction not found!') })
    }

    const validator = new Validator()

    const schema = {
      payment_proof: "string|empty:false"
    }

    const validate = validator.validate(updatePaymentProof, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    await this.transaction.update({
      id: transaction.id,
    }, {
      payment_proof: updatePaymentProof.payment_proof,
      payment_status: 'paid'
    })
    
    response.data = null
    response.success = true

    return response
  }

}