import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    @Prop({ unique: true })
    email: string;

    @Prop()
    nombre: string;

    @Prop()
    apellido: string;

    @Prop()
    nombreUsuario: string;
    
    @Prop()
    fechaNacimiento: Date;
    
    @Prop()
    password: string;
    
    @Prop()
    descripcion: string;
    
    @Prop()
    fotoPerfil: string;
        
    @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' })
    perfil: string;

    @Prop({ default: true })
    activo: boolean;
}   

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
