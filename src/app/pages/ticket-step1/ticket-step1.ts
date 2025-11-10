import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie/movie-service';
import Movie from '../../models/movie';

@Component({
  selector: 'app-ticket-step1',
  standalone: true,
  templateUrl: './ticket-step1.html',
  styleUrls: ['./ticket-step1.css']
})
export class TicketStep1 implements OnInit, AfterViewInit {

  cardActive = 2;
  displayedDescription: string = '';
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private location: Location,
    private router: Router,
    public movieService: MovieService
  ) {}

  ngOnInit() {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movieService.moviesCartelera = data;
        this.movieService.selectedPelicula = data[this.cardActive];
        this.displayedDescription = this.processDescription(this.movieService.selectedPelicula.overview);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.cargarGaleria(), 0);
    this.items.changes.subscribe(() => this.cargarGaleria());
  }

  confirmarPaso1(peliculaId: string) {
    this.movieService.getMovie(peliculaId).subscribe({
      next: (data) => {
        this.movieService.selectedPelicula = data;
        this.router.navigate(['/ticket/step2', peliculaId]);
      },
      error: (e) => console.error(e)
    });
  }

  verDetalles(peliculaId: number) {
    this.movieService.getMovieBd(peliculaId).subscribe({
      next: (data) => {
        this.movieService.selectedPelicula = data;
        this.router.navigate(['/details', peliculaId]);
      },
      error: (e) => console.error(e)
    });
  }

  volverAtras(): void {
    this.location.back();
  }

  cargarGaleria() {
    const elements = this.items.toArray().map(ref => ref.nativeElement);
    const total = elements.length;

    if (!this.movieService.moviesCartelera?.length) return;

    this.movieService.selectedPelicula = this.movieService.moviesCartelera[this.cardActive];
    this.displayedDescription = this.processDescription(this.movieService.selectedPelicula.overview);

    for (let i = 0; i < total; i++) {
      const el = elements[i];
      let offset = i - this.cardActive;
      if (offset > total / 2) offset -= total;
      if (offset <= -total / 2) offset += total;

      const stt = Math.abs(offset);
      if (stt <= 2) {
        const translateX = 120 * offset;
        const scale = 1 - 0.1 * stt;
        const opacity = stt === 0 ? 1 : stt === 1 ? 0.6 : 0.2;
        const rotateY = offset > 0 ? -4 : offset < 0 ? 4 : 0;

        el.style.transition = 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, filter 0.4s ease-in-out';
        el.style.transform = `translateX(${translateX}px) scale(${scale}) perspective(400px) rotateY(${rotateY}deg)`;
        el.style.opacity = `${opacity}`;
        el.style.filter = stt === 0 ? 'none' : 'blur(2px)';
        el.style.zIndex = `${5 - stt}`;
        el.style.pointerEvents = stt === 0 ? 'auto' : 'none';
      } else {
        el.style.opacity = '0';
        el.style.zIndex = '0';
        el.style.filter = 'blur(5px)';
        el.style.transform = `translateX(${offset > 0 ? 300 : -300}px) scale(0.5)`;
        el.style.pointerEvents = 'none';
      }
    }
  }

  nextSlide() {
    this.cardActive = (this.cardActive + 1) % this.movieService.moviesCartelera.length;
    this.cargarGaleria();
  }

  prevSlide() {
    this.cardActive = (this.cardActive - 1 + this.movieService.moviesCartelera.length) % this.movieService.moviesCartelera.length;
    this.cargarGaleria();
  }

  private processDescription(description: string): string {
    const MAX_CHARS = 175;
    if (!description) return '';
    if (description.length > MAX_CHARS) {
      let shortened = description.substring(0, MAX_CHARS);
      const lastSpace = shortened.lastIndexOf(' ');
      if (lastSpace !== -1) shortened = shortened.substring(0, lastSpace);
      return `${shortened}...`;
    }
    return description;
  }
}