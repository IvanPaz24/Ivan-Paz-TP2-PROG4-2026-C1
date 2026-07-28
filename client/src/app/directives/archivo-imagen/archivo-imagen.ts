import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSoloImagen]',
  standalone: true,
})
export class SoloImagenDirective {
  @Output() imagenValida = new EventEmitter<File>();
  @Output() imagenInvalida = new EventEmitter<string>();

  private formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  @HostListener('change', ['$event'])
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) return;

    if (!this.formatosPermitidos.includes(archivo.type)) {
      input.value = '';
      this.imagenInvalida.emit('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)');
      return;
    }

    this.imagenValida.emit(archivo);
  }
}