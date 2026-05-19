import { Injectable } from '@angular/core';
import { Producto } from '../../models/producto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productos: Producto[] = [];

  constructor(private http: HttpClient){}

  // LISTAR
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`/api/products`);
  }

  getProductosById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`/api/products/id/${id}`);
  }

  getProductosByName(name: string): Observable<Producto> {
    return this.http.get<Producto>(`/api/products/name/${name}`);
  }

  getProductosByAvailable(available: boolean) {
    return this.http.get<Producto[]>(`/api/products/available/${available}`);
  }

  // POST
  postProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`/api/products/create`, producto);
  }

  //PUT
  putProducto(id: number, producto: any): Observable<any> {
      return this.http.put(`/api/products/update/${id}`, producto);
  }

  //DELETE
  deleteProducto(id: string | number): Observable<void> {
    return this.http.delete<void>(`/api/products/delete/${id}`);
  }
}
