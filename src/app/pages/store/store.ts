import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductService } from '../../services/product/product-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './store.html',
  styleUrl: './store.css',
})
export class Store {

  filtroDisponibles: boolean = true;
  filtroComestibles: boolean = false;
  filtroNoComestibles: boolean = false;
  vistaActual: 'disponibles' | 'no disponibles' = 'disponibles';
  selectedProducto: any | null = null;
  detalleProducto: Producto | null = null;

  constructor(public productService: ProductService, private storeOrderService: StoreOrderService, private toastr: ToastrService, private errorHandlerService: ErrorHandler){}

  verDetalleProducto(producto: Producto) {      
    this.detalleProducto = producto;       
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

  getProductosComestibles(){
    this.productService.getProductosByProductType('COMIDA').subscribe({
      next: (data) => {this.productService.productos = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    })
  }

  getProductosNoComestibles(){
    this.vistaActual = 'disponibles';
    this.productService.getProductosByProductType('OBJETO').subscribe({
      next: (data) => {this.productService.productos = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    })
  }

  actualizarFiltroDisponibles(){
      this.filtroNoComestibles = false;
      this.filtroComestibles = false;
      this.getProductosDisponibles();
  }

  actualizarFiltroComestibles() {
    if(this.filtroComestibles){
      this.filtroNoComestibles = false;
      this.filtroDisponibles = false;
      this.getProductosComestibles();
    }else{
      this.filtroNoComestibles = false;
      this.getProductosDisponibles();
    }
      
  }

  actualizarFiltroNoComestibles() {
    if(this.filtroNoComestibles){
      this.filtroComestibles = false;
      this.filtroDisponibles = false;
      this.getProductosNoComestibles();
    }else{
      this.filtroComestibles = false;
      this.getProductosDisponibles();
    } 
  }

  ngOnInit(): void {
    this.getProductosDisponibles();
    this.storeOrderService.getActiveCart();
  }

}
