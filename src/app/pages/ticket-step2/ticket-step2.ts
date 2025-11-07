import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket-service';
import { Location } from '@angular/common';
import { Funcion } from '../../models/funcion';

@Component({
  selector: 'app-ticket-step2',
  imports: [],
  templateUrl: './ticket-step2.html',
  styleUrl: './ticket-step2.css',
})
export class TicketStep2 implements OnInit {

  peliculaSeleccionada: Pelicula | undefined;

  constructor(
    private location: Location,
    private ticketService: TicketService, 
    private router: Router
  ) { }

  ngOnInit(): void {

    this.peliculaSeleccionada = this.ticketService.getPeliculaSnapshot();
    
    if (this.peliculaSeleccionada) {
      
      // Llamar a la función que cargaría la fecha y hora
      this.mostrarFunciones();

    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  mostrarFunciones() {

  }

  seleccionarFuncionFecha() {

  }

  seleccionarFuncionHora() {

  }

  confirmarPaso2() {
    
    if (!this.peliculaSeleccionada) return;

    // Setear la funcion elegida
    this.ticketService.setFuncionActual({ 
      id: 1, 
      fecha: '02-06-2026', 
      hora: '20:00' 
    });
    // if (!this.funcionSeleccionada) return;

    this.router.navigate(['/ticket/step3']);
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}