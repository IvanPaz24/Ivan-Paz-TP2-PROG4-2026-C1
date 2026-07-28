import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, 
        { message: 'El nombre solo puede contener letras' })
    nombre: string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, 
    { message: 'El apellido solo puede contener letras' })
    apellido: string;
    
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    @Matches(/^[a-zA-Z0-9_]{3,20}$/, { message: 'Nombre de usuario inválido' })
    nombreUsuario: string;
    
    @IsDateString()
    fechaNacimiento: Date;
    
    @IsString()
    @MinLength(6)
    @MaxLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 
    'La contraseña debe tener al menos una mayúscula y un número' })
    password: string;
    
    @IsString()
    @IsOptional()
    descripcion: string;
    
    @IsString()
    @IsOptional()
    fotoPerfil: string;
    
    @IsOptional()
    @IsString()
    @IsIn(['usuario','administrador'])
    perfil?: string;
}
