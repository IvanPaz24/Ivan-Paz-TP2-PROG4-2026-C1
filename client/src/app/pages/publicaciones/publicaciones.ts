import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PublicacionesCard } from '../../cards/publicaciones-card/publicaciones-card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicacionesServices } from './publicaciones.services';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ModalService } from '../../auth/modal.service';
import { Resaltar } from '../../directives/resaltar/resaltar';

import { CerrarModal } from '../../directives/cerrarModal/cerrar-modal';
import { SoloImagenDirective } from '../../directives/archivo-imagen/archivo-imagen';


@Component({
  selector: 'app-publicaciones',
  imports: [ PublicacionesCard, ReactiveFormsModule, 
    RouterLink, CerrarModal, SoloImagenDirective],
  templateUrl: './publicaciones.html', 
  styleUrl: './publicaciones.css',
})
export class Publicaciones{

  authService = inject(AuthService);
  cargando = true; 
  modalService = inject(ModalService);

  publicacionesService = inject(PublicacionesServices);
  // authService = inject(AuthService);  
  cdr = inject(ChangeDetectorRef);

  router = inject(Router);

  postMongo: any[] = [];
  total = 0;
  limit = 5;
  offset = 0;
  orden = 'fecha';

  usuarioActualId = localStorage.getItem('usuarioId') ?? '';

  mostrarModal = false;
  mensajeModal = '';

  esAdmin = false;

  formulario = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.pattern(/\S/)]),
    descripcion: new FormControl('', [Validators.required, Validators.pattern(/\S/)]),
    imagen: new FormControl(),
  })

  get titulo() { return this.formulario.get('titulo'); }
  get descripcion() { return this.formulario.get('descripcion'); }
  get imagen() { return this.formulario.get('imagen'); }

  imagenSeleccionada: File | null = null;
  errorImagen = '';

  onFileChange(archivo: File) {
    this.imagenSeleccionada = archivo;
    this.errorImagen = '';
  }

  accion(){
    if (!this.formulario.valid) {
      console.log('Formulario no valido');
      this.mensajeModal = 'Error al publicar';
      this.mostrarModal = true;
      this.cdr.detectChanges();
      return;
    }

    const { titulo, descripcion } = this.formulario.value;
      
    this.publicacionesService.crear(titulo!, descripcion!, this.imagenSeleccionada).subscribe({
      next: () => {
        console.log('Publicacion creada');
        this.mostrarModal = true;
        this.mensajeModal = 'Publicacion creada';
        this.cdr.detectChanges();
        this.listarPublicaciones();
        this.formulario.reset();
        this.imagenSeleccionada = null
      },
      error: (e) => console.error(e),});
        
  }


  ngOnInit() {
    
    this.esAdmin = this.authService.esAdmin();

    this.authService.autorizar().subscribe({
      next: () => {
        
        setTimeout(() => {
          this.cargando = false;
          this.modalService.iniciarTimer();
          this.listarPublicaciones();
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
        this.cargando = false;
        this.router.navigate(['/login']);
      }
    });
    
    // this.listarPublicaciones
  }
  
  listarPublicaciones() {
  // const orden = 'fechas';
    this.publicacionesService.listar(this.limit, this.offset, this.orden).subscribe({
      next: (respuesta) => {
        // this.listarPublicaciones(), 
        // console.log('Primera pub:', respuesta.publicaciones[0]);
        console.log('Respuesta del servidor:', respuesta.publicaciones[0]);
        console.log('likes:', respuesta.publicaciones[0]?.likes);
        console.log('cantidadLikes:', respuesta.publicaciones[0]?.cantidadLikes);
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
          console.log("dio like")
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
        console.log('saco like');
        
        
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

  cambiarOrden(orden: string){
    this.orden = orden;
    this.offset = 0;
    this.cdr.detectChanges();
    this.listarPublicaciones();
  }

  siguientePagina() {
    this.offset += this.limit;
    this.cdr.detectChanges();
    this.listarPublicaciones();
  }

  anteriorPagina() {
    this.offset -= this.limit;
    this.cdr.detectChanges();
    this.listarPublicaciones();
  }

  get limiteSiguiente() {
    return this.offset + this.limit < this.total;
  }

  get limiteAnterior() {
    return this.offset > 0;
  }

  cerrarMensaje() {
    this.mostrarModal = false;
    // if (this.mensajeModal === 'Se publico con exito') {
      
    // }
    this.cdr.detectChanges();
  }

  salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    this.router.navigate(['/login']);
  }
}
 