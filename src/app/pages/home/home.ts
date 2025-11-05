import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

  imagenes = [
    { src: 'img/home/PruebaCarrucel.png', titulo: 'Chainsaw - Man' },
    { src: 'img/home/Batman.png', titulo: 'Batman' },
    { src: 'img/home/Panda.png', titulo: 'Kung Fu Panda' },
    { src: 'img/home/Kimetsu.png', titulo: 'Kimetsu no Yaiba' }
  ];

  indiceActual = 0;

  // 🔹 Retorna el título actual
  get nombrePelicula(): string {
    return this.imagenes[this.indiceActual].titulo;
  }

  // 🔹 Avanza una imagen
  siguiente() {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
  }

  // 🔹 Retrocede una imagen
  anterior() {
    this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
  }




  

  peliculas = [
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' },
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' },
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' },
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' },
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' },
    { titulo: 'Tomb Raider', img: 'img/home/portadas/tomb.png' },
    { titulo: 'Ponte en mi lugar', img: 'img/home/portadas/ponteEnMiLugar.png' },
    { titulo: 'Matrix', img: 'img/home/portadas/matrix.png' }
    
  ];

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





  

  // 🔹 Cambio automático cada 4 segundos (opcional)
  ngOnInit() {
    setInterval(() => this.siguiente(), 8000);
    setInterval(() => this.moverDerecha(), 6000);
  }

}

