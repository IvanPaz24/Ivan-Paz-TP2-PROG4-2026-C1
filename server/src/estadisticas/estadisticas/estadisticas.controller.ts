import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { TokenGuard } from '../../auth/token/token.guard';
import { AdminGuard } from '../../auth/token/admin/admin.guard';

@Controller('estadisticas')
@UseGuards(TokenGuard, AdminGuard)
export class EstadisticasController {

    constructor(private readonly estadisticasService: EstadisticasService){}

    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(
        @Query('desde') desde: string,
        @Query('hasta') hasta: string,
    ) {
        return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
    }

    @Get('comentarios-por-tiempo')
    comentariosPorTiempo(
        @Query('desde') desde: string,
        @Query('hasta') hasta: string,
    ) {
        return this.estadisticasService.comentariosPorTiempo(desde, hasta);
    }

    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(
        @Query('desde') desde: string,
        @Query('hasta') hasta: string,
    ) {
        return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
    }
}
