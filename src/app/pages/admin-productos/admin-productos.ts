import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductService} from '../../services/product/product-service';
import { AuthService } from '../../services/AuthService/auth-service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-productos',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos {
  
  filtroDisponibles: boolean = true;
  productoForm!: FormGroup;
  vistaActual: 'disponibles' | 'no disponibles' = 'disponibles';
  isEditing = false;
  selectedProducto: any | null = null;
  detalleProducto: Producto | null = null;


  constructor(private fb: FormBuilder,public productService: ProductService, public authService: AuthService, private toastr: ToastrService, private errorHandlerService: ErrorHandler) {}

  /* Formulario agregar */
  crearFormulario() {
    this.productoForm = this.fb.group({
      name: ['', Validators.required],
      unitPrice:[0, [Validators.required, Validators.min(1)]],
      priceInPoints:[0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      totalCostStock:[0, [Validators.required, Validators.min(1)]],
      imageURL: ['', Validators.required],
      description: ['', Validators.required],
      available: [true],
      productType: ['', [Validators.required]]
    });
  }

  verDetalleProducto(producto: Producto) {
    this.isEditing = false;        // aseguramos que no esté el form de edición
    this.detalleProducto = producto;       // mostramos la vista de detalle
  }

  cerrarDetalle() {
    this.detalleProducto = null;
  }

  agregarProducto() {
    if (this.productoForm.valid) {
      const nuevoProducto = this.productoForm.value;

      this.productService.postProducto(nuevoProducto).subscribe({
        next: () => {
          this.toastr.success("Producto agregado correctamente.");
          this.productoForm.reset({
            name: '',
            unitPrice: 0,
            priceInPoints: 0,
            stock: 0,
            totalCostStock: 0,
            imageURL: '',
            description: '',
            available: true,
            productType: ''
          });

          if (this.vistaActual === 'disponibles') {
            this.getProductosDisponibles();
          } else {
            this.getProductosNoDisponibles();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);
        }
      });
    } else {
      this.toastr.error("Formulario invalido: Complete los campos")
      this.productoForm.markAllAsTouched();
    }
  }

  getProductTypeLabel(type: string): string {
    switch (type) {
      case 'COMIDA': return 'Comida';
      case 'OBJETO':  return 'Objeto';
      default:         return type ?? '';
    }
  }

  /* rellena el formulario con los datos del producto seleccionado */
  async editarProducto(producto: any) {
    if (!producto?.id) return;

    this.isEditing = true;
    this.detalleProducto = null;
    this.selectedProducto = producto;

    this.productoForm.patchValue({
      id: producto.id,
      name: producto.name,
      unitPrice: producto.unitPrice,
      priceInPoints: producto.priceInPoints,
      stock: producto.stock,
      totalCostStock: producto.totalCostStock,
      imageURL: producto.imageURL,
      description: producto.description,
      available: producto.available,
      productType: producto.productType
    });
  }


  /*Metodo put */
  actualizarProducto() {
    if (!this.isEditing || !this.selectedProducto) return;

    if (this.productoForm.valid) {
      const producto = this.productoForm.value;
      const id = this.selectedProducto.id ?? producto.id;

      if (!id) {
        console.error('No se encontró el ID del producto para actualizar');
        return;
      }

      this.productService.putProducto(id, producto).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado correctamente');
          this.resetFormYRefrescar();
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);
        }
      });
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  /* resetea el formulario y resetea campos */
  cancelarEdicion() {
    this.isEditing = false;
    this.selectedProducto = null;
    this.productoForm.reset({
      name: '',
      unitPrice: 0.0,
      priceInPoints: 0,
      stock: 0,
      totalCostStock: 0,
      imageURL: '',
      description: '',
      available: true,
      productType: ''
    });
  }

  async eliminarProducto(producto: Producto) {
    const result = await Swal.fire({
      title: 'Confirmar Eliminación',
      html: `¿Eliminar "<b>${producto.name}</b>"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    //Verificar el resultado de la confirmación
    if (!result.isConfirmed) {
      this.toastr.error('Eliminación cancelada por el usuario.');
      return; 
    }

    // El usuario confirmó, procedemos con la llamada al servicio.
    this.productService.deleteProducto(producto.id).subscribe({
      next: () => {
        this.getProductosDisponibles();
        this.toastr.success("Producto eliminado correctamente.");
      },
      error: (error: HttpErrorResponse) => {
       this.toastr.error('No se pudo eliminar el producto.');  
      }
    });
  }
  


  /*trae productos disponibles */
  getProductosDisponibles(){
    this.vistaActual = 'disponibles';
    this.productService.getProductosByAvailable(true).subscribe({
      next: (data) => { this.productService.productos = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
    });
  }

  /*trae productos no disponibles */
  getProductosNoDisponibles(){
    this.vistaActual = 'no disponibles';
    this.productService.getProductosByAvailable(false).subscribe({
      next: (data) => { this.productService.productos = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
    });
  }

  /* cambia el listado de productos cada vez que tocan el checkbox*/
  actualizarFiltroDisponibles() {
    if (this.filtroDisponibles) {
      this.getProductosDisponibles();
    } else {
      this.getProductosNoDisponibles();
    }
  }


  /* refresca el listado que se estaba mostrando */
  private refrescarListadoActual() {
    if (this.vistaActual === 'disponibles') {
      this.getProductosDisponibles();
    } else {
      this.getProductosNoDisponibles();
    }
  }

  private resetFormYRefrescar() {
    this.cancelarEdicion(); // resetea form y flags
    this.refrescarListadoActual();
  }

  ngOnInit(): void {
    this.getProductosDisponibles();
    this.crearFormulario();
  }

}
