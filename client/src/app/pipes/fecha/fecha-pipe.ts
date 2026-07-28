import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {
  transform(value: string | Date): string {
    const ahora = new Date();
    const fecha = new Date(value);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHs = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHs / 24)

    if (diffMin < 1) return 'Justo ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHs < 24) return `Hace ${diffHs} h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;

    return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
