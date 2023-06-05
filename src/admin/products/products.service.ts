import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseApi } from 'src/response-api';
import { ProductGallery } from 'src/entities/product-gallery.entity';
import { ProductCategory } from 'src/entities/product-category.entity';
import { GetsProductDto } from './dto/gets-product.dto';
import { DateLibService } from '@app/date-lib';
const Validator = require('fastest-validator');

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductGallery)
    private productGalleryRepository: Repository<ProductGallery>,
    private dataSource: DataSource,
    private dateLibService: DateLibService,
  ) {}

  async add(request, createProductDto: CreateProductDto): Promise<ResponseApi> {
    const response = new ResponseApi();
    const validator = new Validator();

    const schema = {
      name: 'string|empty:false',
      price: 'number|empty:false',
      description: 'string',
      tags: 'string',
      category_id: 'number|empty:false',
      product_galleries: 'array',
    };

    const validate = validator.validate(createProductDto, schema);
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, {
        cause: new Error('Please fill in all fields!'),
      });
    }

    const userData = request.user.data;
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const { name, category_id, description, price, product_galleries, tags } =
      createProductDto;

    const category = await this.productCategoryRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, {
        cause: new Error('Category not found!'),
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.save(Product, {
        name,
        category_id,
        description,
        price,
        tags,
      });

      for (const gallery of product_galleries) {
        await queryRunner.manager.save(ProductGallery, {
          url: gallery.url,
          is_primary: gallery.is_primary,
          product_id: product.id,
        });
      }

      await queryRunner.commitTransaction();

      response.success = true;
      response.data = null;

      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: new Error(''),
      });
    }
  }

  async update(
    request,
    id: number,
    createProductDto: CreateProductDto,
  ): Promise<ResponseApi> {
    const response = new ResponseApi();
    const validator = new Validator();

    const schema = {
      name: 'string|empty:false',
      price: 'number|empty:false',
      description: 'string',
      tags: 'string',
      category_id: 'number|empty:false',
      product_galleries: 'array',
    };

    const validate = validator.validate(createProductDto, schema);
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, {
        cause: new Error('Please fill in all fields!'),
      });
    }

    const userData = request.user.data;
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(validate, HttpStatus.NOT_FOUND, {
        cause: new Error('Product not found!'),
      });
    }

    const { name, category_id, description, price, product_galleries, tags } =
      createProductDto;

    const category = await this.productCategoryRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, {
        cause: new Error('Category not found!'),
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        Product,
        { id },
        {
          name,
          category_id,
          description,
          price,
          tags,
        },
      );

      await queryRunner.manager.delete(ProductGallery, { product_id: id });

      for (const gallery of product_galleries) {
        await queryRunner.manager.save(ProductGallery, {
          url: gallery.url,
          is_primary: gallery.is_primary,
          product_id: product.id,
        });
      }

      await queryRunner.commitTransaction();

      response.success = true;
      response.data = null;

      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: new Error(''),
      });
    }
  }

  async gets(request, getsProductDto: GetsProductDto): Promise<ResponseApi> {
    const response = new ResponseApi();

    let { page, limit, q, category_id } = getsProductDto;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    if (!q) {
      q = '';
    }

    const offset = (page - 1) * limit;

    const userData = request.user.data;
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const products = this.productsRepository
      .createQueryBuilder('p')
      .select('p.id')
      .addSelect('p.name')
      .addSelect('p.price')
      .addSelect('p.description')
      .addSelect('p.tags')
      .limit(limit)
      .offset(offset)
      .leftJoin('p.category', 'category')
      .addSelect(['category.name'])
      .leftJoin('p.galleries', 'galleries', 'galleries.is_primary = 1')
      .addSelect(['galleries.url'])
      .where('p.deleted_at is null')
      .andWhere('category.deleted_at is null');

    if (category_id != null && category_id != undefined) {
      products.andWhere('p.category_id = :category_id', { category_id });
    }

    if (q != '') {
      products.andWhere('p.name like "%:q%"', { q });
    }

    response.data = {
      data: await products.getMany(),
      count: await products.getCount(),
    };

    response.success = true;

    return response;
  }

  async get(request, id: number): Promise<ResponseApi> {
    const response = new ResponseApi();

    const userData = request.user.data;
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const product = await this.productsRepository
      .createQueryBuilder('p')
      .select('p.id')
      .addSelect('p.name')
      .addSelect('p.price')
      .addSelect('p.description')
      .addSelect('p.tags')
      .addSelect('p.viewed')
      .addSelect('p.category_id')
      .leftJoin('p.category', 'category')
      .where('p.id = :id', { id })
      .andWhere('p.deleted_at is null')
      .andWhere('category.deleted_at is null')
      .getOne();

    if (!product) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, {
        cause: new Error('Product not found!'),
      });
    }

    const galleries = await this.productGalleryRepository.find({
      where: { product_id: id },
    });

    response.data = {
      ...product,
      galleries,
    };
    response.success = true;

    return response;
  }

  async delete(request, id: number): Promise<ResponseApi> {
    const response = new ResponseApi();

    const userData = request.user.data;
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, {
        cause: Error('Data not found!'),
      });
    }

    await this.productsRepository.update(
      {
        id,
      },
      {
        deleted_at: this.dateLibService.getDateNow(),
      },
    );

    response.success = true;

    return response;
  }
}
