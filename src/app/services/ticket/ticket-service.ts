import { Injectable, signal } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { BehaviorSubject, Observable } from 'rxjs';
import { Compra } from '../../models/compra';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Funcion } from '../../models/funcion';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // URL base de tu API de Spring Boot
  private apiUrl = 'http://localhost:8080/api/peliculas';

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

  private peliculaActual = signal<Pelicula | undefined>(undefined);
  peliculaSeleccionada = this.peliculaActual.asReadonly();

  private compraActual = signal<Compra | undefined>(undefined);
  compraSeleccionada = this.compraActual.asReadonly();

  private funcionActual = signal<Funcion | undefined>(undefined);
  funcionSeleccionada = this.funcionActual.asReadonly();

  constructor(private http: HttpClient) { }

  setCompra(compra: Compra): void {
    this.compraActual.set(compra);
    console.log('Compra guardada:', compra);
  }

  getCompraSnapshot(): Compra | undefined {
    return this.compraActual();
  }

  setFuncionActual(funcion: Funcion | undefined): void {
    this.funcionActual.set(funcion);
  }

  getFuncionSnapshot(): Funcion | undefined {
    return this.funcionActual();
  }

  setPeliculaActual(pelicula: Pelicula | undefined): void {
    this.peliculaActual.set(pelicula);
  }
  
  getPeliculaSnapshot(): Pelicula | undefined {
    return this.peliculaActual();
  }

  // Realiza un fetch GET a la API y retorna un Observable: que emite un array de Pelicula.
  public getPeliculasApi(): Observable<Pelicula[]> {
    // 1. Obtener el token del localStorage (ajusta la clave si es diferente)
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      // Manejo de error si no hay token (puedes lanzar un error o retornar un Observable vacío)
      console.error('No se encontró el token.');
      // En un caso real, podrías redirigir al login
      return new Observable<Pelicula[]>(); 
    }

    // 2. Crear los encabezados de la solicitud, incluyendo el Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Realizar la solicitud GET
    return this.http.get<Pelicula[]>(this.apiUrl, { headers: headers });
  }

  // Realiza un llamado a getPeliculasApi() y lo guarda en el array
  public actualizarListaPeliculas(): void {
    this.getPeliculasApi().subscribe({
      next: (data) => {
        // Almacena los datos recibidos en la variable privada
        this.peliculas = data;
        console.log('Películas cargadas y almacenadas:', this.peliculas);
      },
      error: (error) => {
        console.error('Error al obtener las películas:', error);
        // Manejo de errores de la API (ej. token expirado, 403 Forbidden, 404 Not Found)
      }
    });
  }

  getPeliculas(): Pelicula[] {
    return this.peliculas;
  }

  // Funcion IDEAL para URLs que vengan con un parametro /:id
  getPeliculaById(id: number): Pelicula | undefined {
    return this.peliculas.find(p => p.id === id);
  }

}
