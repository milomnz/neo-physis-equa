import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const crop = this.cropRepository.create(createCropDto);
    return await this.cropRepository.save(crop);
  }

  async findAll(farmId?: string): Promise<Crop[]> {
    const where = farmId ? { farmId } : {};
    return await this.cropRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: { farm: true },
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: { farm: true },
    });

    if (!crop) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    this.cropRepository.merge(crop, updateCropDto);
    return await this.cropRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);
    await this.cropRepository.remove(crop);
  }
}
