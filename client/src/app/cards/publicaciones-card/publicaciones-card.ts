import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, input, InputSignal, output, signal, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComentariosServices } from './comentarios.services';
import { FormsModule } from '@angular/forms';
import { FechaPipe } from '../../pipes/fecha/fecha-pipe';
import { AcortadorPipe } from '../../pipes/acortador/acortador-pipe';
import { CapitalizarPipe } from '../../pipes/capitalizar/capitalizar-pipe';
import { Resaltar } from '../../directives/resaltar/resaltar';
import { CerrarModal } from '../../directives/cerrarModal/cerrar-modal';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-publicaciones-card',
  imports: [FechaPipe, AcortadorPipe, CapitalizarPipe, CerrarModal],
  templateUrl: './publicaciones-card.html',
  styleUrl: './publicaciones-card.css',
})
export class PublicacionesCard {
  
  mostrarModal = false;
  mensajeModal = '';
  cdr = inject(ChangeDetectorRef);

  mostrarDetalle = false;

  comentariosService = inject(ComentariosServices);
  comentariosLista: any[] = [];

  nuevoComentario = signal('');
  comentarioEditandoId = signal<string | null>(null);
  comentarioEditandoTexto = signal('');

  usuarioActualId = localStorage.getItem('usuarioId') ?? '';

  mostrar = true;
  mostrarEnDetalle = true;

  publicacionId: InputSignal<string> = input.required<string>();
  titulo: InputSignal<string> = input.required<string>();
  descripcion: InputSignal<string> = input.required<string>();
  nombre: InputSignal<string> = input.required<string>();
  fecha: InputSignal<string> = input.required<string>();
  cantidadLikes: InputSignal<number> = input.required<number>();
  imagenUrl: InputSignal<string> = input('');
  yaLeDiLike: InputSignal<boolean> = input(false);
  esMia: InputSignal<boolean> = input(false);
  esAdmin = input<boolean>(false);
  // mostrar: InputSignal<boolean> = input(false);
  // comentarios: InputSignal<string> = input.required<string>();

  onLike = output<string>();
  onQuitarLike = output<string>();
  onEliminar = output<string>();

  sanitizer = inject(DomSanitizer);
  imagenSegura = computed(() => this.sanitizer.bypassSecurityTrustUrl(this.imagenUrl()));
  
  fotoPerfil: InputSignal<string> = input('');
  ngOnInit(){
    this.cargarComentarios();
    this.cdr.detectChanges()
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['yaLeDiLike']) {
  //     console.log('yaLeDiLike cambió a:', this.yaLeDiLike());
  //   }
  //   if (changes['cantidadLikes']) {
  //     console.log('cantidadLikes cambió a:', this.cantidadLikes());
  //   }
  // }

  darLike() {
    if (this.yaLeDiLike()) {
      this.onQuitarLike.emit(this.publicacionId());
      // console.log("like hijo");
      
    } else {
      this.onLike.emit(this.publicacionId());
    }
    this.cdr.detectChanges();
  }

  eliminar() {
    this.mostrarModal = true;
    this.mensajeModal = 'Quieres eliminar esta publicacion?'
    // this.onEliminar.emit(this.publicacionId());
  }

  cancelarEliminacion() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
    return;
  }

  confirmarEliminacion() {
    this.onEliminar.emit(this.publicacionId());
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  cargarComentarios() {
    this.mostrar = !this.mostrar;
    const limit = this.mostrar ?  0 : 2;
    this.cdr.detectChanges();
    this.traerComentarios(limit);
  } 

  traerComentarios(limit: number) {
    this.comentariosService.listar(this.publicacionId(), limit).subscribe({
      next: (data) => {
        this.comentariosLista = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  
  crearComentario() {

    const texto = this.nuevoComentario().trim();
    if (!texto){
      return;
    } 
    
    this.comentariosService.crear(texto, this.publicacionId()).subscribe({
      next: () => {
        this.nuevoComentario.set('');
        const limit = this.mostrar ? 0 : 2;
        this.traerComentarios(limit);
      },
      error: (e) => console.error(e),
    });
  }
  
  iniciarEdicion(comentario: any) {
    console.log('usuarioId comentario:', comentario.usuarioId);
    console.log('usuarioActualId:', this.usuarioActualId);
    this.comentarioEditandoId.set(comentario._id);    
    this.comentarioEditandoTexto.set(comentario.contenido);
  }

  cancelarEdicion() {
    this.comentarioEditandoId.set(null);  
    this.comentarioEditandoTexto.set('');
    this.cdr.detectChanges();
  }

  confirmarEdicion() {
    const texto = this.comentarioEditandoTexto().trim()

    if (!texto){
      return;
    }
    this.comentariosService.editarComentario(this.comentarioEditandoId()!, texto).subscribe({
      next: () => {
        this.cancelarEdicion();
        this.cdr.detectChanges();
        const limit = this.mostrar ? 0 : 2;
        this.traerComentarios(limit);
      },
      error: (e) => console.error(e),
    });
  }

  cerrarMensaje() {
  this.mostrarModal = false;
  this.cdr.detectChanges();
}
}
