import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComentariosServices {
  http = inject(HttpClient);

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }


  crear(contenido: string, publicacionId: string) {

    return this.http.post(`${environment.apiUrl}/comentarios`, 
      {publicacionId, contenido }, { headers: this.headers() });
  }

  listar(publicacionId: string, limit: number) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/comentarios/${publicacionId}?limit=${limit}`,
      { headers: this.headers() }
    );
  }

  editarComentario(idComentario: string, contenido: string){
    return this.http.patch(
      `${environment.apiUrl}/comentarios/${idComentario}`,
      { contenido },
      { headers: this.headers() }
    );
  }

}
