import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;
}