import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ModalService } from '../modal.service';
import { Usuarios } from '../../pages/dashboard/usuarios/usuarios';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  authService = inject(AuthService);
  router = inject(Router);
  

  //modal
  mostrarModal = false;
  mensajeModal = '';
  cdr = inject(ChangeDetectorRef);
  
  modalService = inject(ModalService);

  formulario = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.pattern(/\S/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), 
      Validators.maxLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
  });

  get usuario() { return this.formulario.get('usuario'); }
  get password() { return this.formulario.get('password'); }

  ngOnInit(){
    this.modalService.limpiarTimer();
  }

  accion(){
    if(!this.formulario.valid){
      this.mensajeModal = 'LLene todos los campos correctamente.';
      this.mostrarModal = true;
      this.cdr.detectChanges();
      return;
    }

    const {usuario, password} = this.formulario.value;
    
    this.authService.login(usuario!, password!).subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuarioId', respuesta.usuarioId);
        // console.log(localStorage.getItem('usuarioId'));
        this.modalService.iniciarTimer();
        // this.mensajeModal = 'Inicio de sesión exitoso';
        // this.mostrarModal = true;
        // this.cdr.detectChanges();
        this.router.navigate(['/publicaciones']);
      },
      error: (error) => {
        this.mensajeModal = error.error?.message || 'Email o contraseña incorrectos';
        this.mostrarModal = true;
        this.cdr.detectChanges();
        return;
      },
    });
    // this.cdr.detectChanges();
    // return;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
    if (this.mensajeModal === 'Inicio de sesión exitoso') {
      this.router.navigate(['/spinner']);
    }
    this.cdr.detectChanges();
  }

}

  


