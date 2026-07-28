import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>){};

  async crear(dto: CreateUsuarioDto) {

    const existente = await this.usuarioModel.findOne({
      $or: [
        { email: dto.email },
        { nombreUsuario: dto.nombreUsuario }
      ]
    });


    if (existente) {
      if (existente.email === dto.email) {
        throw new ConflictException('El email ya está registrado');
      }
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const passHasheada = await bcrypt.hash(dto.password, 10);

    const usuario = await this.usuarioModel.create({
      ...dto,
      password: passHasheada,
      perfil: dto.perfil === 'administrador' ? 'administrador' : 'usuario',
    });

    const { password, ...data } = usuario.toObject();
    return data;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    // no paso la contraseña
    return this.usuarioModel.findById(id).select('-password'); 
  }

  listar() {
    return this.usuarioModel.find().select('-password');
  }

  async deshabilitar(id: string){
    const usuario= await this.usuarioModel.findByIdAndUpdate(
      id,
      { activo: false},
      { returnDocument: 'after' },
    ).select('-password');

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async habilitar(id: string){
    const usuario = await this.usuarioModel.findByIdAndUpdate(
      id, 
      { activo: true},
      { returnDocument: 'after' },
    ).select('-password');

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

}
