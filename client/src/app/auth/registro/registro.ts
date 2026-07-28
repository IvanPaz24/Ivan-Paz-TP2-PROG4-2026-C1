import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,  RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ModalService } from '../modal.service';
import { FechaEdad } from '../../directives/fecha-edad/fecha-edad';
import { SoloImagenDirective } from '../../directives/archivo-imagen/archivo-imagen';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, FechaEdad, SoloImagenDirective],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  //modal
  mostrarModal = false;
  mensajeModal = '';
  cdr = inject(ChangeDetectorRef);
  
  router = inject(Router);
  authService = inject(AuthService);

  modalService = inject(ModalService);

  formulario = new FormGroup({
    email: new FormControl('', [Validators.required, 
      Validators.email]),
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/) 
      ,Validators.maxLength(20), Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/) 
      ,Validators.minLength(2), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
    confirmPassword: new FormControl('', [Validators.required]),
    nombreUsuario: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/),
      Validators.minLength(5), Validators.maxLength(15)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    imagen: new FormControl(),
  }, { validators: this.passwordMatchValidator });

  get email() { return this.formulario.get('email'); }
  get nombre() { return this.formulario.get('nombre'); }
  get apellido() { return this.formulario.get('apellido'); }
  get password() { return this.formulario.get('password'); }
  get confirmPassword() { return this.formulario.get('confirmPassword'); }
  get nombreUsuario() { return this.formulario.get('nombreUsuario'); }
  get fechaNacimiento() { return this.formulario.get('fechaNacimiento'); }
  get descripcion() { return this.formulario.get('descripcion'); }
  get imagen() { return this.formulario.get('imagen'); }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  ngOnInit(){
    this.modalService.limpiarTimer();
  }

  imagenSeleccionada: File | null = null;
  errorImagen = '';

  onFileChange(archivo: File) {
    this.imagenSeleccionada = archivo;
    this.errorImagen = '';
  }


  accion(){
    if (!this.formulario.valid) {
      this.mensajeModal = 'Campos no validos';
      this.mostrarModal = true;
      this.cdr.detectChanges();
      console.log(this.formulario.value);
      return;
    }
    
    const data = this.formulario.value;

    console.log(data)
    this.authService.registro(data.email!, data.nombre!, data.apellido!, data.nombreUsuario!,
      data.fechaNacimiento!, data.password!, data.descripcion!, this.imagenSeleccionada).subscribe({
        next: (respuesta: any) => {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuarioId', respuesta.usuarioId);
          this.modalService.iniciarTimer();
          this.imagenSeleccionada = null;
          this.formulario.reset();
          // this.mensajeModal = 'Registro exitoso';
          // this.mostrarModal = true;
          // this.cdr.detectChanges();
          this.router.navigate(['/publicaciones']);
        },
        error: (error) => {
          this.mensajeModal = error.error?.message || 'Error al registrar';
          this.mostrarModal = true;
          this.cdr.detectChanges();
          return;
        },
      });
  }

  
  cerrarModal() {
    this.mostrarModal = false;
    if (this.mensajeModal === 'Registro exitoso') {
      this.router.navigate(['/publicaciones']);
    }
    this.cdr.detectChanges();
  }
}
