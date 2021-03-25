import { TestBed } from '@angular/core/testing';

import { HeaderService } from './header.service';

describe('HeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HeaderService
    ]
  }));

  it('should be created', () => {
    const service: HeaderService = TestBed.get(HeaderService);
    expect(service).toBeTruthy();
  });

  it('should open side menu and update the listener', () => {
    const service: HeaderService = TestBed.get(HeaderService);
    let value;
    service.sideMenuClickedListener().subscribe(val => value = val);
    service.setSideMenuAction(true);
    expect(value).toBeTruthy();
  });

  it('should update claimDetails', () => {
    const service: HeaderService = TestBed.get(HeaderService);
    let value;
    service.$claimDetails.subscribe(val => value = val);
    service.updateClaimDetails([{claimId: '12345'}]);
    expect(value.length).toBe(1);
  });

  it('should update audit claimDetails', () => {
    const service: HeaderService = TestBed.get(HeaderService);
    let value;
    service.$auditClaimDetails.subscribe(val => value = val);
    service.updateAuditClaimDetails([{claimId: '12345'}]);
    expect(value.length).toBe(1);
  });
});
