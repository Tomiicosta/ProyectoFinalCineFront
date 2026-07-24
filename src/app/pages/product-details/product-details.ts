import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  producto: any;
  loading: boolean= true;


  constructor(private route: ActivatedRoute, private productService: ProductService, private storeOrderService: StoreOrderService, private toastr: ToastrService, private authService: AuthService, private router: Router) {}

  

  cargarProducto(id: number) {
    this.productService.getProductosById(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto', err);
        this.loading = false;
      }
    });
  }

  agregarAlCarrito(producto: any) {
    if (!this.authService.isLoggedIn()) {
      this.toastr.info('Inicia sesion para agregar productos al carrito.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const isClient = this.authService.getRol()
      ?.some(role => role.toUpperCase() === 'CLIENT');

    if (!isClient) {
      this.toastr.error('Tu usuario no tiene permisos para utilizar el carrito.');
      return;
    }

    const request = {
      productId: producto.id,
      quantity: 1, 
      stock: producto.stock 
    };


    this.storeOrderService.addToCart(request).subscribe({
      next: (carritoActualizado) => {
        console.log('Agregado exitosamente', carritoActualizado);
        producto.stock -= request.quantity;
        this.toastr.success("Producto agregado al carrito");
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
        this.toastr.error("Error al agregar al carrito");
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.cargarProducto(Number(id));
    }else{
      console.warn('No se encontró ningún ID en la URL');
      this.loading = false;
    }
  }
}
