import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Size } from './schemas/size.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class SizesService {
  constructor(@InjectModel(Size.name) private sizeModel: Model<Size>) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      // Ensure code normalization if provided
      if (createSizeDto.code) {
        createSizeDto.code = createSizeDto.code.toUpperCase().trim();
      }
      const size = await this.sizeModel.create(createSizeDto);
      return { _id: size._id };
    } catch (error) {
      // Mongo duplicate key
      if (error.code === 400) {
        throw new BadRequestException('Size code already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const results = await this.sizeModel.find().sort({ order: 1 }).lean();
    return { results };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid size id');
    }
    const size = await this.sizeModel.findById(id);
    if (!size) {
      throw new NotFoundException(`Size with id ${id} not found`);
    }
    return size;
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid size id');
    }

    const updateData: any = { ...updateSizeDto };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
    }

    const updated = await this.sizeModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException(`Size with id ${id} not found`);
    }

    return { message: 'Update size successfully!' };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid size id');
    }
    const deleted = await this.sizeModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Size with id ${id} not found`);
    }
    return { message: 'Delete size successfully!' };
  }

  async getAllSizesForSelect() {
    const results = await this.sizeModel
      .find()
      .select('_id name')
      .lean()
      .exec();
    return {
      results,
    };
  }
}
