import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductService } from '../../services/product/product-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

@Component({
  selector: 'app-store',
  imports: [],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {

  vistaActual: 'disponibles' | 'no disponi' = 'disponibles';
  selectedProducto: any | null = null;
  detalleProducto: Producto | null = null;

  constructor(public productService: ProductService, private errorHandlerService: ErrorHandler){}

  verDetalleProducto(producto: Producto) {      
    this.detalleProducto = producto;       // mostramos la vista de detalle
  }

  cerrarDetalle() {
    this.detalleProducto = null;
  }

  getProductosDisponibles(){
    this.vistaActual = 'disponibles';
    this.productService.getProductosByAvailable(true).subscribe({
      next: (data) => { this.productService.productos = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
    });
  }

  ngOnInit(): void {
    this.getProductosDisponibles();
  }

}
