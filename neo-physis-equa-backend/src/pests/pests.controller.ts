import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PestsService } from './pests.service';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';

@Controller('pests')
export class PestsController {
  constructor(private readonly pestsService: PestsService) {}

  @Post()
  create(@Body() createPestDto: CreatePestDto) {
    return this.pestsService.create(createPestDto);
  }

  @Get()
  findAll() {
    return this.pestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePestDto: UpdatePestDto) {
    return this.pestsService.update(id, updatePestDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pestsService.remove(id);
  }
}
