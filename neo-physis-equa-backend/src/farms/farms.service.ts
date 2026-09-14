import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async create(ownerId: string, dto: CreateFarmDto): Promise<Farm> {
    const farm = this.farmRepository.create({
      ...dto,
      ownerId,
    });
    return this.farmRepository.save(farm);
  }

  async findAllByOwner(ownerId: string): Promise<Farm[]> {
    return this.farmRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, ownerId?: string): Promise<Farm> {
    const whereCondition = ownerId ? { id, ownerId } : { id };
    const farm = await this.farmRepository.findOne({ where: whereCondition });
    if (!farm) {
      throw new NotFoundException(`Finca con ID ${id} no encontrada.`);
    }
    return farm;
  }

  async update(id: string, ownerId: string, dto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findOne(id, ownerId);
    Object.assign(farm, dto);
    return this.farmRepository.save(farm);
  }

  async remove(id: string, ownerId: string): Promise<{ message: string }> {
    const farm = await this.findOne(id, ownerId);
    await this.farmRepository.remove(farm);
    return { message: `Finca con ID ${id} eliminada correctamente.` };
  }
}
