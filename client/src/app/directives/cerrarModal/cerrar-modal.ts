import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appCerrar]',
  standalone: true
})
export class CerrarModal {
  @Output() appClickFuera = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && !this.el.nativeElement.contains(target)) {
      this.appClickFuera.emit();
    }
  }
}
