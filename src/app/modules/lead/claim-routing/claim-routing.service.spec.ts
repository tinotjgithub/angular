import { TestBed } from '@angular/core/testing';

import { ClaimRoutingService } from './claim-routing.service';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('ClaimRoutingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ClaimRoutingService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
      ],
    })
  );

  it('should be created', () => {
    const service: ClaimRoutingService = TestBed.get(ClaimRoutingService);
    expect(service).toBeTruthy();
  });

  it('should get routed list', () => {
    const service: ClaimRoutingService = TestBed.get(ClaimRoutingService);
    const http: BaseHttpService = TestBed.get(BaseHttpService);
    spyOn(http, 'get').and.returnValue(of(['Test']));
    let value;
    service.routedClaimListListener().subscribe(val => value = val);
    service.getRoutedList();
    const detail = service.getRoutedClaimList;
    expect(value.length).toEqual(1);
  });

  it('should able to route', () => {
    const service: ClaimRoutingService = TestBed.get(ClaimRoutingService);
    const http: BaseHttpService = TestBed.get(BaseHttpService);
    spyOn(http, 'post').and.returnValue(of('success'));
    service.route(true).then(() => expect(true).toBeTruthy());
  });

  it('should able to handle error on route', () => {
    const service: ClaimRoutingService = TestBed.get(ClaimRoutingService);
    const http: BaseHttpService = TestBed.get(BaseHttpService);
    spyOn(http, 'post').and.returnValue(throwError(''));
    service.route(true).catch((err) => expect(true).toBeTruthy());
  });
});
