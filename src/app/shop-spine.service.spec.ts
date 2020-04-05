import { TestBed } from '@angular/core/testing';

import { ShopSpineService } from './shop-spine.service';

describe('ShopSpineService', () => {
  let service: ShopSpineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopSpineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
