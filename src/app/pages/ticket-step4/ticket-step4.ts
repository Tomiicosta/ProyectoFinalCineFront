import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
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
import { UserService } from '../../services/user/user';
import { Butaca } from '../../models/butaca';

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
  totalButacasSeleccionadas : number = 0;
  butacasFilasLetras : string = "";

  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);

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
    public cinemaService: CinemaService,
    private userService: UserService
  ) { }



  ngOnInit(): void {

    this.totalButacasSeleccionadas = this.ticketService.totalButacas;
  
    this.ticketService
    //  Verificar sesión
    this.usuarioLogueado = this.authService.isLoggedIn();

    // Verifica si ya habia una compra, pelicula y funcion seleccionada previamente
    const savedCompra = localStorage.getItem("compra");
    const savedPelicula = localStorage.getItem("peliculaSeleccionada");
    const savedFuncion = localStorage.getItem("funcion");

    if (savedCompra && savedPelicula && savedFuncion) {
      // Setea la Compra previamente definida
      const compra = JSON.parse(savedCompra);
      this.ticketService.setCompra(compra);
      // Setea la pelicula previamente seleccionada
      const pelicula = JSON.parse(savedPelicula);
      this.ticketService.setPeliculaSeleccionada(pelicula);
      // Setea la funcion previamente seleccionada
      const funcion = JSON.parse(savedFuncion);
      this.ticketService.setFuncion(funcion);
    }

    // Intentar obtener usuario
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        // Si está logueado
        const compra = this.ticketService.getCompra();
        if (compra) {
          // SETEA EL EMAIL DEL USUARIO
          compra.userEmail = user.email;
          this.ticketService.setCompra(compra);
        }
      },
      error: (err) => {
        if (err.status === 403) {
          return;
        }
        console.error(err);
      }
    });

    //  Cargar datos
    this.funcionSeleccionada = this.ticketService.getFuncion();
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada()
    
    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) {
      console.warn('No se encontraron datos de película o función seleccionadas.');
      return;
    }
 
    this.butacasFilasLetras = this.ticketService.getButacasFilasLetras();
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

  
  // Obtiene los datos de la compra
  getCompra(){
    this.compra = this.ticketService.getCompra();
  }


  /**
   *  Devuelve la cantidad de butacas seleccionadas
   */
  getTotalButacas():number{
    return this.compra?.seats.length ?? 0;
  }


  /**
   *  Se ejecuta al hacer clic en "FINALIZAR"
   */
  iniciarPago(): void {
    // Seguimiento en consola
    console.log('FINALIZAR PRESIONADO', this.compra)
    
    // Limpia error previo
    this.errorMessage.set(null); 
    
    if(this.confirmacion !== 'compra'){
      this.errorMessage.set('Debe aceptar los terminos y condiciones antes de terminar.');
      return;
    }

    if (!this.usuarioLogueado) {
      this.redirigirALogin();
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

    

    this.pagoService.crearPreferencia(payload).subscribe({
      next: (response) => {
        

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



