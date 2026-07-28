import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesServices {
  http = inject(HttpClient);

  crear(titulo: string, descripcion: string, imagen: File | null) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const form = new FormData();

    form.append('titulo', titulo);
    form.append('descripcion', descripcion);
    if (imagen) {
      form.append('imagen', imagen);
    }
    
    return this.http.post(`${environment.apiUrl}/publicaciones`, 
      form, { headers });
  }

  listar(limit: number, offset: number, orden: string, usuarioId?: string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let url = `${environment.apiUrl}/publicaciones?limit=${limit}&offset=${offset}&orden=${orden}`;

    if (usuarioId) {
      url += `&usuarioId=${usuarioId}`;
    }
    
    return this.http.get<{publicaciones: any[], total: number}>( url, { headers });
  }

  eliminar(publicacionId: string){
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(
      `${environment.apiUrl}/publicaciones/${publicacionId}`,
      { headers }
    );
  }

  darLike(publicacionId: string){   
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(
      `${environment.apiUrl}/publicaciones/${publicacionId}/like`, {},
      { headers }
    );
  }

  quitarLike(publicacionId: string){   
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(
      `${environment.apiUrl}/publicaciones/${publicacionId}/like`,
      { headers }
    );
  }

  
}
