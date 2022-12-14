import { TestBed } from '@angular/core/testing';

import { ReservaApiRestService } from './reserva-api-rest.service';

describe('ReservaApiRestService', () => {
  let service: ReservaApiRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaApiRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
