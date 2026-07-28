import { IsString, IsOptional } from 'class-validator';

export class CreatePublicacioneDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl: string;

  @IsOptional()
  @IsString()
  usuarioId: string;

  @IsOptional()
  @IsString()
  nombreUsuario: string;

  @IsOptional()
  @IsString()
  idDelToken: string;

  @IsOptional()
  @IsString()
  nombreUsuarioDelToken: string;

  @IsOptional()
  @IsString()
  emailDelToken?: string;

  @IsString()
  @IsOptional()
  fotoPerfil: string;
}