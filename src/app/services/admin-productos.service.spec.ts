import { TestBed } from '@angular/core/testing';

import { AdminProductosService } from './admin-productos.service';

describe('AdminProductosService', () => {
  let service: AdminProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
