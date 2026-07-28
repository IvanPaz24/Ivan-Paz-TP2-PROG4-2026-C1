import { ChangeDetectorRef, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { EstadisticasServices } from './estadisticas.services';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, RouterLink],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {

  estadisticasService = inject(EstadisticasServices);
  authService = inject(AuthService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);


  @ViewChild('chartPubUsuario') chartPubUsuario!: ElementRef;
  @ViewChild('chartComentariosTiempo') chartComentariosTiempo!: ElementRef;
  @ViewChild('chartComentariosPub') chartComentariosPub!: ElementRef;

  charts: Chart[] = [];

  hoy = new Date();

  // fechaFutura = false;

  desde = signal('2025-01-01');
  hasta = signal(new Date().toISOString().split('T')[0]);

  ngOnInit() {
    if (!this.authService.esAdmin()) {
      this.router.navigate(['/publicaciones']);
    }
  }

  ngAfterViewInit() {
    this.cargarGraficos();
  }

  cargarGraficos() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const canvases = [
      this.chartPubUsuario.nativeElement,
      this.chartComentariosTiempo.nativeElement,
      this.chartComentariosPub.nativeElement,
    ];
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });


    const opts = { desde: this.desde(), hasta: this.hasta() };

    this.estadisticasService.publicacionesPorUsuario(opts.desde, opts.hasta).subscribe({
      next: (data) => {
        const chart = new Chart(this.chartPubUsuario.nativeElement, {
          type: 'bar',
          data: {
            labels: data.map(d => d.usuario),
            datasets: [{
              label: 'Publicaciones por usuario',
              data: data.map(d => d.cantidad),
              backgroundColor: '#a07850',
              borderColor: '#6b4f2f',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
        this.charts.push(chart);
      },
    });

    this.estadisticasService.comentariosPorTiempo(opts.desde, opts.hasta).subscribe({
      next: (data) => {
        const chart = new Chart(this.chartComentariosTiempo.nativeElement, {
          type: 'line',
          data: {
            labels: data.map(d => d.fecha),
            datasets: [{
              label: 'Comentarios por día',
              data: data.map(d => d.cantidad),
              borderColor: '#a07850',
              backgroundColor: 'rgba(160, 120, 80, 0.15)',
              tension: 0.3,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
          },
        });
        this.charts.push(chart);
      },
    });

    this.estadisticasService.comentariosPorPublicacion(opts.desde, opts.hasta).subscribe({
      next: (data) => {
        const colores = data.map((_, i) =>
          `hsl(${30 + i * 25}, 55%, ${45 + i * 3}%)`
        );
        const chart = new Chart(this.chartComentariosPub.nativeElement, {
          type: 'pie',
          data: {
            labels: data.map(d => `${d.publicacion} · ${d.usuario}`),
            datasets: [{
              label: 'Comentarios por publicación',
              data: data.map(d => d.cantidad),
              backgroundColor: colores,
            }],
          },
          options: {
            responsive: true,
            plugins: { 
              legend: { position: 'bottom' }, 
            },
          },
        });
        this.charts.push(chart);
      },
    });
  }

}
