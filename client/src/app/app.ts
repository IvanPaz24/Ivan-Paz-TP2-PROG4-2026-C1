import { afterNextRender, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModalService } from './auth/modal.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  authService = inject(AuthService);
  modalService = inject(ModalService);
  router = inject(Router);
  mostrarModal = false;
  mensajeModal = '';

  cargando = true;

  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.modalService.mensaje$.subscribe((mensaje) => {
      this.mensajeModal = mensaje;
      this.mostrarModal = true;
      this.cdr.detectChanges();
    });

    this.modalService.accion$.subscribe((accion) => {
    if (accion === 'renovar') {
      this.authService.renovarToken().subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.mostrarModal = false;
          this.cdr.detectChanges();
          this.modalService.iniciarTimer();
        },
        error: () => {
          this.cerrarSesion();
        }
      });
    } else {
      // localStorage.removeItem('token');
      // localStorage.removeItem('usuarioId');
      // this.modalService.limpiarTimer();
      this.cerrarSesion();
    }
  });

  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    this.modalService.limpiarTimer();
    this.mostrarModal = false;
    this.router.navigate(['/login']);
  }


}
