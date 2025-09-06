import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';

class FiltersDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  sku?: string;
}

export class SearchProductsDto {
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsObject()
  filters?: FiltersDto;
}