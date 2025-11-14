import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket/ticket-service';
import { NgClass } from '@angular/common';
import { Pelicula } from '../../models/pelicula';
import { Butaca } from '../../models/butaca';
import { Location } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { FunctionService } from '../../services/function/function-service';
import { CinemaService } from '../../services/cinema/cinema-service';
import { Sala } from '../../models/sala';
import { UserService } from '../../services/user/user';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-step3',
  standalone: true, // Si usas standalone, si no, elimina o dejalo
  imports: [NgClass],
  templateUrl: './ticket-step3.html',
  styleUrl: './ticket-step3.css',
})
export class TicketStep3 implements OnInit {

  // Mapa de Butacas (Inicializado con la nueva estructura)
  // Las butacas que eran 'ocupada' ahora tienen occupied: true
  mapaButacas: WritableSignal<Butaca[][]> = signal([]);

  // Asientos Seleccionados (Ahora solo guarda el objeto Butaca de las seleccionadas)
  butacasSeleccionadas: WritableSignal<Butaca[]> = signal([]);

  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);

  // Propiedades computadas para la UI
  totalButacasSeleccionadas = computed(() => this.butacasSeleccionadas().length);
  // Lista de IDs de butacas seleccionadas para mostrar en la UI
  listaButacasSeleccionadas = computed(() =>
    this.butacasSeleccionadas().map(b => `${String.fromCharCode(64 + b.seatRowNumber)}${b.seatColumnNumber}`).join(', ')
  );


  // Variables no-signals
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  salaSeleccionada: Sala | undefined;
  userSeleccionado!: User | null;

  mostrarModalLogin = false;
  cargandoRedireccion = false;

  constructor(
    private location: Location,
    private router: Router,
    private ticketService: TicketService,
    private functionService: FunctionService,
    private cinemaService: CinemaService,
    private userService: UserService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    // La lógica de inicialización es NECESARIA para que no se cargue el HTML antes que el mapa de butacas
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    this.funcionSeleccionada = this.ticketService.getFuncion();

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) return;

    

    // Recibe la Sala por Funcion
    this.cinemaService.getSala(this.funcionSeleccionada.cinemaId).subscribe({
      next: (data) => {
        this.ticketService.setSala(data);
        
      },
      error: (e) => { console.error("ERROR CinemaService getSala = ", e) }
    });

    // if (!this.ticketService.salaActual) return; // ESTA MIERDA BUGEA TODO EL MAPA DE BUTACAS Y NO LO MUESTRA Q_Q

    // Recibe las Butacas por Funcion
    this.functionService.getSeatsByFunction(this.funcionSeleccionada.id)
      .subscribe({
        next: (butacas) => {
          

          // Agrupar las butacas por fila
          const matrizButacas: Butaca[][] = Array.from({ length: this.ticketService.salaActual?.rowSeat || 0 }, () =>
            Array(this.ticketService.salaActual?.columnSeat || 0).fill(null)
          );

          for (const b of butacas) {
            
            const rowIndex = b.seatRowNumber - 1; // restamos 1 si las filas empiezan desde 1
            const colIndex = b.seatColumnNumber - 1;
            matrizButacas[rowIndex][colIndex] = b;
          }

          

          this.mapaButacas.set(matrizButacas);

         
        },
        error: (err) => console.error('Error al cargar butacas:', err)
      });
  }

  // Método para manejar el click en una butaca disponible
  seleccionarButaca(butaca: Butaca): void {
    if (butaca.occupied) {
      // Si la butaca esta ocupada
      this.errorMessage.set("ERROR: La butaca ya está ocupada.");
      return;
    }

    this.errorMessage.set(null); // Limpiar error si la seleccion es valida

    // Se usa el id para saber si ya esta seleccionada
    const isSelected = this.butacasSeleccionadas().some(b => b.id === butaca.id);

    this.butacasSeleccionadas.update(currentSelections => {
      if (isSelected) {
        // Si esta seleccionada, la quitamos (deseleccionar)
        return currentSelections.filter(b => b.id !== butaca.id);
      } else {
        // Si no esta seleccionada, la agregamos (seleccionar)
        return [...currentSelections, butaca];
      }
    });
  }

  // Metodo para verificar si una butaca esta seleccionada (para NgClass)
  isButacaSeleccionada(butaca: Butaca): boolean {
    return this.butacasSeleccionadas().some(b => b.id === butaca.id);
  }

  // Limpia todas las butacas seleccionadas
  limpiarButacasSeleccionadas(): void {
    // Simplemente vaciamos el Signal de butacas seleccionadas
    this.butacasSeleccionadas.set([]);
    this.errorMessage.set(null);
  }

  // boton para confirmar el paso 3
  confirmarPaso3(): void {

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) return;

    // Lógica de confirmación:
    if (this.totalButacasSeleccionadas() === 0) {
      this.errorMessage.set("ERROR: Seleccione al menos una butaca para continuar.");
      return;
    }
    // Armar array de butacas tipo ["A1", "C3", ...]
    const seatsSeleccionados: string[] = this.butacasSeleccionadas().map(b =>
      `R${b.seatRowNumber}C${b.seatColumnNumber}`
    );

   
    this.ticketService.setButacasFilasLetras(this.listaButacasSeleccionadas());          ///Guarda las butacas en formato [A1,A2,B4]
   
    this.ticketService.totalButacas = this.totalButacasSeleccionadas();

    // Opcional: ver en consola qué se está mandando
    

    this.userService.getMyProfile().subscribe({
      next: (data: User) => {
        this.userSeleccionado = data;
        

        // Arma el ticket SOLO después de tener el usuario
        this.ticketService.setCompra({
          title: "Entrada de cine",
          description: "Proyeccion de la pelicula " + this.peliculaSeleccionada?.title +
            " en " + this.funcionSeleccionada?.cinemaName,
          userEmail: data.email,   // ---> AHORA SÍ EXISTE
          quantity: 1,
          unitPrice: this.ticketService.salaActual?.price || 0,
          functionId: this.funcionSeleccionada?.id || 0,
          seats: seatsSeleccionados
        });

        

        this.router.navigate(['/ticket/step4']);
      },
      error: (err) => {

        if (err.status === 403) {
          this.mostrarModalLogin = true;   // muestra el modal
          return;
        }

        console.error(err);

      }
    });
  }

  // boton para volver atras
  volverAtras(): void {
    this.location.back();
  }

  // boton para confirmar inicio de sesion si esta deslogueado
  redirigirLogin() {
    this.cargandoRedireccion = true;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1200); // efecto de cargando (1000 = 1seg)
  }

  // funcion auxiliar: Formatear butaca.rowNumber a un indice de fila "A","B","C",etc..
  getFilaLetra(seatRowNumber?: number): string {
    if (seatRowNumber == null) return '';           // retorna vacío si no hay dato
    return String.fromCharCode(64 + seatRowNumber); // rowNumber es 1-based -> 1 => 'A'
  }

  // funcion auxiliar: Formatear fecha: "YYYY-MM-DD" → "viernes 14 de noviembre"
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

  // funcion auxiliar: Formatear hora: "HH:mm:ss" → "HH:mm"
  formatearHora(hora: string): string {
    return hora.slice(0, 5); // corta los segundos
  }

}