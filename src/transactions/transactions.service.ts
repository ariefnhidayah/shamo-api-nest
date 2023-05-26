import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCategory } from "src/entities/product-category.entity";
import { ProductGallery } from "src/entities/product-gallery.entity";
import { Product } from "src/entities/product.entity";
import { TransactionItem } from "src/entities/transaction-item.entity";
import { Transaction } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { ResponseApi } from "src/response-api";
import { DataSource, IsNull, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
const Validator = require("fastest-validator");

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transaction: Repository<Transaction>,
    @InjectRepository(TransactionItem) private transactionItem: Repository<TransactionItem>,
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(Product) private product: Repository<Product>,
    @InjectRepository(ProductGallery) private productGallery: Repository<ProductGallery>,
    @InjectRepository(ProductCategory) private productCategory: Repository<ProductCategory>,
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
            total_price: (product.price * item.quantity),
            transaction: new Transaction
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

    try {
      const transactions = await this.transaction
        .createQueryBuilder('t')
        .select('id')
        .addSelect('total_price')
        .addSelect('created_at')
        .addSelect('shipping_price')
        .addSelect('subtotal')
        .addSelect('transaction_status')
        .addSelect('payment_status')
        .where(`user_id = ${userData.id}`)
        .andWhere(transaction_status ? `transaction_status = '${transaction_status}'` : null)
        .andWhere(payment_status ? `payment_status = '${payment_status}'` : null)
        .limit(limit)
        .offset(offset)
        .getManyAndCount()

      response.success = true
      response.data = transactions

      return response
    } catch (error) {
      console.log(error)
      throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error("") })
    }
  }

}