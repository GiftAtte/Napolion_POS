import { TestBed } from '@angular/core/testing';

import { AlartService } from './alart.service';

describe('AlartService', () => {
  let service: AlartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
