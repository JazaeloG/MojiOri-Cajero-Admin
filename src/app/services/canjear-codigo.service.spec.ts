import { TestBed } from '@angular/core/testing';

import { CanjearCodigoService } from './canjear-codigo.service';

describe('CanjearCodigoService', () => {
  let service: CanjearCodigoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanjearCodigoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
