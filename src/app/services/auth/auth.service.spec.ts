import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BaseHttpService } from '../base-http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      AuthInterceptor,
      { provide: BaseHttpService, useClass: MockBaseHttpService },
      MessageService
    ]
  }));

  it('should be created', () => {
    const service: AuthInterceptor = TestBed.get(AuthInterceptor);
    expect(service).toBeTruthy();
  });
});
