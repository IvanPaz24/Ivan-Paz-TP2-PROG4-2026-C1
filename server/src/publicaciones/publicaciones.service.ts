import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacione.entity';
import { Model } from 'mongoose';

@Injectable()
export class PublicacionesService {

  constructor(@InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>){
  }

  create(createPublicacioneDto: CreatePublicacioneDto) {
    const nueva = new this.PublicacionModel(createPublicacioneDto);
    return nueva.save();
  }

  async listar(limit: number, offset: number, orden: string, usuarioId?: string){
    const filtro: any = { bajaLogica: false};

    if (usuarioId) {
      filtro.usuarioId = usuarioId;
    }

    const ordenamiento: Record<string, 1 | -1> = orden === 'likes'
      ? { cantidadLikes: -1 }
      : { createdAt: -1 };

    const [publicaciones, total] = await Promise.all([
      this.PublicacionModel.find(filtro)
      .sort(ordenamiento)
      .skip(offset)
      .limit(limit),
      this.PublicacionModel.countDocuments(filtro),
    ]);

    return {publicaciones, total};
  }

  async darLike(id: string, usuarioId: string) {
    const pub = await this.PublicacionModel.findById(id);
    
    if (!pub){
      throw new NotFoundException('Publicacion no encontrada');
    }
      
    if (pub.likes.includes(usuarioId)){
      return pub;
    } 

    pub.likes.push(usuarioId);
    pub.cantidadLikes = pub.likes.length;
    return pub.save();
  }

  async quitarLike(id: string, usuarioId: string) {
    const pub = await this.PublicacionModel.findById(id);
    
    if (!pub){
      throw new NotFoundException('Publicacion no encontrada');
    } 

    pub.likes = pub.likes.filter(userId => userId !== usuarioId);
    pub.cantidadLikes = pub.likes.length;
    return pub.save();
  }

  async eliminar(id: string, usuarioId: string, perfil: string) {
    const pub = await this.PublicacionModel.findById(id);
    console.log('id publicacion:', id);
    console.log('usuarioId recibido:', usuarioId);

    
    if (!pub){
      throw new NotFoundException('Publicacion no encontrada');
    } 

    const esDueño = pub.usuarioId.toString() === usuarioId.toString();
    const esAdmin = perfil === 'administrador';

    if (!esDueño && !esAdmin) {
        throw new ForbiddenException('No podés eliminar esta publicacion');
    }
      
    pub.bajaLogica = true;
    return pub.save();
  }

  findAll() {
    return `This action returns all publicaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacioneDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }
}
