import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoLoginComponent } from './sso-login.component';
import { AppConfigService } from 'src/app/services/config/config.service';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';
import { APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('SsoLoginComponent', () => {
  let component: SsoLoginComponent;
  let fixture: ComponentFixture<SsoLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoLoginComponent ],
      imports: [
        CommonModule,
        FormsModule,
        ConfirmDialogModule,
        RouterTestingModule
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        ConfirmationService,
        {provide: BaseHttpService, useClass: MockBaseHttpService},
        MessageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(window, 'open');
    fixture = TestBed.createComponent(SsoLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
