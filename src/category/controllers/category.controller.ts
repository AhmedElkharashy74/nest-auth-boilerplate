import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from '../application/services/category.service';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { UpdateCategoryDto } from '../application/dtos/update-category.dto';
import { CategoryResponseDto } from '../application/dtos/category-response.dto';



@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(
      createCategoryDto.name,
      createCategoryDto.description,
      createCategoryDto.slug,
    );
    return new CategoryResponseDto(category);
  }

  @Get()
  async findAll() {
    const categories = await this.categoryService.getAllCategories();
    return categories.map((category) => new CategoryResponseDto(category));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.getCategoryById(id);
    return new CategoryResponseDto(category);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.getCategoryBySlug(slug);
    return new CategoryResponseDto(category);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.updateCategory(id, {
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
      slug: updateCategoryDto.slug,
    });
    return new CategoryResponseDto(category);
  }

  @Put(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.activateCategory(id);
    return new CategoryResponseDto(category);
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.deactivateCategory(id);
    return new CategoryResponseDto(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteCategory(id);
  }
}