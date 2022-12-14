import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaListarComponent } from './reserva-listar.component';

describe('ReservaListarComponent', () => {
  let component: ReservaListarComponent;
  let fixture: ComponentFixture<ReservaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaListarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
