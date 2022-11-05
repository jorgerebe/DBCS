import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Role } from '../shared/app.model';

import { CrearUserComponent } from './user-crear.component';

describe('CrearUserComponent', () => {
  let component: CrearUserComponent;
  let fixture: ComponentFixture<CrearUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
