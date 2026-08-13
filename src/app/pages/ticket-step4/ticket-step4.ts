import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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

@Component({
  selector: 'app-ticket-step4',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ticket-step4.html',
  styleUrl: './ticket-step4.css',
})
export class TicketStep4 implements OnInit {

  // Nota: esta ruta tiene AuthGuard (ver app.routes.ts), por lo que acá
  // el usuario SIEMPRE está logueado. No hace falta manejar el caso contrario.
  funcionCaducada: boolean = false;
  terminosAceptados: boolean = false;
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  compra! : Compra | undefined;
  totalButacasSeleccionadas : number = 0;
  butacasFilasLetras : string = "";

  cargandoPago = false;
  cargandoRedireccionCaducado = false;
  mostrarTerminos = false;

  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(
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

    // Verifica si ya habia una compra, pelicula y funcion seleccionada previamente.
    // Si falta algo, o la función ya pasó, tratamos ambos casos igual: bloqueamos
    // con el modal y mandamos a elegir de nuevo (antes solo se bloqueaba si la
    // función existía y estaba vencida, dejando la página rota si no había datos).
    const savedCompra = localStorage.getItem("compra");
    const savedPelicula = localStorage.getItem("peliculaSeleccionada");
    const savedFuncion = localStorage.getItem("funcion");

    if (savedCompra && savedPelicula && savedFuncion) {
      const compra = JSON.parse(savedCompra);
      const pelicula = JSON.parse(savedPelicula);
      const funcion = JSON.parse(savedFuncion);

      this.ticketService.setCompra(compra);
      this.ticketService.setPeliculaSeleccionada(pelicula);
      this.ticketService.setFuncion(funcion);

      const fechaFuncion = new Date(`${funcion.date}T${funcion.time}`);
      this.funcionCaducada = fechaFuncion.getTime() < Date.now();
    } else {
      this.funcionCaducada = true; // no hay función guardada
    }

    if (this.funcionCaducada) {
      return;
    }

    // Completa el email del comprador con el del usuario logueado
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        const compra = this.ticketService.getCompra();
        if (compra) {
          compra.userEmail = user.email;
          this.ticketService.setCompra(compra);
        }
      },
      error: (err) => console.error(err)
    });

    //  Cargar datos
    this.funcionSeleccionada = this.ticketService.getFuncion();
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada()

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) {
      console.warn('No se encontraron datos de película o función seleccionadas.');
      this.funcionCaducada = true;
      return;
    }

    this.butacasFilasLetras = this.ticketService.getButacasFilasLetras();
    //  Obtener sala
    this.cinemaService.getSala(this.funcionSeleccionada.cinemaId).subscribe({
      next: (data) => this.cinemaService.selectedSala = data,
      error: (err) => console.error('Error al obtener la sala:', err)
    });

    this.getCompra();
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
    this.errorMessage.set(null);

    if (!this.terminosAceptados) {
      this.errorMessage.set('Debe aceptar los términos y condiciones antes de continuar.');
      return;
    }

    if (!this.compra) {
      this.errorMessage.set('No hay datos de compra disponibles. Volvé a seleccionar tus butacas.');
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

    this.cargandoPago = true;

    this.pagoService.crearPreferencia(payload).subscribe({
      next: (response) => {
        // Redirige al checkout de Mercado Pago
        window.location.href = response.initPoint;
      },
      error: (err) => {
        console.error('Error al generar la preferencia:', err);
        this.cargandoPago = false;
        this.errorMessage.set('No pudimos iniciar el pago. Intentá nuevamente.');
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

  volverASeleccionButacas(): void {
    this.router.navigate(['/ticket/step3']);
  }


  volverAtras(): void {
    this.location.back();
  }

  redirigirStep2() {
    this.cargandoRedireccionCaducado = true;

    setTimeout(() => {
      this.router.navigate(['/ticket/step2']);
    }, 1200); // efecto de cargando (1000 = 1seg)
  }

  abrirTerminos(): void {
    this.mostrarTerminos = true;
  }

  cerrarTerminos(): void {
    this.mostrarTerminos = false;
  }
}



