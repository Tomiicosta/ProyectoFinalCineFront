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
    { titulo: 'Enter the Void', img: 'https://m.media-amazon.com/images/I/913O+HYQbKL._AC_UF894,1000_QL80_.jpg' },
    { titulo: 'Inception', img: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg' },
    { titulo: 'Matrix', img: 'https://im.ziffdavisinternational.com/ign_es/screenshot/default/matrix_c1cf.jpg' },
    { titulo: 'Good Boy', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1M5Wy9B3d4c6MF4qZGjWf9rMWJ4hbzG49IdoihrlZ3HykNI_KSy0jSfj4HUT6uEXF38g&usqp=CAU' },
    { titulo: 'Pulp Fiction', img: 'https://i.blogs.es/a4a80f/pulp-fiction/450_1000.jpg' },
    { titulo: 'The Truman Show', img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/12/show-truman-2181625.jpg?tf=3840x' },
    { titulo: 'Spiderman 2', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi08aXxrvvu9dMGL1EL_aSvu1Q-9OWO_xPDw&s' },
    { titulo: 'Good Time', img: 'https://m.media-amazon.com/images/M/MV5BMTg4MjQ1YjktMWUyMi00N2NjLWFiMWMtOTAyOWVjZDM2NGY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' }
  ];

  active = 2; // índice central
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  ngAfterViewInit(): void {
    this.loadShow();
  }

  loadShow(direction: 'next' | 'prev' = 'next') {
    const elements = this.items.toArray().map(ref => ref.nativeElement);
    const total = elements.length;

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
        const opacity = stt === 0 ? 1 : stt === 1 ? 0.3 : 0.075;
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


}
