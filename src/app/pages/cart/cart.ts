import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PaymentStoreService } from '../../services/paymentStore/payment-store-service';
import { OrderItems } from '../../models/StoreModels/orderItems';
import { AuthService } from '../../services/AuthService/auth-service';
import { orderItemsRequest } from '../../models/StoreModels/orderItemsRequest';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit {

  usuarioLogueado: boolean = false;
  cart: any = null;
  confirmacion: string | null = null;
  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);
  loading: boolean = true;
  cargandoRedireccionLogin = false;


  constructor(private storeOrderService: StoreOrderService, private paymentStoreService: PaymentStoreService, private authService: AuthService, private router: Router) {}

  cargarCarrito(): void {
    this.storeOrderService.getActiveCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el carrito', err);
        this.loading = false;
      }
    });
  }

  eliminarProducto(itemId: number): void {
    this.storeOrderService.deleteItemFromCart(itemId).subscribe({
      next: () => {
       this.cart.items = this.cart.items.filter((item: any) => item.id !== itemId);
        
        this.storeOrderService.actualizarContador(this.cart.items.length); 
        this.recalcularTotales();
      },
      error: (err) => {
        console.error('Error al eliminar el producto', err);
        alert('No se pudo eliminar el producto');
      }
    });
  }

  recalcularTotales() {
    const itemsValidos = this.cart.items.filter((item:OrderItems) => item && item.historicalPrice !== undefined);

    this.cart.totalAmount = itemsValidos.reduce((acc: number, item: OrderItems) => 
      acc + (item.historicalPrice * item.quantity), 0);
    
    this.cart.totalAmountInPoints = itemsValidos.reduce((acc: number, item: OrderItems) => 
      acc + (item.historicalPriceInPoints * item.quantity), 0);
  }

  iniciarPago(): void {

    // Seguimiento en consola para depuración
    console.log('FINALIZAR PRESIONADO', this.cart);
  
    // Limpia errores previos de la señal o variable
    this.errorMessage.set(null); 
  
    // 1. Validaciones de seguridad y negocio
    if (this.confirmacion !== 'compra') {
      this.errorMessage.set('Debe aceptar los términos y condiciones antes de terminar.');
      return;
    }

    if (!this.cart) {
      console.error('No hay datos de compra disponibles.');
      return;
    }

    if (!this.usuarioLogueado) {
      this.redirigirLogin();
      return;
    }

    /**
    * 2. Mapeo del Payload basado en StoreOrderDetail
    * Adaptamos los datos de la interfaz de la imagen al formato que 
    * requiere tu backend para generar la preferencia de Mercado Pago.
    */
    const payload = {
      storeOrderId: this.cart.id,
      title: `Pedido CinePass #${this.cart.id}`, 
      userEmail: this.cart.userEmail,
      items: this.cart.items.map((item: OrderItems) => ({
        id: item.id,
        productName: item.productName || 'Producto CinePass',
        imageURL: item.imageURL,
        quantity: item.quantity,
        historicalPrice: item.historicalPrice,
        historicalUnitCost: item.historicalUnitCost,
        historicalPriceInPoints: item.historicalPriceInPoints,
        subtotal: item.subtotal,
        subtotalInPoints: item.subtotalInPoints
      })),
      totalAmount: this.cart.totalAmount,
      totalAmountInPoints: this.cart.totalAmountInPoints
    };

    

    this.paymentStoreService.crearPreferencia(payload).subscribe({
      next: (response) => {
        

        // Inicializar Mercado Pago una sola vez
        const mp = this.paymentStoreService.inicializarMercadoPago();

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

  redirigirLogin() {
    this.cargandoRedireccionLogin = true;

    setTimeout(() => {
      // Construye URL a donde debe volver
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/ticket/step4' }
      });
    }, 1200); // efecto de cargando (1000 = 1seg)
  }

  ngOnInit(): void {
    this.cargarCarrito();

    this.usuarioLogueado = this.authService.isLoggedIn();
  }

}
