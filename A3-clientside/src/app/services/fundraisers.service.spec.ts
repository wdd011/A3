import { TestBed } from '@angular/core/testing';

import { FundraisersService } from './fundraisers.service';

describe('FundraisersService', () => {
  let service: FundraisersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundraisersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
