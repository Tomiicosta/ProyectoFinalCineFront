import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
<<<<<<< Updated upstream
export class PagoService {
  
=======
export class PaymentService {

  // Credencial MP
  private mp : string | undefined;

  constructor(private http: HttpClient) {
    // Se inicializa una sola vez
    this.mp = new MercadoPago('APP_USR-dd489abe-d5ed-4a90-a939-efe24534a5ca', {
      locale: 'es-AR'
    });
  }

  
  /**
   * Inicializa el SDK de Mercado Pago en el frontend
   * (solo si el script fue cargado correctamente en index.html)
   */
  inicializarMercadoPago(): any {
    return this.mp;
  }


  /**
   * Llama al backend para crear una preferencia de pago
   */
  crearPreferencia(payload: any) {
    return this.http.post(`/api/payments/create`, payload);
  }


>>>>>>> Stashed changes
}
