import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStep4 } from './ticket-step4';

describe('TicketStep4', () => {
  let component: TicketStep4;
  let fixture: ComponentFixture<TicketStep4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStep4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStep4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
