import { TestBed } from '@angular/core/testing';

import { HostRoleGuard } from './host-role.guard';

describe('HostRoleGuard', () => {
  let guard: HostRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HostRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
