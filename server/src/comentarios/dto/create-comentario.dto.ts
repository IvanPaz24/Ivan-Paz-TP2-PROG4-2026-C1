import { IsOptional, IsString } from "class-validator";

export class CreateComentarioDto {
    @IsString()
    contenido: string;
    
    @IsString()
    publicacionId: string;
    
    @IsOptional()
    @IsString()
    usuarioId: string;

    @IsOptional()
    @IsString()
    emailDelToken?: string;
    
    @IsOptional()
    @IsString()
    nombreUsuario: string;
    
    @IsOptional()
    @IsString()
    idDelToken: string;

    @IsOptional()
    @IsString()
    nombreUsuarioDelToken: string;
    
}
