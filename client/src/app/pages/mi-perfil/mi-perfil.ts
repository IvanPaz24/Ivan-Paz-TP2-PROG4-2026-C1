import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PublicacionesCard } from '../../cards/publicaciones-card/publicaciones-card';
import { PublicacionesServices } from '../publicaciones/publicaciones.services';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CapitalizarPipe } from '../../pipes/capitalizar/capitalizar-pipe';

@Component({
  selector: 'app-mi-perfil',
  imports: [PublicacionesCard, RouterLink, DatePipe, CapitalizarPipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {
  publicacionesService = inject(PublicacionesServices);

  authService = inject(AuthService);

  usuarioActualId = localStorage.getItem('usuarioId') ?? '';

  usuario: any = null;

  postMongo: any[] = [];
  total = 0;
  limit = 3;
  offset = 0;
  orden = 'fecha';

  cdr = inject(ChangeDetectorRef);

  ngOnInit() {

    this.authService.traerUsuario().subscribe({
      next: (usuario: any) => {
        this.usuario = usuario;
        console.log(this.usuario.fotoPerfil);
        
        this.listarPublicaciones(this.usuarioActualId);
        this.cdr.detectChanges();
    },
      error: (e) => console.error(e),
    });
    
    
    // this.listarPublicaciones
  }
  
  listarPublicaciones(usuarioId?: string) {
  // const orden = 'fechas';
    this.publicacionesService.listar(this.limit, this.offset, this.orden, usuarioId).subscribe({
      next: (respuesta) => {
        // this.listarPublicaciones(), 
  
        this.postMongo = respuesta.publicaciones;
        this.total = respuesta.total;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  darLike(id: string) {
    this.publicacionesService.darLike(id).subscribe({
        next: (respuesta) => {
        this.listarPublicaciones();
        // this.cdr.detectChanges();
        
      },
      error: (e) => console.error(e),
    });
  }

  quitarLike(id: string) {
    this.publicacionesService.quitarLike(id).subscribe({
        next: (respuesta) => {
        this.listarPublicaciones();
        // this.cdr.detectChanges();
        
      },
      error: (e) => console.error(e),
    });
  }

  eliminar(id: string) {
    this.publicacionesService.eliminar(id).subscribe({
      next: () => this.listarPublicaciones(),
      error: (e) => console.error(e),
    });
  }

  subirArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
