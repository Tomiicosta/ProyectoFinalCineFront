import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ticket-step1',
  imports: [],
  standalone: true,
  templateUrl: './ticket-step1.html',
  styleUrls: ['./ticket-step1.css']
})
export class TicketStep1 implements AfterViewInit {

  // simulamos algunas películas con imágenes
  peliculas = [
    { titulo: 'Enter the Void', img: 'https://m.media-amazon.com/images/I/913O+HYQbKL._AC_UF894,1000_QL80_.jpg', descripcion: 'Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio.' },
    { titulo: 'Inception', img: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg', descripcion: 'Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. ' },
    { titulo: 'Matrix', img: 'https://im.ziffdavisinternational.com/ign_es/screenshot/default/matrix_c1cf.jpg', descripcion: 'Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad.' },
    { titulo: 'Good Boy', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1M5Wy9B3d4c6MF4qZGjWf9rMWJ4hbzG49IdoihrlZ3HykNI_KSy0jSfj4HUT6uEXF38g&usqp=CAU', descripcion: 'Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante.' },
    { titulo: 'Pulp Fiction', img: 'https://i.blogs.es/a4a80f/pulp-fiction/450_1000.jpg', descripcion: 'Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros.' },
    { titulo: 'The Truman Show', img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/12/show-truman-2181625.jpg?tf=3840x', descripcion: 'La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. ' },
    { titulo: 'Spiderman 2', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi08aXxrvvu9dMGL1EL_aSvu1Q-9OWO_xPDw&s', descripcion: 'Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. ' },
    { titulo: 'Good Time', img: 'https://m.media-amazon.com/images/M/MV5BMTg4MjQ1YjktMWUyMi00N2NjLWFiMWMtOTAyOWVjZDM2NGY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', descripcion: 'Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. ' }
  ];

  active = 2; // índice central
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  selectedPelicula = this.peliculas[this.active];
  displayedDescription: string = '';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadShow();
    }, 0);
  }

  loadShow(direction: 'next' | 'prev' = 'next') {
    const elements = this.items.toArray().map(ref => ref.nativeElement);
    const total = elements.length;

    // Actualizar la película seleccionada con el nuevo índice 'active'
    this.selectedPelicula = this.peliculas[this.active];
    this.displayedDescription = this.processDescription(this.selectedPelicula.descripcion);

    for (let i = 0; i < total; i++) {
      const el = elements[i];

      // Calcula la distancia desde el centro, considerando el ciclo
      let offset = i - this.active;
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

  nextSlide() {
    this.active = (this.active + 1) % this.peliculas.length;
    this.loadShow('next');
  }

  prevSlide() {
    this.active = (this.active - 1 + this.peliculas.length) % this.peliculas.length;
    this.loadShow('prev');
  }

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

      // Añade los puntos suspensivos y el texto de continuación
      return `${shortened}...`;
    }

    // Devuelve la descripción completa si es corta
    return description;
  }

}
