import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Inject,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
  } from '@nestjs/swagger';
  import { PACKAGE_SERVICE_TOKEN } from '../domain/services/package.service';
  import type { PackageServiceInterface} from '../domain/services/package.service';
  import {  ITEM_SERVICE_TOKEN } from '../domain/services/package.service';
  import type { ItemServiceInterface } from '../domain/services/package.service';
  import { CreatePackageDto } from '../application/dtos/create-package.dto';
  import { UpdatePackageDto } from '../application/dtos/update-package.dto';
  import { CreateItemDto } from '../application/dtos/create-item.dto';
  import { UpdateItemDto } from '../application/dtos/update-item.dto';
  import { AddItemToPackageDto } from '../application/dtos/add-item-to-package.dto';
  import { PackageResponseDto } from '../application/dtos/package-response.dto';
  import { ItemResponseDto } from '../application/dtos/item-response.dto';
  import { plainToInstance } from 'class-transformer';
  
  @ApiTags('packages')
  @Controller('packages')
  export class PackageController {
    constructor(
      @Inject(PACKAGE_SERVICE_TOKEN)
      private readonly packageService: PackageServiceInterface,
    ) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new package' })
    @ApiResponse({ status: 201, description: 'Package created successfully', type: PackageResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create(@Body() createPackageDto: CreatePackageDto): Promise<PackageResponseDto> {
      const packageEntity = await this.packageService.createPackage(createPackageDto);
      return plainToInstance(PackageResponseDto, {
        ...packageEntity,
        items: packageEntity.packageItems?.map(pi => pi.item),
        totalPrice: packageEntity.calculateTotalPrice(),
      });
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all packages' })
    @ApiResponse({ status: 200, description: 'List of packages', type: [PackageResponseDto] })
    async findAll(): Promise<PackageResponseDto[]> {
      const packages = await this.packageService.getAllPackages();
      return packages.map(pkg => 
        plainToInstance(PackageResponseDto, {
          ...pkg,
          items: pkg.packageItems?.map(pi => pi.item),
          totalPrice: pkg.calculateTotalPrice(),
        })
      );
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a package by ID' })
    @ApiParam({ name: 'id', description: 'Package ID' })
    @ApiResponse({ status: 200, description: 'Package details', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PackageResponseDto> {
      const packageEntity = await this.packageService.getPackageById(id);
      return plainToInstance(PackageResponseDto, {
        ...packageEntity,
        items: packageEntity.packageItems?.map(pi => pi.item),
        totalPrice: packageEntity.calculateTotalPrice(),
      });
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a package' })
    @ApiParam({ name: 'id', description: 'Package ID' })
    @ApiResponse({ status: 200, description: 'Package updated successfully', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePackageDto: UpdatePackageDto,
    ): Promise<PackageResponseDto> {
      const packageEntity = await this.packageService.updatePackage(id, updatePackageDto);
      return plainToInstance(PackageResponseDto, {
        ...packageEntity,
        items: packageEntity.packageItems?.map(pi => pi.item),
        totalPrice: packageEntity.calculateTotalPrice(),
      });
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a package' })
    @ApiParam({ name: 'id', description: 'Package ID' })
    @ApiResponse({ status: 204, description: 'Package deleted successfully' })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.packageService.deletePackage(id);
    }
  
    @Post(':id/items')
    @ApiOperation({ summary: 'Add an item to a package' })
    @ApiParam({ name: 'id', description: 'Package ID' })
    @ApiBody({ type: AddItemToPackageDto })
    @ApiResponse({ status: 201, description: 'Item added to package successfully' })
    @ApiResponse({ status: 404, description: 'Package or item not found' })
    async addItemToPackage(
      @Param('id', ParseIntPipe) packageId: number,
      @Body() addItemToPackageDto: AddItemToPackageDto,
    ): Promise<void> {
      await this.packageService.addItemToPackage(packageId, addItemToPackageDto.itemId);
    }
  
    @Delete(':packageId/items/:itemId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove an item from a package' })
    @ApiParam({ name: 'packageId', description: 'Package ID' })
    @ApiParam({ name: 'itemId', description: 'Item ID' })
    @ApiResponse({ status: 204, description: 'Item removed from package successfully' })
    @ApiResponse({ status: 404, description: 'Package or item not found' })
    async removeItemFromPackage(
      @Param('packageId', ParseIntPipe) packageId: number,
      @Param('itemId', ParseIntPipe) itemId: number,
    ): Promise<void> {
      await this.packageService.removeItemFromPackage(packageId, itemId);
    }
  
    @Get(':id/price')
    @ApiOperation({ summary: 'Calculate total price of a package' })
    @ApiParam({ name: 'id', description: 'Package ID' })
    @ApiResponse({ status: 200, description: 'Package total price calculated' })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async calculatePrice(@Param('id', ParseIntPipe) id: number): Promise<{ totalPrice: number }> {
      const totalPrice = await this.packageService.calculatePackagePrice(id);
      return { totalPrice };
    }
  
    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Get packages by category' })
    @ApiParam({ name: 'categoryId', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'List of packages in category', type: [PackageResponseDto] })
    async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<PackageResponseDto[]> {
      const packages = await this.packageService.getPackagesByCategory(categoryId);
      return packages.map(pkg => 
        plainToInstance(PackageResponseDto, {
          ...pkg,
          items: pkg.packageItems?.map(pi => pi.item),
          totalPrice: pkg.calculateTotalPrice(),
        })
      );
    }
  }
  
  @ApiTags('items')
  @Controller('items')
  export class ItemController {
    constructor(
      @Inject(ITEM_SERVICE_TOKEN)
      private readonly itemService: ItemServiceInterface,
    ) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new item' })
    @ApiResponse({ status: 201, description: 'Item created successfully', type: ItemResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
      const item = await this.itemService.createItem(createItemDto);
      return plainToInstance(ItemResponseDto, item);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all items' })
    @ApiResponse({ status: 200, description: 'List of items', type: [ItemResponseDto] })
    async findAll(): Promise<ItemResponseDto[]> {
      const items = await this.itemService.getAllItems();
      return items.map(item => plainToInstance(ItemResponseDto, item));
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get an item by ID' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiResponse({ status: 200, description: 'Item details', type: ItemResponseDto })
    @ApiResponse({ status: 404, description: 'Item not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ItemResponseDto> {
      const item = await this.itemService.getItemById(id);
      return plainToInstance(ItemResponseDto, item);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update an item' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiResponse({ status: 200, description: 'Item updated successfully', type: ItemResponseDto })
    @ApiResponse({ status: 404, description: 'Item not found' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateItemDto: UpdateItemDto,
    ): Promise<ItemResponseDto> {
      const item = await this.itemService.updateItem(id, updateItemDto);
      return plainToInstance(ItemResponseDto, item);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an item' })
    @ApiParam({ name: 'id', description: 'Item ID' })
    @ApiResponse({ status: 204, description: 'Item deleted successfully' })
    @ApiResponse({ status: 404, description: 'Item not found' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.itemService.deleteItem(id);
    }
  }