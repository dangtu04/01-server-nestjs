import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateVariantsDto } from './dto/update-product.dto';
import { Roles } from '@/decorator/customize';
import { UserRole } from '@/enum/user.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File, // Optional file
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.productsService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, file);
  }

  @Put(':id/variants')
  async updateVariants(
    @Param('id') id: string,
    @Body() updateVariantsDto: UpdateVariantsDto,
  ) {
    return this.productsService.updateVariants(id, updateVariantsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/images-detail')
  @UseInterceptors(FilesInterceptor('images'))
  bulkAddImages(
    @Param('id') id: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.productsService.bulkAddImages(id, files);
  }

  @Get(':id/images-detail')
  findAllImages(@Param('id') id: string) {
    return this.productsService.findAllImages(id);
  }

  @Patch(':id/images-detail')
  @UseInterceptors(FilesInterceptor('images'))
  bulkUpdateImages(
    @Param('id') id: string,
    @UploadedFiles() files?: Express.Multer.File[],
    @Body('publicIdsToKeep') publicIdsToKeep?: string[],
  ) {
    return this.productsService.bulkUpdateImages(id, files, publicIdsToKeep);
  }
}
