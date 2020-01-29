import { TestBed } from '@angular/core/testing';

import { CarbonApiService } from './carbon-api.service';

describe('CarbonApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarbonApiService = TestBed.get(CarbonApiService);
    expect(service).toBeTruthy();
  });
});
