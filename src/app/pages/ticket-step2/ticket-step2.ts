import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket/ticket-service';
import { Location, SlicePipe } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { FunctionService } from '../../services/function/function-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ticket-step2',
  imports: [],
  templateUrl: './ticket-step2.html',
  styleUrl: './ticket-step2.css',
})
export class TicketStep2 implements OnInit {

  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  funciones: Funcion[] | undefined;

  constructor(
    private location: Location,
    private ticketService: TicketService, 
    private functionService: FunctionService,
    private router: Router
  ) { }

  
  ngOnInit(): void {

    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    
    if (this.peliculaSeleccionada) {
      
      this.peliculaSeleccionada = this.ticketService.peliculaSeleccionada;
      if (this.peliculaSeleccionada) {
        // Llamar a la función que cargaría la fecha y hora
        this.mostrarFunciones(this.peliculaSeleccionada.id);
      }

    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  mostrarFunciones(id: number) {
    this.functionService.getDisponiblesPorPelicula(id).subscribe({
      next: (data) => { this.funciones = data } ,
      error: (e) => { console.log("Error: "+ e) }
    })
  }

  // Formatear fecha: "YYYY-MM-DD" → "11 de septiembre"
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // esto usa la zona local
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return dateObj.toLocaleDateString('es-ES', opciones);
  }

  // Formatear hora: "HH:mm:ss" → "HH:mm"
  formatearHora(hora: string): string {
    return hora.slice(0, 5); // corta los segundos
  }

  // Guardar datos de la función seleccionada
  seleccionarFuncion(f: Funcion) {
    this.funcionSeleccionada = f;
    console.log("Función seleccionada:", this.funcionSeleccionada);
  }

  
  confirmarPaso2() {
    
    if (!this.peliculaSeleccionada) return;
    if (!this.funcionSeleccionada) return;

    // Setear la funcion elegida
    this.ticketService.setFuncion(this.funcionSeleccionada);

    this.router.navigate(['/ticket/step3']);
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}