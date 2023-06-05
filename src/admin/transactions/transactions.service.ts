import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/entities/transaction.entity";
import { Repository } from "typeorm";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
import { ResponseApi } from "src/response-api";
import { TransactionItem } from "src/entities/transaction-item.entity";
import { DateLibService } from "@app/date-lib";
import { User } from "src/entities/user.entity";
import { ChangePaymentStatusDto } from "./dto/change-payment-status-dto";
import { ChangeTransactionStatusDto } from "./dto/change-transaction-status-dto";
const Validator = require("fastest-validator");

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem) private transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private dateLibService: DateLibService
  ) { }

  async gets(request, getsTransactionDto: GetsTransactionDto): Promise<ResponseApi> {
    const response = new ResponseApi()

    let { page, limit, q, payment_status, transaction_status } = getsTransactionDto

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    if (!q) {
      q = ''
    }

    let offset = (page - 1) * limit

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException()
    }

    const transactions = this.transactionRepository
      .createQueryBuilder('t')
      .select('t.id')
      .addSelect('t.address')
      .addSelect('t.total_price')
      .addSelect('t.shipping_price')
      .addSelect('t.subtotal')
      .addSelect('t.transaction_status')
      .addSelect('t.payment_status')
      .addSelect('t.payment_proof')
      .addSelect('t.created_at')
      .limit(limit)
      .offset(offset)
      .where('t.id != 0')
      .orderBy('t.id', 'DESC')
      .leftJoin('t.user', 'u')
      .addSelect(['u.name'])
      .addSelect(['u.email'])

    if (transaction_status) {
      transactions.andWhere(`t.transaction_status = '${transaction_status}'`)
    }

    if (payment_status) {
      transactions.andWhere(`t.payment_status = '${transaction_status}'`)
    }

    if (q != '') {
      transactions.andWhere(`(u.name like '%${q}%' or u.email like '%${q}%' or t.address like '%${q}%')`)
    }

    response.success = true
    response.data = {
      data: (await transactions.getMany()).map(transaction => {
        transaction.created_at = this.dateLibService.convertDateYMD(transaction.created_at)
        return transaction
      }),
      count: await transactions.getCount()
    }

    return response
  }

  async get(request, id: number) {
    const response = new ResponseApi()

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException()
    }

    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        user: true,
      },
      select: {
        id: true,
        address: true,
        total_price: true,
        shipping_price: true,
        subtotal: true,
        transaction_status: true,
        payment_status: true,
        payment_proof: true,
        created_at: true,
        user: {
          name: true,
          email: true,
          profile_photo_path: true,
        }
      },
    })
    if (!transaction) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: Error("Transaction not found!") });
    }

    const transaction_items = await this.transactionItemRepository
      .createQueryBuilder('ti')
      .select('ti.quantity as quantity')
      .addSelect('ti.price as price')
      .addSelect('ti.product_id as product_id')
      .addSelect('p.name as product_name')
      .addSelect('g.url as product_image')
      .leftJoin('ti.product', 'p')
      .leftJoin('p.galleries', 'g', 'g.is_primary = 1')
      .where('ti.transaction_id = :id', { id })
      .getRawMany()

    transaction.created_at = this.dateLibService.convertDateYMD(transaction.created_at)

    response.success = true
    response.data = {
      ...transaction,
      transaction_items
    }

    return response
  }

  async changePaymentStatus(request, id: number, changePaymentStatusDto: ChangePaymentStatusDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException()
    }

    const schema = {
      payment_status: "string|empty:false"
    }

    const validate = validator.validate(changePaymentStatusDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const transaction = await this.transactionRepository.findOne({ where: { id } })
    if (!transaction) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error("Transaction Not Found!") })
    }

    const { payment_status } = changePaymentStatusDto

    await this.transactionRepository.update({ id }, { payment_status })

    response.data = null
    response.success = true

    return response
  }

  async changeTransactionStatus(request, id: number, changeTransactionStatus: ChangeTransactionStatusDto) {
    const response = new ResponseApi()
    const validator = new Validator()

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException()
    }

    const schema = {
      transaction_status: "string|empty:false"
    }

    const validate = validator.validate(changeTransactionStatus, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const transaction = await this.transactionRepository.findOne({ where: { id } })
    if (!transaction) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error("Transaction Not Found!") })
    }

    const { transaction_status } = changeTransactionStatus

    await this.transactionRepository.update({ id }, { transaction_status })

    response.data = null
    response.success = true

    return response
  }

}