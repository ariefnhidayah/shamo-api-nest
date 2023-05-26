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
console.log(__dirname + "/../src/entities/*.entity.ts")
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
    UsersModule,
    ProductsModule,
    ProductCategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
