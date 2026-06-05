import { TestBed } from '@angular/core/testing';

import { PaymentStoreService } from '../paymentStore/payment-store-service';

describe('PaymentStoreService', () => {
  let service: PaymentStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
