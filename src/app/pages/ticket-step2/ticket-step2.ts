import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket/ticket-service';
import { Location } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';

@Component({
  selector: 'app-ticket-step2',
  imports: [],
  templateUrl: './ticket-step2.html',
  styleUrl: './ticket-step2.css',
})
export class TicketStep2 implements OnInit {

  peliculaSeleccionada: Movie | undefined;

  constructor(
    private location: Location,
    private ticketService: TicketService, 
    private router: Router
  ) { }

  ngOnInit(): void {

    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    
    if (this.peliculaSeleccionada) {
      
      // Llamar a la función que cargaría la fecha y hora
      this.mostrarFunciones();

    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  mostrarFunciones() {

  }

  seleccionarFuncion() {

  }

  
  confirmarPaso2() {
    
    if (!this.peliculaSeleccionada) return;

    // Setear la funcion elegida
    this.ticketService.setFuncion({ 
      id: 1,
      date: '2026-06-02',
      time:"20:00", // formato ISO, más realista
      cinemaId: 3,
      cinemaName: 'Sala 3D Central',
      movieId: this.peliculaSeleccionada.id,
      movieName: this.peliculaSeleccionada.title,
      availableCapacity: 120,
      runTime: 125,
    
    });
    // if (!this.funcionSeleccionada) return;

    this.router.navigate(['/ticket/step3']);
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}