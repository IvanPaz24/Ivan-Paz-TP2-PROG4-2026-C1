import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentariosSchema } from './entities/comentario.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentariosSchema }
    ])
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
