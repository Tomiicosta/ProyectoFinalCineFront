import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  producto: any;
  loading: boolean= true;


  constructor(private route: ActivatedRoute, private productService: ProductService, private storeOrderService: StoreOrderService, private toastr: ToastrService) {}

  

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

    this.storeOrderService.getActiveCart();
  }
}
