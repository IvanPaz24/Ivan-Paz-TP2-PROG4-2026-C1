import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
    
  private mensajeSubject = new Subject<string>();
  mensaje$ = this.mensajeSubject.asObservable();

  private accionSubject = new Subject<'cerrar' | 'renovar'>();
  accion$ = this.accionSubject.asObservable();

  private timer: any = null;

  mostrar(mensaje: string) {
    this.mensajeSubject.next(mensaje);
  }

  ejecutar(accion: 'cerrar' | 'renovar') {
    this.accionSubject.next(accion);
  }

  iniciarTimer() {
    this.limpiarTimer();
    this.timer = setTimeout(() => {
      this.mostrar('Tu sesión expira en 5 minutos. ¿Querés extenderla?');
    }, 60000);//10 min
  }

  limpiarTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

}
