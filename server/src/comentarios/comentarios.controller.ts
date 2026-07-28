import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { TokenGuard } from '../auth/token/token.guard';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseGuards(TokenGuard)
  async create(@Body() dto: CreateComentarioDto,
  @Req() req: any) {
    dto.usuarioId = req.idDelToken;
    dto.nombreUsuario = req.nombreUsuarioDelToken;

    // console.log('DTO recibido:', dto);
    // console.log('idDelToken:', req.idDelToken);
    return this.comentariosService.create(dto);
  }

  @Get(':publicacionId')
  @UseGuards(TokenGuard)
  listar(@Param('publicacionId') publicacionId: string,
        @Query('limit') limit: number){
    return this.comentariosService.listar(publicacionId, +limit);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  editar(
    @Param('id') id: string,
    @Body('contenido') contenido: string,
    @Req() req: any){
    return this.comentariosService.editar(id, contenido, req.idDelToken);
  }

  @Get()
  findAll() {
    return this.comentariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComentarioDto: UpdateComentarioDto) {
    return this.comentariosService.update(+id, updateComentarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentariosService.remove(+id);
  }
}
