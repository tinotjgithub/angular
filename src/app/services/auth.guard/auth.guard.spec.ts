import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { BaseHttpService } from '../base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthGuard,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        AuthenticationService
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should allow route when expected roles inbcludes current role',
  inject([AuthGuard, AuthenticationService], (gaurd: AuthGuard, service: AuthenticationService) => {
    const activatedRoute = new ActivatedRouteSnapshot();
    activatedRoute.data = {
      expectedRoles: ['Administrator']
    };
    spyOnProperty(service, "userRole").and.returnValue('Administrator');
    expect(gaurd.canActivate(activatedRoute, null)).toBeTruthy();
  }));

  it('should not allow route when expected roles inbcludes current role',
  inject([AuthGuard, AuthenticationService], (gaurd: AuthGuard, service: AuthenticationService) => {
    const activatedRoute = new ActivatedRouteSnapshot();
    activatedRoute.data = {
      expectedRoles: ['Administrator']
    };
    spyOnProperty(service, "userRole").and.returnValue('Claims Lead');
    expect(gaurd.canActivate(activatedRoute, null)).toBeFalsy();
  }));
});
