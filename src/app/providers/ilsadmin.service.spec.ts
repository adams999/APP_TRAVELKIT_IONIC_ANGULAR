import { TestBed } from '@angular/core/testing';

import { IlsadminService } from './ilsadmin.service';

describe('IlsadminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IlsadminService = TestBed.get(IlsadminService);
    expect(service).toBeTruthy();
  });
});
