import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { orderItemsRequest } from '../../models/StoreModels/orderItemsRequest';
import { StoreOrderDetail } from '../../models/StoreModels/storeOrderDetail';
import { StoreOrderList } from '../../models/StoreModels/storeOrderList';

@Injectable({
  providedIn: 'root'
})
export class StoreOrderService {

  private cartItemCount = new BehaviorSubject<number>(0);
  
  public cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private http: HttpClient) {}

  actualizarContador(cantidad: number) {
    this.cartItemCount.next(cantidad);
  }

  // POST
  addToCart(request: orderItemsRequest): Observable<StoreOrderDetail> {
    return this.http.post<StoreOrderDetail>(`/api/store/cart/items`, request).pipe(
      tap((cart: StoreOrderDetail) => {

        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
      
        this.cartItemCount.next(totalItems);
      })
    );
  }

  // GET
  getActiveCart(): Observable<StoreOrderDetail> {
    return this.http.get<StoreOrderDetail>(`/api/store/cart`).pipe(
      tap((cart: StoreOrderDetail) => {
        
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartItemCount.next(totalItems);
      })
    );
  }

  // GET
  getHistory(): Observable<StoreOrderList[]> {
    return this.http.get<StoreOrderList[]>(`/api/store/history`);
  }

  

  // DELETE
  deleteItemFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`/api/store/cart/items/${itemId}`);
  }
}
