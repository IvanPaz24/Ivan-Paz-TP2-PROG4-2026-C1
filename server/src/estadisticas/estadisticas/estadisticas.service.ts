import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from '../../comentarios/entities/comentario.entity';
import { Publicacion } from '../../publicaciones/entities/publicacione.entity';

@Injectable()
export class EstadisticasService {
    constructor(
        @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
        @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>,
    ) {}    

    parseFechas(desde: string, hasta: string) {
        const fechaDesde = new Date(`${desde}T00:00:00.000Z`);
        const fechaHasta = new Date(`${hasta}T23:59:59.999Z`);
        return { fechaDesde, fechaHasta };
    }

    async publicacionesPorUsuario(desde: string, hasta: string) {

        const { fechaDesde, fechaHasta } = this.parseFechas(desde, hasta);

        const resultado = await this.publicacionModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $toDate: '$_id' }, fechaDesde] },
                            { $lte: [{ $toDate: '$_id' }, fechaHasta] },
                        ]
                    }
                },
            },
            {
                $group: {
                    _id: '$nombreUsuario',
                    cantidad: { $sum: 1 },
                },
            },
            { $sort: { cantidad: -1 } },
            ]);
            return resultado.map(r => ({
                usuario: r._id,
                cantidad: r.cantidad,
            }));
        }


    async comentariosPorTiempo(desde: string, hasta: string) {

        const { fechaDesde, fechaHasta } = this.parseFechas(desde, hasta);
        const resultado = await this.comentarioModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $toDate: '$_id' }, fechaDesde] },
                            { $lte: [{ $toDate: '$_id' }, fechaHasta] },
                        ]
                    }
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$_id' } },
                    },
                    cantidad: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return resultado.map(r => ({
            fecha: r._id,
            cantidad: r.cantidad,
        }));
    }

    async comentariosPorPublicacion(desde: string, hasta: string) {
        
        const { fechaDesde, fechaHasta } = this.parseFechas(desde, hasta);
        const resultado = await this.comentarioModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $toDate: '$_id' }, fechaDesde] },
                            { $lte: [{ $toDate: '$_id' }, fechaHasta] },
                        ]
                    }
                },
            },
            {
                $group: {
                    _id: '$publicacionId',
                    cantidad: { $sum: 1 },
                },
            },
            { $sort: { cantidad: -1 } },
            { $limit: 10 },
        ]);
        const conDatos = await Promise.all(
            resultado.map(async (r) => {
                const pub = await this.publicacionModel
                    .findById(r._id)
                    .select('titulo nombreUsuario')
                    .lean();
                return {
                    publicacion: pub?.titulo ?? `Publicación ${r._id}`,
                    usuario: pub?.nombreUsuario ?? 'Desconocido',
                    cantidad: r.cantidad,
                };
            })
        );
        return conDatos;
    }
}
