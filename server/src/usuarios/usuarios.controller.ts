import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, ValidationPipe, UsePipes } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { TokenGuard } from '../auth/token/token.guard';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/token/admin/admin.guard';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fotosPerfil',
    public_id: (req, file) => `IMG_${Date.now()}`,
  } as any,
});


@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    // return this.usuariosService.create(createUsuarioDto);
  }

  @Get('user')
  @UseGuards(TokenGuard)
  getUser(@Req() req: any) {
    return this.usuariosService.buscarPorId(req.idDelToken);
  }

  @Get()
  @UseGuards(TokenGuard, AdminGuard)
  listar() {
    return this.usuariosService.listar();
  }

  @Post('crear')
  @UseGuards(TokenGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  crear(@Body() dto: CreateUsuarioDto & { perfil?: string }, 
  @UploadedFile() file: Express.Multer.File) {
    const fotoPerfil = file?.path ?? null;
    return this.usuariosService.crear({ ...dto, fotoPerfil });
  }

  @Delete(':id')
  @UseGuards(TokenGuard, AdminGuard)
  deshabilitar(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }

  @Post(':id/habilitar')
  @UseGuards(TokenGuard, AdminGuard)
  habilitar(@Param('id') id: string) {
    return this.usuariosService.habilitar(id);
  }

}

