import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasServices {

  http = inject(HttpClient);

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  publicacionesPorUsuario(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      { headers: this.headers() }
    );
  }

  comentariosPorTiempo(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/comentarios-por-tiempo?desde=${desde}&hasta=${hasta}`,
      { headers: this.headers() }
    );
  }

  comentariosPorPublicacion(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/estadisticas/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`,
      { headers: this.headers() }
    );
  }
}
