import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, Logger, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { TokenGuard } from '../auth/token/token.guard';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from '../usuarios/usuarios.service';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'publicaciones',
    public_id: (req, file) => `IMG_${Date.now()}`,
  } as any,
});


@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService,
    private readonly usuariosService: UsuariosService,
  ) {}

  logger = new Logger('Publicaciones');

  @Post()
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage }))
  async create(
    @Body() createPublicacioneDto: CreatePublicacioneDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const imagenUrl = file?.path ?? null;
    const usuarioId = req.idDelToken;
    const nombreUsuario = req.nombreUsuarioDelToken;

    // Buscar foto del usuario
    const usuario = await this.usuariosService.buscarPorId(usuarioId);

    createPublicacioneDto.usuarioId = usuarioId;
    createPublicacioneDto.nombreUsuario = nombreUsuario;

    return this.publicacionesService.create({
      ...createPublicacioneDto,
      imagenUrl,
      fotoPerfil: usuario!.fotoPerfil ?? '',
    });
  }

  @Get()
  @UseGuards(TokenGuard)
  listar(
    @Query('limit') limit = 5,
    @Query('offset') offset = 0,
    @Query('orden') orden = 'fecha',
    @Query('usuarioId') usuarioId?: string,
  ) {
    return this.publicacionesService.listar(+limit, +offset, orden, usuarioId);
  }

  @Post(':id/like')
  @UseGuards(TokenGuard)
  darLike(@Param('id') id: string, @Req() req: any) {
    const usuarioId = req.idDelToken;
    return this.publicacionesService.darLike(id, usuarioId);
  }

  @Delete(':id/like')
  @UseGuards(TokenGuard)
  quitarLike(@Param('id') id: string, @Req() req: any) {
    const usuarioId = req.idDelToken;
    return this.publicacionesService.quitarLike(id, usuarioId);
  }

  @Delete(':id')
  @UseGuards(TokenGuard)
  eliminar(@Param('id') id: string, @Req() req: any) {
    const usuarioId = req.idDelToken;
    const perfil = req.perfil;
    return this.publicacionesService.eliminar(id, usuarioId, perfil);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

}
