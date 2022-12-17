import { TestBed } from '@angular/core/testing';

import { GuestRoleGuard } from './guest-role.guard';

describe('GuestRoleGuard', () => {
  let guard: GuestRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuestRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
