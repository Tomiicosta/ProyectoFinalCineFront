import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PaymentStoreService } from '../../services/paymentStore/payment-store-service';
import { OrderItems } from '../../models/StoreModels/orderItems';
import { AuthService } from '../../services/AuthService/auth-service';
import { orderItemsRequest } from '../../models/StoreModels/orderItemsRequest';
import { UserService } from '../../services/user/user';

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
  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);
  loading: boolean = true;
  cargandoRedireccionLogin = false;


  constructor(private storeOrderService: StoreOrderService, private paymentStoreService: PaymentStoreService, private authService: AuthService, private router: Router, private userService: UserService) { }

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
      next: (cartActualizado) => {
        this.cart = cartActualizado;
      },
      error: (err) => {
        console.error('Error al eliminar el producto', err);
        alert('No se pudo eliminar el producto');
      }
    });
  }

  incrementarCantidad(item: OrderItems): void {
    this.cambiarCantidad(item, item.quantity + 1);
  }

  decrementarCantidad(item: OrderItems): void {
    if (item.quantity <= 1) return; // para bajar de 1, se usa el botón de eliminar
    this.cambiarCantidad(item, item.quantity - 1);
  }

  private cambiarCantidad(item: OrderItems, nuevaCantidad: number): void {
    this.storeOrderService.updateItemQuantity(item.id, nuevaCantidad).subscribe({
      next: (cartActualizado) => {
        this.cart = cartActualizado;
      },
      error: (err) => {
        console.error('Error al actualizar la cantidad', err);
        const detail = typeof err?.error === 'string' ? err.error : err?.error?.message;
        alert(detail || 'No se pudo actualizar la cantidad.');
      }
    });
  }

  iniciarPago(): void {

    // Seguimiento en consola para depuración
    console.log('FINALIZAR PRESIONADO', this.cart);

    // Limpia errores previos de la señal o variable
    this.errorMessage.set(null);

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
        // Igual que en la compra de tickets: redirección directa al checkout.
        window.location.href = response.initPoint;
      },
      error: (err) => {
        console.error('Error al generar la preferencia:', err);
        this.errorMessage.set('No pudimos iniciar el pago. Intentá nuevamente.');
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

  user: any;

  ngOnInit(): void {

    this.cargarCarrito();

    this.usuarioLogueado = this.authService.isLoggedIn();

    if (this.usuarioLogueado) {
      this.userService.getMyProfile().subscribe({
        next: (data) => {
          this.user = data;
        }
      });
    }
  }

  pagarConPuntos() {

    if (!this.usuarioLogueado || !this.cart?.id) {
      this.redirigirLogin();
      return;
    }

    this.paymentStoreService.pagarConPuntos(this.cart.id).subscribe({
        next: (response) => {
          if (this.user) this.user.puntos = response.remainingPoints;
          this.storeOrderService.actualizarContador(0);
          this.router.navigate(['/profile'], {
            queryParams: { compra: 'tienda', codigo: response.purchaseCode }
          });
        },
        error: (err) => {
          console.error(err);
          const detail = typeof err?.error === 'string' ? err.error : err?.error?.message;
          alert(detail || 'No se pudo realizar la compra con puntos.');
        }
      });

  }
}
