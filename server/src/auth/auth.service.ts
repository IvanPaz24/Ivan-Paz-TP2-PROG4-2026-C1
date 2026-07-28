import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginDto } from './login.dto';
import { sign } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>){};

    async registrar(dto : CreateUsuarioDto ){
        try {  
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
            const usuario = await this.usuarioModel.create({...dto,
                password: passHasheada,
                perfil: dto.perfil === 'administrador' ? 'administrador' : 'usuario',
            });
            
            const payload = {
                email: usuario.email,
                // exp: Date.now() + 60 * 15, 
                _id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                perfil: usuario.perfil, 
            };
    
            const jwt = sign(payload, process.env.CLAVE_SECRETA!, {
                algorithm: 'HS256',
                // audience: 'registro',
                expiresIn: '3m',
            });
    
    
            return {mensaje: "Usuario registrado", token: jwt, usuarioId: usuario._id};
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; 
            }
            throw new UnauthorizedException();
        }   
        
    }

    async login(dto : LoginDto){
        const usuario = await this.usuarioModel.findOne({
        $or: [
            { email: dto.usuario },
            { nombreUsuario: dto.usuario }, // reutilizamos el campo email para buscar ambos
        ]
        });

        if (!usuario) {
            // console.log('Usuario no encontrado');
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if (!usuario.activo) {
            throw new UnauthorizedException('Tu cuenta está deshabilitada.');        
        }

          
        console.log('Password ingresada:', dto.password);
        console.log('Password en BD:', usuario.password);

        const passCorrecta = await bcrypt.compare(dto.password, usuario.password);
        console.log('Pass correcta:', passCorrecta);

        if (!passCorrecta) {
            // console.log('Email o contraseña incorrectos');
            throw new UnauthorizedException('Email o contraseña incorrectos');
        }

        const payload = {
            email: usuario.email,
            _id: usuario._id,
            nombreUsuario: usuario.nombreUsuario,
            perfil: usuario.perfil,
        };

        console.log(payload);

        const jwt = sign(payload, process.env.CLAVE_SECRETA!, {
            algorithm: 'HS256',
            expiresIn: '3m',
        });

        return { mensaje: 'Login exitoso', token: jwt , usuarioId: usuario._id};
    }

    async renovar(id: string, email: string, nombreUsuario: string) {
        const usuario = await this.usuarioModel.findById(id);

        if (!usuario) {
            throw new UnauthorizedException();
        }

        const jwt = sign(
            { 
                _id: usuario._id, 
                email: usuario.email, 
                nombreUsuario: usuario.nombreUsuario,
                perfil: usuario.perfil,
            },
            process.env.CLAVE_SECRETA!,
            { algorithm: 'HS256', expiresIn: '5m' }
        );

        return { token: jwt };
    }   
}
