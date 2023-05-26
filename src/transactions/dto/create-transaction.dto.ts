import { TransactionItemsDto } from "./transaction-items.dto"

export class CreateTransactionDto {
  public address: string
  public shipping_price: number
  public transaction_items: TransactionItemsDto[]
}