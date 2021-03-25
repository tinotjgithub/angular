import { TestBed } from '@angular/core/testing';

import { RouteGuard } from './route.guard.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe('Route.GuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      AppConfigService,        
      { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
      { provide: BaseHttpService, useClass: MockBaseHttpService },
      RouteGuard,
      MessageService,
      AuthenticationService
    ]
  }));

  it('should be created', () => {
    localStorage.setItem('authToken', 'Test');
    const service: RouteGuard = TestBed.get(RouteGuard);
    localStorage.clear();
    expect(service).toBeTruthy();
  });

  it('should can activate on authenticated', () => {
    const service: RouteGuard = TestBed.get(RouteGuard);
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    spyOn(authService, 'checkIsAuthenticated').and.returnValue(true);
    const isActivated = service.canActivate(null, null);
    expect(isActivated).toBeTruthy();
  });

  it('should not activate when not authenticated', () => {
    const service: RouteGuard = TestBed.get(RouteGuard);
    const authService: AuthenticationService = TestBed.get(AuthenticationService);
    spyOn(authService, 'checkIsAuthenticated').and.returnValue(false);
    const isActivated = service.canActivate(null, null);
    expect(isActivated).toBeFalsy();
  });
});
