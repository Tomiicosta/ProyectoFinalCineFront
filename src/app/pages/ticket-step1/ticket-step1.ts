import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pelicula } from '../../models/pelicula';
import { TicketService } from '../../services/ticket-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ticket-step1',
  imports: [],
  standalone: true,
  templateUrl: './ticket-step1.html',
  styleUrls: ['./ticket-step1.css']
})
export class TicketStep1 implements OnInit, AfterViewInit {

  // Lista de peliculas que se mostraran (DEBEN MOSTRARSE FUNCIONES EN CARTELERA)
  peliculas: Pelicula[] = [];
  // Asignamos un índice central para mostrar la pelicula
  cardActive = 0;
  // Debes inicializar selectedPelicula en ngOnInit, después de cargar 'peliculas'
  peliculaSeleccionada: Pelicula | undefined;
  // Cadena vacía para la descripción que se mostrará en el banner
  displayedDescription: string = '';

  // Obtiene múltiples referencias a elementos HTML marcados con #item en la plantilla
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private location: Location,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    /*
    // Llama al método que hace el fetch y almacena en el servicio
    this.peliculasService.fetchAndStorePeliculas();
    // Si quieres obtener la lista directamente para usar en el template del componente
    this.peliculasService.getPeliculas().subscribe({
        next: (data) => {
            this.peliculas = data;
        },
        error: (err) => {
            console.error('Hubo un error cargando las películas:', err);
        }
    });
    */

    // Carga la lista de películas al inicializar el componente
    this.peliculas = this.ticketService.getPeliculas();

    // Inicializa la película seleccionada después de que 'peliculas' está poblada
    this.peliculaSeleccionada = this.peliculas[this.cardActive];
  }

  // Hook que se ejecuta después de que la vista del componente y sus hijos están inicializados
  ngAfterViewInit(): void {
    // Ejecuta la lógica en el siguiente ciclo de detección de cambios para asegurar que @ViewChildren esté listo
    setTimeout(() => {
      this.cargarCartelera(); // Llama al método para inicializar la galería
    }, 0);
  }

  // Funcion para cargar la cartelera actual del cine al iniciar la pagina
  private cargarCartelera() {
    // Convierte la lista de referencias a elementos HTML nativos
    const elements = this.items.toArray().map(ref => ref.nativeElement);
    // Almacena la cantidad total de elementos en la galería
    const total = elements.length;

    // Actualizar la película seleccionada con el nuevo índice 'cardActive'
    this.peliculaSeleccionada = this.peliculas[this.cardActive];
    // Procesa la descripcion y la setea en el banner
    this.displayedDescription = this.recortarDescripcion(this.peliculaSeleccionada.descripcion);

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

  // Funcion que actualiza la informacion del banner con la pelicula seleccionada
  private recortarDescripcion(description: string): string {
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

  // Boton para ver detalles de la pelicula seleccionada
  btnVerDetalles() {
    // 1. Encontrar la película (o simplemente el ID)
    const peli = this.peliculaSeleccionada;
    // 2. Usar el servicio para establecer la película como la "actual"
    if (peli) {
      this.ticketService.setPeliculaActual(peli);
      // 3. Navegar a detalles de la peli
      this.router.navigate(['/details', peli.id]);
    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  // Boton para pasar a la siguiente tarjeta
  btnDerecha() {
    // Cambia el index de la peli elegida
    this.cardActive = (this.cardActive + 1) % this.peliculas.length;
    // Actualiza la peli seleccionada y carga las tarjetas
    this.cargarCartelera();
  }

  // Boton para pasar a la tarjeta anterior
  btnIzquierda() {
    // Cambia el index de la peli elegida
    this.cardActive = (this.cardActive - 1 + this.peliculas.length) % this.peliculas.length;
    // Actualiza la peli seleccionada y carga las tarjetas
    this.cargarCartelera();
  }

  // Boton para seleccionar pelicula y pasar al paso 2
  btnConfirmarPaso1() {
    
    const peli = this.peliculaSeleccionada;

    if (peli) {
      this.ticketService.setPeliculaActual(peli);
      // Navegar al paso 2
      this.router.navigate(['/ticket/step2']);
    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  // Boton para volver al URL anterior y retroceder
  btnVolverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}