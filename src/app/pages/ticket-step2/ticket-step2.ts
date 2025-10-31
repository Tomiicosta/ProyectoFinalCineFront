import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-step2',
  imports: [AsyncPipe],
  templateUrl: './ticket-step2.html',
  styleUrl: './ticket-step2.css',
})
export class TicketStep2 implements OnInit, AfterViewInit {

  movieId: number | undefined;

  peliculaSeleccionada$!: Observable<Pelicula | undefined>;

  fechaSeleccionada: string = '2025-11-15'; // Ejemplo
  horaSeleccionada: string = '20:00';      // Ejemplo

  constructor(
    private ticketService: TicketService, 
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit(): void {
    // 2. Suscribirse para obtener el movieId de la ruta
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      
      if (this.movieId) {
          // 3. Pide al servicio que busque y almacene la peli
          this.ticketService.loadPeliculaActual(this.movieId); 
          
          // Llamar a la función que cargaría la fecha y hora
          this.mostrarFunciones();

        } else {
          console.error('No hay película seleccionada para navegar.');
        }
    });
  }

  // Hook que se ejecuta después de que la vista del componente y sus hijos están inicializados
  ngAfterViewInit(): void {
    // Ejecuta la lógica en el siguiente ciclo de detección de cambios para asegurar que @ViewChildren esté listo
    setTimeout(() => {
      // 4. Asignar el observable público del servicio a la propiedad local
      this.peliculaSeleccionada$ = this.ticketService.peliculaActual$;
    }, 0);
  }

  confirmarPaso2() {
    // Para obtener el ID para la navegación, puedes usar el snapshot del servicio:
    const peli = this.ticketService.getPeliculaSnapshot();
    
    if (!peli) return;

    this.router.navigate(
      ['/ticket/step3', peli.id], // Usamos el ID del objeto Pelicula
      {
        queryParams: {
          fecha: this.fechaSeleccionada,
          hora: this.horaSeleccionada
        }
      }
    );
  }

  volverPaso1() {
    this.router.navigate(['/ticket/step1']); 
  }

  mostrarFunciones() {

  }

}
