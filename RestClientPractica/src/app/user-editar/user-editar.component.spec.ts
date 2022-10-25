import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditarComponent } from './user-editar.component';

describe('UserEditarComponent', () => {
  let component: UserEditarComponent;
  let fixture: ComponentFixture<UserEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
