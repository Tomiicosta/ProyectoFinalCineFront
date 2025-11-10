import { TestBed } from '@angular/core/testing';

import { SalaService } from './salas-service';

describe('SalasService', () => {
  let service: SalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
