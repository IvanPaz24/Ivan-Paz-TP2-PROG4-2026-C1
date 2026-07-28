import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Resaltar } from '../../../directives/resaltar/resaltar';
import { FechaEdad } from '../../../directives/fecha-edad/fecha-edad';
import { SoloImagenDirective } from '../../../directives/archivo-imagen/archivo-imagen';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, RouterLink, 
    Resaltar, FechaEdad, SoloImagenDirective],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {

  usuarios: any[] = [];

  mostrarModal = false;
  mensajeModal = '';
  cdr = inject(ChangeDetectorRef);

  router = inject(Router);
  userService = inject(UsuariosService);
  authService = inject(AuthService);

  imagenSeleccionada: File | null = null;

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
    descripcion: new FormControl(),
    imagen: new FormControl(),
    perfil: new FormControl('usuario', [Validators.required]),
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
  get perfil() { return this.formulario.get('pefil');}

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
  
  ngOnInit() {
    if (!this.authService.esAdmin()) {
      this.router.navigate(['/publicaciones']);
      return;
    }
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

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

    this.userService.crear(data.email!, data.nombre!, data.apellido!, 
      data.nombreUsuario!, data.fechaNacimiento!, data.password!, 
      data.descripcion!, data.perfil!,this.imagenSeleccionada).subscribe({
        next: (respuesta: any) => {
          this.mensajeModal = 'Se creo el usuario con exito';
          this.mostrarModal = true;
          this.formulario.reset({ perfil: 'usuario' });
          this.imagenSeleccionada = null;
          this.cargarUsuarios();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensajeModal = error.error?.message || 'Error al registrar';
          this.mostrarModal = true;
          this.cdr.detectChanges();
          return;
        },
      });
  }

  deshabilitar(id: string) {
    this.userService.deshabilitar(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  habilitar(id: string) {
    this.userService.habilitar(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

}
