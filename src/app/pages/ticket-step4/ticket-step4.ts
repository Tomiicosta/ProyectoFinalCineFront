import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth-service';
import { TicketService } from '../../services/ticket/ticket-service';
import { PagoService } from '../../services/payment/payment-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { FunctionService } from '../../services/function/function-service';
import { CinemaService } from '../../services/cinema/cinema-service';

// declarar MercadoPago globalmente
declare var MercadoPago: any;

@Component({
  selector: 'app-ticket-step4',
  standalone: true,
  imports: [],
  templateUrl: './ticket-step4.html',
  styleUrl: './ticket-step4.css',
})
export class TicketStep4 implements OnInit {

  usuarioLogueado: boolean = false;
  tipoOperacion: string | null = null;
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;

  compraInfo: any = {
    nombre: '',
    precio: 0,
    preferenceId: null
  };

  constructor(
    private authService: AuthService,
    private pagoService: PagoService,
    private location: Location,
    private router: Router,
    private ticketService: TicketService,
    private functionService: FunctionService,
    public cinemaService: CinemaService
  ) { }

  ngOnInit(): void {
    //  Verificar sesión
    this.usuarioLogueado = this.authService.isLoggedIn();

    //  Cargar datos
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    this.funcionSeleccionada = this.ticketService.getFuncion();

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) {
      console.warn('No se encontraron datos de película o función seleccionadas.');
      return;
    }

    //  Obtener sala
    this.cinemaService.getSala(this.funcionSeleccionada.cinemaId).subscribe({
      next: (data) => this.cinemaService.selectedSala = data,
      error: (err) => console.error('Error al obtener la sala:', err)
    });

    //  Inicializar datos de compra
    this.compraInfo = {
      nombre: this.peliculaSeleccionada.title,
      precio: this.calcularTotal(),
      preferenceId: null
    };
  }

  /**
   *  Se ejecuta al hacer clic en "CONFIRMAR COMPRA"
   */
  iniciarPago(): void {
    if (!this.usuarioLogueado) {
      this.redirigirALogin();
      return;
    }

    const payload = {
      title: this.peliculaSeleccionada?.title,
      description: this.peliculaSeleccionada?.title,
      userEmail: this.authService.getUserEmail(),
      quantity: this.ticketService.getCantidadButacasSeleccionadas(),
      unitPrice: this.ticketService.getPrecioPorEntrada(),
      seats: this.ticketService.getButacasSeleccionadas(),
      functionId: this.funcionSeleccionada?.id
    };

    this.pagoService.crearPreferencia(payload).subscribe({
      next: (res: any) => {
        this.compraInfo.preferenceId = res.preferenceId;

        //  Inicializar el SDK solo una vez
        const mp = this.pagoService.inicializarMercadoPago();

        mp.bricks().create('wallet', 'wallet_container', {
          initialization: { preferenceId: res.preferenceId },
          customization: { texts: { valueProp: 'smart_option' } },
        });
      },
      error: (err) => {
        console.error('Error al generar la preferencia:', err);
      },
    });
  }

  //  Cálculo total de la compra
  calcularTotal(): number {
    return this.ticketService.getCantidadButacasSeleccionadas() * this.ticketService.getPrecioPorEntrada();
  }

  //  Fecha legible
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return dateObj.toLocaleDateString('es-ES', opciones);
  }

  //  Hora legible
  formatearHora(hora: string): string {
    return hora.slice(0, 5);
  }

  redirigirALogin(): void {
    this.router.navigate(['/login']);
  }

  volverASeleccionButacas(): void {
    this.router.navigate(['/tickets/paso3']);
  }

  volverAtras(): void {
    this.location.back();
  }

  confirmarPaso4(): void {
    if (!this.tipoOperacion) {
      alert('Debe seleccionar un tipo de operación.');
      return;
    }

    if (this.tipoOperacion === 'compra') {
      this.iniciarPago();
    } else {
      this.router.navigate(['/confirmacion-reserva']);
    }
  }
}


