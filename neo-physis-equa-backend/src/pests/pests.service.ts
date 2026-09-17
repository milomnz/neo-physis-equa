import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pest } from './entities/pest.entity';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';

@Injectable()
export class PestsService {
  constructor(
    @InjectRepository(Pest)
    private readonly pestRepository: Repository<Pest>,
  ) {}

  async create(createPestDto: CreatePestDto): Promise<Pest> {
    const pest = this.pestRepository.create(createPestDto);
    return await this.pestRepository.save(pest);
  }

  async findAll(): Promise<Pest[]> {
    return await this.pestRepository.find();
  }

  async findOne(id: string): Promise<Pest> {
    const pest = await this.pestRepository.findOne({ where: { id } });

    if (!pest) {
      throw new NotFoundException(`Pest with ID ${id} not found`);
    }

    return pest;
  }

  async update(id: string, updatePestDto: UpdatePestDto): Promise<Pest> {
    const pest = await this.findOne(id);
    this.pestRepository.merge(pest, updatePestDto);
    return await this.pestRepository.save(pest);
  }

  async remove(id: string): Promise<void> {
    const pest = await this.findOne(id);
    await this.pestRepository.remove(pest);
  }
}
