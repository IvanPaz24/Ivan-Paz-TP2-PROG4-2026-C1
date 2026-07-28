import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {  

  http = inject(HttpClient);

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  
  listar() {
    return this.http.get<any[]>(`${environment.apiUrl}/usuarios`,
       { headers: this.headers() });
  }

  crear(email: string, nombre: string, apellido: string, nombreUsuario: string,
        fechaNacimiento: string, password: string, descripcion: string,
        perfil: string, imagen: File | null) {

    const form = new FormData();
    
    form.append('email', email);
    form.append('nombre', nombre);
    form.append('apellido', apellido);
    form.append('nombreUsuario', nombreUsuario);
    form.append('fechaNacimiento', fechaNacimiento);
    form.append('password', password);
    form.append('descripcion', descripcion);
    form.append('perfil', perfil);

    if (imagen) {
      form.append('imagen', imagen);
    }

    return this.http.post(`${environment.apiUrl}/usuarios/crear`, 
      form, { headers: this.headers() });
  }


  deshabilitar(id: string) {
    return this.http.delete(`${environment.apiUrl}/usuarios/${id}`, 
      { headers: this.headers() });
  }

  habilitar(id: string) {
    return this.http.post(`${environment.apiUrl}/usuarios/${id}/habilitar`, 
      {}, { headers: this.headers() });
  }
}
