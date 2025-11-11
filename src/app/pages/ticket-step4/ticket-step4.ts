import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService/auth-service';
import { TicketService } from '../../services/ticket/ticket-service';
import { PagoService } from '../../services/pago/pago-service';

@Component({
  selector: 'app-ticket-step4',
  imports: [],
  templateUrl: './ticket-step4.html',
  styleUrl: './ticket-step4.css',
})
// SIN TERMINAR NI PROBAR, SE PUEDE BORRAR Y VOLVER A EMPEZAR
export class TicketStep4 {
  
  usuarioLogueado: boolean = false;
  compraInfo: any = null; // Información de la compra y el preferenceId

  constructor(
    private authService: AuthService,
    private pagoService: PagoService
  ) { }

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.isLoggedIn();

    // 1. Obtener los detalles de la compra (Puede ser desde una ruta o un servicio)
    // Lógica para obtener el carrito/detalles...
    this.compraInfo = {
      nombre: 'Artículo de Prueba',
      precio: 100.00,
      preferenceId: null // Inicialmente nulo
    };

    // 2. Si está logueado, solicita al backend el ID de preferencia de Mercado Pago
    if (this.usuarioLogueado) {
      this.generarPreferencia();
    }
  }

  generarPreferencia(): void {
    /*
    // Llama a tu servicio que se comunica con el backend de Spring
    this.pagoService.crearPreferencia(this.compraInfo)
      .subscribe({
        next: (res: any) => {
          // El backend te devuelve el ID de preferencia
          this.compraInfo.preferenceId = res.id;
        },
        error: (err) => {
          console.error('Error al generar la preferencia', err);
          // Manejo de error: deshabilitar el botón y mostrar un mensaje
        }
      });
      */
  }

  iniciarPago(): void {
    const preferenceId = this.compraInfo.preferenceId;
    if (preferenceId) {
      // 3. Redirección al entorno de pago seguro de Mercado Pago
      // Esto es con el ID de preferencia generado por Spring
      const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
      window.location.href = checkoutUrl;
    } else {
      alert('Aún no se ha generado la orden de pago. Inténtelo de nuevo.');
    }
  }

  redirigirALogin(): void {
    // Lógica de redirección a tu página de login
    /*
    this.authService.redirectToLogin();
    */
  }
}
