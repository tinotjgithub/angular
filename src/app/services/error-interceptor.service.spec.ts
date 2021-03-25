import { TestBed } from '@angular/core/testing';

import { ErrorInterceptorService } from './error-interceptor.service';
import { NotifierService } from './notifier.service';
import { BaseHttpService } from './base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { MockBaseHttpService } from '../mocks/base-http.mock';

describe('ErrorInterceptorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ErrorInterceptorService,
        NotifierService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
      ],
    })
  );

  it('should be created', () => {
    const service: ErrorInterceptorService = TestBed.get(ErrorInterceptorService);
    expect(service).toBeTruthy();
  });
});
