import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket/ticket-service';
import { Location, SlicePipe } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { FunctionService } from '../../services/function/function-service';
import { Observable } from 'rxjs';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

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

  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(
    private location: Location,
    private ticketService: TicketService, 
    private functionService: FunctionService,
    private router: Router,
    private errorHandlerService: ErrorHandler
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
      error: (e) => { this.errorHandlerService.handleHttpError(e) }
    })
  }

  // Formatear fecha: "YYYY-MM-DD" → "viernes 14 de noviembre"
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // agrega el día de la semana
      day: 'numeric',
      month: 'long'
    };

    // Esto devuelve algo como: "viernes, 14 de noviembre"
    const fechaFormateada = dateObj.toLocaleDateString('es-ES', opciones);
    // Eliminamos la coma y capitalizamos la primera letra
    return fechaFormateada.replace(',', '').replace(/^./, c => c.toUpperCase());
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

    // Lógica de confirmación:
    if (this.funcionSeleccionada === undefined) {
      this.errorMessage.set("ERROR: Seleccione al menos una butaca para continuar.");
      return;
    }

    // Setear la funcion elegida
    this.ticketService.setFuncion(this.funcionSeleccionada);

    this.router.navigate(['/ticket/step3']);
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}