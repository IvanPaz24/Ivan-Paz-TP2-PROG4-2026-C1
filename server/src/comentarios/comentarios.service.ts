import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './entities/comentario.entity';
import { Model } from 'mongoose';

@Injectable()
export class ComentariosService {
  constructor(@InjectModel(Comentario.name) private comentarioModel: Model<Comentario>){
  }

  create(dto: CreateComentarioDto) {
    const nuevo = new this.comentarioModel(dto);
    return nuevo.save();
  }

  listar(publicacionId: string, limit: number){
    return this.comentarioModel.find({
      publicacionId}).sort({createdAt: -1}).limit(limit)
  }

  async editar(id: string, contenido: string, usuarioId: string){
    const comentario = await this.comentarioModel.findById(id);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comentario!.usuarioId !== usuarioId.toString()) {
      throw new UnauthorizedException('No podes editar este comentario');
    }

    comentario!.contenido = contenido;
    comentario!.editado = true;
    
    return comentario!.save();
  }
  
  findAll() {
    return `This action returns all comentarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} comentario`;
  }

  remove(id: number) {
    return `This action removes a #${id} comentario`;
  }
}
