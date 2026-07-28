import { Directive, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFechaEdad]',
  standalone: true,
})
export class FechaEdad {
  constructor(@Self() private control: NgControl) {}

  @HostListener('change', ['$event'])
  onCambio(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    if (!valor) return;

    const fechaIngresada = new Date(valor);
    const hoy = new Date();

    if (fechaIngresada > hoy) {
      this.control.control?.setErrors({ fechaFutura: true });
      return;
    }

    const edad = hoy.getFullYear() - fechaIngresada.getFullYear();
    const cumpleEsteAnio = new Date(
      hoy.getFullYear(),
      fechaIngresada.getMonth(),
      fechaIngresada.getDate()
    );
    const edadReal = hoy >= cumpleEsteAnio ? edad : edad - 1;

    if (edadReal < 18) {
      this.control.control?.setErrors({ menorDeEdad: true });
      return;
    }

    this.control.control?.setErrors(null);
  }
}
