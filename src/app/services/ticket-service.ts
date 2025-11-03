import { Injectable, signal } from '@angular/core';
import { Pelicula } from '../models/pelicula';
import { BehaviorSubject, Observable } from 'rxjs';
import { Compra } from '../models/compra';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private peliculaActual = signal<Pelicula | undefined>(undefined);
  private compraActual = signal<Compra | undefined>(undefined);

  peliculaSeleccionada = this.peliculaActual.asReadonly();
  compra = this.compraActual.asReadonly();

  // Lista de peliculas (TRAER DESDE LA API PELICULAS)
  private peliculas: Pelicula[] = [
    { id: 1, titulo: 'Enter the Void', img: 'https://m.media-amazon.com/images/I/913O+HYQbKL._AC_UF894,1000_QL80_.jpg', descripcion: 'Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio. Un viaje alucinante sobre la vida después de la muerte en Tokio.' },
    { id: 2, titulo: 'Inception', img: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg', descripcion: 'Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. Un ladrón que se especializa en entrar en los sueños de la gente para robar secretos. ' },
    { id: 3, titulo: 'Matrix', img: 'https://im.ziffdavisinternational.com/ign_es/screenshot/default/matrix_c1cf.jpg', descripcion: 'Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad. Un programador informático descubre la verdadera naturaleza de su realidad.' },
    { id: 4, titulo: 'Good Boy', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1M5Wy9B3d4c6MF4qZGjWf9rMWJ4hbzG49IdoihrlZ3HykNI_KSy0jSfj4HUT6uEXF38g&usqp=CAU', descripcion: 'Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante. Un thriller psicológico con una premisa única y escalofriante.' },
    { id: 5, titulo: 'Pulp Fiction', img: 'https://i.blogs.es/a4a80f/pulp-fiction/450_1000.jpg', descripcion: 'Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros. Una serie de historias entrelazadas de criminales, boxeadores y camareros.' },
    { id: 6, titulo: 'The Truman Show', img: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/12/show-truman-2181625.jpg?tf=3840x', descripcion: 'La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. La vida de un hombre es, sin que él lo sepa, un programa de televisión en vivo 24/7. ' },
    { id: 7, titulo: 'Spiderman 2', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi08aXxrvvu9dMGL1EL_aSvu1Q-9OWO_xPDw&s', descripcion: 'Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. Peter Parker lucha por equilibrar su vida normal y sus deberes como héroe. ' },
    { id: 8, titulo: 'Good Time', img: 'https://m.media-amazon.com/images/M/MV5BMTg4MjQ1YjktMWUyMi00N2NjLWFiMWMtOTAyOWVjZDM2NGY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', descripcion: 'Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. Un hombre se lanza en una odisea a través del inframundo de Nueva York para liberar a su hermano. ' }
  ];

  setCompra(compra: Compra): void {
    this.compraActual.set(compra);
    console.log('Compra guardada:', compra);
  }

  getCompraSnapshot(): Compra | undefined {
    return this.compraActual();
  }

  // Método ÚNICO para establecer la película seleccionada
  setPeliculaActual(pelicula: Pelicula | undefined): void {
    this.peliculaActual.set(pelicula);
  }
  
  loadPeliculaActual(movieId: number): void {
    const mockMovie = this.peliculas.find(p => p.id === movieId);
    this.peliculaActual.set(mockMovie);
  }

  getPeliculaSnapshot(): Pelicula | undefined {
    return this.peliculaActual();
  }

  getPeliculas(): Pelicula[] {
    // CAMBIAR: LLAMAR al HttpClient para obtener data de la API
    // return this.http.get<Pelicula[]>('/api/peliculas');
    return this.peliculas;
  }

  getPeliculaById(id: number): Pelicula | undefined {
    return this.peliculas.find(p => p.id === id);
  }
}
