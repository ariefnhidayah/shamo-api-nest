import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCategory } from "src/entities/product-category.entity";
import { DataSource, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ResponseApi } from "src/response-api";
import { GetCategoryDto } from "./dto/get-category.dto";
const Validator = require("fastest-validator");

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory) private productCategoryRepository: Repository<ProductCategory>,
    private dataSource: DataSource
  ) { }

  async get(request, getCategoryDto: GetCategoryDto): Promise<ResponseApi> {
    const response = new ResponseApi()

    let { page, limit, q } = getCategoryDto

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
      throw new UnauthorizedException();
    }

    const categories = this.productCategoryRepository
      .createQueryBuilder('c')
      .select('id')
      .addSelect('name')
      .limit(limit)
      .offset(offset)

    if (q != '') {
      categories.where(`name like '%${q}%'`)
    }

    response.data = {
      data: await categories.getRawMany(),
      count: await categories.getCount()
    }
    response.success = true

    return response

  }

  async add(request, createCategoryDto: CreateCategoryDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()

    const schema = {
      name: "string|empty:false"
    }

    const validate = validator.validate(createCategoryDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const { name } = createCategoryDto

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      await queryRunner.manager.save(ProductCategory, {
        name: name
      })

      await queryRunner.commitTransaction()

      response.success = true

      return response
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error)
      throw new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error("") })
    }
  }

  async update(request, id: number, createCategoryDto: CreateCategoryDto): Promise<ResponseApi> {
    const response = new ResponseApi()
    const validator = new Validator()
    const category = await this.productCategoryRepository.findOne({
      where: {
        id
      }
    })

    if (!category) {
      throw new HttpException(null, HttpStatus.NOT_FOUND, { cause: new Error('Data not found!') })
    }

    const schema = {
      name: "string|empty:false"
    }

    const validate = validator.validate(createCategoryDto, schema)
    if (validate.length > 0) {
      throw new HttpException(validate, HttpStatus.BAD_REQUEST, { cause: new Error('Please fill in all fields!') })
    }

    const userData = request.user.data
    if (userData.role_id != 1) {
      throw new UnauthorizedException();
    }

    const { name } = createCategoryDto

    await this.productCategoryRepository.update({ id, }, { name })

    response.success = true
    response.data = null
    return response
  }

}