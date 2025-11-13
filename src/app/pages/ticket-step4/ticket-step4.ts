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
import { Compra } from '../../models/compra';
import { FormsModule } from '@angular/forms';

// declarar MercadoPago globalmente
declare var MercadoPago: any;

@Component({
  selector: 'app-ticket-step4',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ticket-step4.html',
  styleUrl: './ticket-step4.css',
})
export class TicketStep4 implements OnInit {

  usuarioLogueado: boolean = false;
  tipoOperacion: string | null = null;
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  compra! : Compra | null;

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
    this.funcionSeleccionada = this.ticketService.getFuncion();
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada()
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

  getCompra(){
    this.compra = this.ticketService.getCompra() || null;
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
      title: this.compra?.title,
      description: this.compra?.description,
      userEmail: this.compra?.userEmail,
      quantity: this.compra?.quantity,
      unitPrice: this.compra?.unitPrice,
      seats: this.compra?.seats,
      functionId: this.compra?.functionId
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
    const cantidad = this.compra?.quantity ?? 0;
    const precio = this.compra?.unitPrice ?? 0;
  
    const total = cantidad * precio;
  
    return total;
  }

  // Formatear fecha: "YYYY-MM-DD" → "viernes 14 de noviembre"
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // agrega el día de la semana
      day: 'numeric',
      month: 'long'
    };

    // Esto devuelve algo como: "viernes, 14 de noviembre"
    const fechaFormateada = dateObj.toLocaleDateString('es-ES', opciones);
    // Eliminamos la coma y capitalizamos la primera letra
    return fechaFormateada.replace(',', '');
  }

  // Formatear hora: "HH:mm:ss" → "HH:mm"
  formatearHora(hora: string): string {
    return hora.slice(0, 5); // corta los segundos
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


