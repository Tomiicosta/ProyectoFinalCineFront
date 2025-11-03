import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStep2 } from './ticket-step2';

describe('TicketStep2', () => {
  let component: TicketStep2;
  let fixture: ComponentFixture<TicketStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStep2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStep2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
