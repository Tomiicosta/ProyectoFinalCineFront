import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStep1 } from './ticket-step1';

describe('TicketStep1', () => {
  let component: TicketStep1;
  let fixture: ComponentFixture<TicketStep1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStep1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketStep1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
