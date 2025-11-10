import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie/movie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

  localDate: Date = new Date();
  indiceActual = 0; 


  constructor(
    private router: Router, 
    public movieService:MovieService
  ) {}
 
  // boton de "Mas info"
  verDetalles(id: number | undefined) {
    this.router.navigate(['/details', id]);
  }

  // 🔹 Avanza una imagen
  siguiente() {
  if(this.movieService.moviesCartelera.length === 0) return;

  this.indiceActual = (this.indiceActual + 1) % this.movieService.moviesCartelera.length;
}

anterior() {
  if(this.movieService.moviesCartelera.length === 0) return;

  this.indiceActual =
    (this.indiceActual - 1 + this.movieService.moviesCartelera.length) % this.movieService.moviesCartelera.length;
}




  

 

  @ViewChild('carrusel', { static: false }) carrusel!: ElementRef;

  moverIzquierda() {
    this.carrusel.nativeElement.scrollBy({
      left: -250,
      behavior: 'smooth'
    });
  }

  moverDerecha() {
    this.carrusel.nativeElement.scrollBy({
      left: 250,
      behavior: 'smooth'
    });
  }





  


  getAllMovies(){
    this.movieService.getMovies().subscribe({
      next: (data) => {this.movieService.moviesCartelera = data},
      error: (e) => {console.log(e)}
    })
  }


isUpcoming(movieReleaseDate: string): boolean {
    const release = new Date(movieReleaseDate);
    return release >= this.localDate;
  }



  // 🔹 Cambio automático cada 4 segundos (opcional)
  ngOnInit() {
    this.getAllMovies();
    setInterval(() => this.siguiente(), 8000);
    setInterval(() => this.moverDerecha(), 6000);
  }

}

