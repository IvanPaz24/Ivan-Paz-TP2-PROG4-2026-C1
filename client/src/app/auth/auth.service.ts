import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  // apiUrl = 'http://localhost:3000';

  login(usuario: string, password: string){
    
    return this.http.post(`${environment.apiUrl}/auth/login`, { usuario, password });
  }

  registro(email: string, nombre: string, apellido: string, nombreUsuario: string, 
  fechaNacimiento: string, password: string, descripcion: string, imagen: File | null){
    
    const form = new FormData();
    
    form.append('email', email);
    form.append('nombre', nombre);
    form.append('apellido', apellido);
    form.append('nombreUsuario', nombreUsuario);
    form.append('fechaNacimiento', fechaNacimiento);
    form.append('password', password);
    form.append('descripcion', descripcion);
    if (imagen) {
      form.append('imagen', imagen);
    }

    return this.http.post(`${environment.apiUrl}/auth/registro`,form);

  }

  traerUsuario() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${environment.apiUrl}/usuarios/user`, { headers });
  }

  renovarToken() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${environment.apiUrl}/auth/renovar`, {}, { headers });
  }

  autorizar() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${environment.apiUrl}/auth/autorizar`, { headers });
  }

  esAdmin(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.perfil === 'administrador';
    } catch {
      return false;
    }
  }

}
