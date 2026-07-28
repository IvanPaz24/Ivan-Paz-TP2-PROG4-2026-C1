import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema ({ timestamps : true })
export class Comentario {
    @Prop ({required: true})
    contenido: string;

    @Prop ({required: true})
    usuarioId: string;

    @Prop ({required: true})
    nombreUsuario: string;

    @Prop ({required: true})
    publicacionId: string;

    
    @Prop ({ default: false })
    editado: boolean;

}

export const ComentariosSchema = SchemaFactory.createForClass(Comentario);