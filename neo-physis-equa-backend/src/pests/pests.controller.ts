import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PestsService } from './pests.service';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/pests')
export class PestsController {
  constructor(private readonly pestsService: PestsService) {}

  @Post()
  create(@Body() createPestDto: CreatePestDto) {
    return this.pestsService.create(createPestDto);
  }

  @Get()
  findAll(@Query('cropId') cropId?: string) {
    return this.pestsService.findAll(cropId);
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
