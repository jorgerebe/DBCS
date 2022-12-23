import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaAvailabilityComponent } from './reserva-availability.component';

describe('ReservaAvailabilityComponent', () => {
  let component: ReservaAvailabilityComponent;
  let fixture: ComponentFixture<ReservaAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
