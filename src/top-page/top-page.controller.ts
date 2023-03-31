import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { IDValidationPipe } from 'src/pipes/id-validation.pipe';
import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseFilters(MongoExceptionFilter)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IDValidationPipe) id: string) {
    const topPage = await this.topPageService.findById(id);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPage = await this.topPageService.findByAlias(alias);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return topPage;
  }

  @Delete(':id')
  async delete(@Param('id', IDValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deleteById(id);

    if (!deletedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return deletedTopPage;
  }

  @Patch(':id')
  async patch(
    @Param('id', IDValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedTopPage = await this.topPageService.updateById(id, dto);

    if (!updatedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }
    return updatedTopPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }
}
