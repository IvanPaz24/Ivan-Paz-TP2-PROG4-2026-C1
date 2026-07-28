import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true }) 
export class Publicacion {
  @Prop()
  titulo: string;

  @Prop()
  descripcion: string;

  @Prop()
  imagenUrl: string;

  @Prop()
  usuarioId: string;

  @Prop()
  nombreUsuario: string;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({default: 0})
  cantidadLikes: number;

  @Prop({default:false})
  bajaLogica: boolean;

  @Prop({ default: '' })
  fotoPerfil: string;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
