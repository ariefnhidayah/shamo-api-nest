import { ProductCategory } from './product-category.entity';
import { ProductGallery } from './product-gallery.entity';
import { Product } from './product.entity';
import { Role } from './role.entities';
import { TransactionItem } from './transaction-item.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

module.exports = [
  Product,
  ProductCategory,
  ProductGallery,
  Transaction,
  TransactionItem,
  User,
  Role,
];
