import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class Resaltar {

  @Input() appResaltar: string = '#f5efe6';
  private colorOriginal: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.colorOriginal = this.el.nativeElement.style.backgroundColor || '';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appResaltar;
    this.el.nativeElement.style.transition = 'background-color 0.2s';
  }


  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = this.colorOriginal;
  }
}
