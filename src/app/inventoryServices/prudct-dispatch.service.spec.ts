import { TestBed } from '@angular/core/testing';

import { PrudctDispatchService } from './prudct-dispatch.service';

describe('PrudctDispatchService', () => {
  let service: PrudctDispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrudctDispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
