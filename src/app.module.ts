import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { TransactionItem } from './entities/transaction-item.entity';
import { ProductGallery } from './entities/product-gallery.entity';
import { ProductCategory } from './entities/product-category.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthenticationModule as AdminAuthenticationModule } from './admin/authentication/authentication.module'
import { ProductCategoriesModule as AdminProductCategoriesModule } from './admin/product-categories/product-categories.module'
import { ProductsModule as AdminProductsModule } from './admin/products/products.module'
import { TransactionsModule as AdminTransactionsModule } from './admin/transactions/transactions.module'
import { DateLibModule } from '@app/date-lib';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      entities: [Product, ProductCategory, ProductGallery, Transaction, TransactionItem, User],
      logging: true,
    }),
    DateLibModule,
    UsersModule,
    ProductsModule,
    ProductCategoriesModule,
    TransactionsModule,
    AdminAuthenticationModule,
    AdminProductCategoriesModule,
    AdminProductsModule,
    AdminTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
