import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListarComponent } from './user-listar.component';

describe('UserListarComponent', () => {
  let component: UserListarComponent;
  let fixture: ComponentFixture<UserListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
