import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth-service';
import { TicketService } from '../../services/ticket/ticket-service';
import { PaymentService } from '../../services/payment/payment-service';
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
  confirmacion: string | null = null;
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  compra! : Compra | undefined;
  

  compraInfo: any = {
    nombre: '',
    precio: 0,
    preferenceId: null
  };


  constructor(
    private authService: AuthService,
    private pagoService: PaymentService,
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

    this.getCompra();

    //  Inicializar datos de compra
    this.compraInfo = {
      nombre: this.peliculaSeleccionada.title,
      precio: this.calcularTotal(),
      preferenceId: null
    };

  }


  getCompra(){
    this.compra = this.ticketService.getCompra();
  }


  /**
   *  Se ejecuta al hacer clic en "FINALIZAR"
   */
  iniciarPago(): void {
    console.log('FINALIZAR PRESIONADO', this.compra)

    if (!this.usuarioLogueado) {
      this.redirigirALogin();
      return;
    }

    if (this.confirmacion !== 'compra') {
      alert('Debes aceptar los términos y condiciones antes de continuar.');
      return;
    }

    if (!this.compra) {
      console.error('No hay datos de compra disponibles.');
      return;
    }

    const payload = {
      title: this.compra.title,
      description: this.compra.description,
      userEmail: this.compra.userEmail,
      quantity: this.compra.quantity,
      unitPrice: this.compra.unitPrice,
      seats: this.compra.seats,
      functionId: this.compra.functionId
    };

    console.log('Payload enviado:', payload);

    this.pagoService.crearPreferencia(payload).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        // Inicializar Mercado Pago una sola vez
        const mp = this.pagoService.inicializarMercadoPago();

        // Renderizar el botón/ventana de pago
        mp.bricks().create('wallet', 'wallet_container', {
          initialization: { preferenceId: response.preferenceId },
          customization: { texts: { valueProp: 'smart_option' } },
        });

        // Redirige a Mercado Pago
        window.location.href = response.initPoint; 
      },
      error: (err) => {
        console.error('Error al generar la preferencia:', err);
      }
    });
  }



  //  Cálculo total de la compra
  calcularTotal(): number {
    const cantidad = this.compra?.seats.length ?? 0;
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
    this.router.navigate(['/ticket/step3']);
  }


  volverAtras(): void {
    this.location.back();
  }


  confirmarPaso4(): void {
    if (!this.confirmacion) {
      alert('Debe seleccionar un tipo de operación.');
      return;
    }

    if (this.confirmacion === 'compra') {
      this.iniciarPago();
    } else {
      this.router.navigate(['/confirmacion-reserva']);
    }
  }
}



