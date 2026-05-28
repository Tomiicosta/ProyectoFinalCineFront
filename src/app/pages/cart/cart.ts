import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink], // Clave para usar *ngIf y *ngFor (o puedes usar @if y @for)
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})

export class Cart implements OnInit {

  cart: any = null;
  loading: boolean = true;

  constructor(private storeOrderService: StoreOrderService) {}

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
      next: (updatedCart) => {
        // Magia: el backend nos da el carrito ya recalculado, lo asignamos directo
        this.cart = updatedCart; 
      },
      error: (err) => {
        console.error('Error al eliminar el producto', err);
        alert('No se pudo eliminar el producto');
      }
    });
  }

  ngOnInit(): void {
    this.cargarCarrito();
  }

}