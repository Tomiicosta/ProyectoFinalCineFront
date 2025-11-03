import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStep3 } from './ticket-step3';

describe('TicketStep3', () => {
  let component: TicketStep3;
  let fixture: ComponentFixture<TicketStep3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStep3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStep3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
