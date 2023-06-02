import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/entities/transaction.entity";
import { Repository } from "typeorm";
import { GetsTransactionDto } from "./dto/gets-transaction.dto";
import { ResponseApi } from "src/response-api";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
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
      .limit(limit)
      .offset(offset)
      .where('t.id != 0')
      .orderBy('id', 'DESC')
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
      data: await transactions.getMany(),
      count: await transactions.getCount()
    }

    return response
  }

}