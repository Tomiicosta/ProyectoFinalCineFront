import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-step2',
  imports: [],
  templateUrl: './ticket-step2.html',
  styleUrl: './ticket-step2.css',
})
export class TicketStep2 implements OnInit {

  movieId: number | undefined;
  // ... (movieId y constructor con Router)
  fechaSeleccionada: string = '2025-11-15'; // Ejemplo
  horaSeleccionada: string = '20:00';      // Ejemplo

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Obtener el parámetro de la ruta ('movieId')
    this.route.params.subscribe(params => {
      // El '+' convierte el string del ID a un número
      this.movieId = +params['movieId'];
      console.log('Película seleccionada (ID):', this.movieId);
      // Aquí podrías cargar la información de la película
    });
  }

  confirmarPaso2() {
    if (!this.movieId) return;

    this.router.navigate(
      ['/ticket/step3', this.movieId], // El 'movieId' va en el path
      {
        // La fecha y hora van como Query Parameters
        // URL resultante de ejemplo: /ticket/step3/123?fecha=2025-11-15&hora=20:00
        queryParams: {
          fecha: this.fechaSeleccionada,
          hora: this.horaSeleccionada
        }
      }
    );
  }

}
