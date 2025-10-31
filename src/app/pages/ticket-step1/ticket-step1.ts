import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket-service';

@Component({
  selector: 'app-ticket-step1',
  imports: [],
  standalone: true,
  templateUrl: './ticket-step1.html',
  styleUrls: ['./ticket-step1.css']
})
export class TicketStep1 implements OnInit, AfterViewInit {

  peliculas: Pelicula[] = [];

  // Asignamos un índice central para mostrar la pelicula
  cardActive = 2;
  // Debes inicializar selectedPelicula en ngOnInit, después de cargar 'peliculas'
  selectedPelicula: Pelicula | undefined;
  // Cadena vacía para la descripción que se mostrará en el banner
  displayedDescription: string = '';

  // Obtiene múltiples referencias a elementos HTML marcados con #item en la plantilla
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    // Carga la lista de películas al inicializar el componente
    this.peliculas = this.ticketService.getPeliculas();

    // Inicializa la película seleccionada después de que 'peliculas' está poblada
    this.selectedPelicula = this.peliculas[this.cardActive];
  }

  // Hook que se ejecuta después de que la vista del componente y sus hijos están inicializados
  ngAfterViewInit(): void {
    // Ejecuta la lógica en el siguiente ciclo de detección de cambios para asegurar que @ViewChildren esté listo
    setTimeout(() => {
      this.cargarGaleria(); // Llama al método para inicializar la galería
    }, 0);
  }

  // Boton para seleccionar pelicula y pasar al paso 2
  confirmarPaso1(peliculaId: number | undefined) {
    // Es crucial validar que el ID exista antes de navegar
    if (peliculaId) {
      // Llama al Router para navegar al Step 2 con el ID
      this.router.navigate(['/ticket/step2', peliculaId]);
    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  // Boton para volver a Home
  volverHome() {
      this.router.navigate(['/']);
  }

  cargarGaleria() {
    // Convierte la lista de referencias a elementos HTML nativos
    const elements = this.items.toArray().map(ref => ref.nativeElement);
    // Almacena la cantidad total de elementos en la galería
    const total = elements.length;

    // Actualizar la película seleccionada con el nuevo índice 'cardActive'
    this.selectedPelicula = this.peliculas[this.cardActive];
    // Procesa la descripcion y la setea en el banner
    this.displayedDescription = this.processDescription(this.selectedPelicula.descripcion);

    for (let i = 0; i < total; i++) {
      const el = elements[i];

      // Calcula la distancia desde el centro, considerando el ciclo
      let offset = i - this.cardActive;
      if (offset > total / 2) offset -= total;
      if (offset <= -total / 2) offset += total;

      const stt = Math.abs(offset);

      if (stt <= 2) {
        // ESTILOS PARA ELEMENTOS VISIBLES (offset: -2, -1, 0, 1, 2)
        const translateX = 120 * offset;
        const scale = 1 - 0.1 * stt;
        const opacity = stt === 0 ? 1 : stt === 1 ? 0.6 : 0.2;
        const rotateY = offset > 0 ? -4 : offset < 0 ? 4 : 0;

        el.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, filter 0.4s ease-in-out'; // ¡Añadir transición!
        el.style.transform = `translateX(${translateX}px) scale(${scale}) perspective(400px) rotateY(${rotateY}deg)`;
        el.style.opacity = `${opacity}`;
        el.style.filter = stt === 0 ? 'none' : 'blur(2px)';
        el.style.zIndex = `${5 - stt}`;
        el.style.pointerEvents = stt === 0 ? 'auto' : 'none'; // Desactivar click en los no centrales

      } else {
        // ESTILOS PARA ELEMENTOS OCULTOS
        el.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, filter 0.4s ease-in-out';
        el.style.opacity = '0';
        el.style.zIndex = '0';
        el.style.filter = 'blur(5px)';
        el.style.transform = `translateX(${offset > 0 ? 300 : -300}px) scale(0.5)`; // Mover fuera de la vista
        el.style.pointerEvents = 'none';
      }
    }
  }

  // Boton para pasar a la sig. tarjeta
  nextSlide() {
    this.cardActive = (this.cardActive + 1) % this.peliculas.length;
    this.cargarGaleria();
  }

  // Boton para pasar a la tarjeta anterior
  prevSlide() {
    this.cardActive = (this.cardActive - 1 + this.peliculas.length) % this.peliculas.length;
    this.cargarGaleria();
  }

  // Funcion que actualiza la informacion del banner con la pelicula seleccionada
  private processDescription(description: string): string {
    const MAX_CHARS = 175; // Define el límite máximo de caracteres que quieres mostrar

    // Comprobar si la descripción supera el límite
    if (description.length > MAX_CHARS) {

      // Recorta la cadena hasta el límite máximo
      let shortened = description.substring(0, MAX_CHARS);

      // Encuentra el último espacio para no cortar una palabra
      const lastSpace = shortened.lastIndexOf(' ');

      // Si encuentra un espacio antes del final del recorte, recorta hasta allí
      if (lastSpace !== -1) {
        shortened = shortened.substring(0, lastSpace);
      }

      // Añade los puntos suspensivos
      return `${shortened}...`;
    }

    // Devuelve la descripción
    return description;
  }

}
