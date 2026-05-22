import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductService } from '../../services/product/product-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

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
  }

}
