import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(createDto: CreateProductoDto) {
    const exists = await this.productoRepo.findOne({ where: { sku: createDto.sku } });
    if (exists) throw new ConflictException('SKU ya existe');

    const nuevo = this.productoRepo.create(createDto);
    return this.productoRepo.save(nuevo);
  }

  async update(id: number, updateDto: UpdateProductoDto) {
    if (updateDto.stock !== undefined && updateDto.stock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    await this.productoRepo.update(id, updateDto);
    return this.productoRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const producto = await this.productoRepo.findOne({ where: { id } });
    if (!producto) throw new BadRequestException('Producto no encontrado');
    if (producto.stock > 0) throw new BadRequestException('No se puede eliminar un producto con stock');

    await this.productoRepo.remove(producto);
    return { message: 'Producto eliminado' };
  }

  async search(dto: SearchProductsDto) {
    const { page = 1, limit = 10, sortBy = 'id', order = 'ASC', filters = {} } = dto;

    const query: any = {};
    if (filters.nombre) query.nombre = Like(`%${filters.nombre}%`);
    if (filters.descripcion) query.descripcion = Like(`%${filters.descripcion}%`);
    if (filters.sku) query.sku = filters.sku;
    if (filters.id) query.id = filters.id;

    const [data, totalItems] = await this.productoRepo.findAndCount({
      where: query,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
  }
  async findOne(id: number) {
  return this.productoRepo.findOne({ where: { id } });
}
}