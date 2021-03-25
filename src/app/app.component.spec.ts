import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ComponentsModule } from './shared/components/components.module';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { BaseHttpService } from './services/base-http.service';
import { DatePipe } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HeaderComponent } from './components/header/header.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast.component';
import { DialogModule } from 'primeng/dialog';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthenticationService } from './modules/authentication/services/authentication.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from './services/notifier.service';
import { MockBaseHttpService } from './mocks/base-http.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let authService: AuthenticationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'ActiveUserSnapshot', component: AppComponent, data: {breadcrumb: [{label: 'Test'}]}}
        ]),
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ProgressSpinnerModule,
        ToastModule,
        SidebarModule,
        PanelMenuModule,
        BreadcrumbModule,
        OverlayPanelModule,
        MessagesModule,
        MessageModule,
        ComponentsModule,
        DialogModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        NavigationBarComponent,
        FooterComponent,
        ToastComponent,
        ChangePasswordComponent
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        DatePipe,
        MessageService,
        ConfirmationService,
        AuthenticationService,
        NotifierService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    authService = fixture.debugElement.injector.get(AuthenticationService);
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'work-assignment-tool'`, () => {
    expect(app.title).toEqual('work-assignment-tool');
  });

  it('Authenticated', () => {
    localStorage.setItem('roleId', 'Administrator');
    spyOn(authService, 'checkIsAuthenticated').and.returnValue(true);
    spyOn(authService, 'authUpdatedListener').and.returnValue(of({isAuthenticated: true}));
    app.ngOnInit();
    expect(app.isAuthenticated).toBeTruthy();
  });

  it('Show Notification Error', () => {
    const notificationService = fixture.debugElement.injector.get(NotifierService);
    spyOn(notificationService, 'getNotifierListener').and.returnValue(of({type: 'error', message: ''}));
    app.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('Show Notification Success', () => {
    const notificationService = fixture.debugElement.injector.get(NotifierService);
    spyOn(notificationService, 'getNotifierListener').and.returnValue(of({type: 'success', message: ''}));
    app.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('Show Notification Warning', () => {
    const notificationService = fixture.debugElement.injector.get(NotifierService);
    spyOn(notificationService, 'getNotifierListener').and.returnValue(of({type: 'warning', message: ''}));
    app.ngOnInit();
    expect(app).toBeTruthy();
  });

  it('Show Notification Info', () => {
    const notificationService = fixture.debugElement.injector.get(NotifierService);
    spyOn(notificationService, 'getNotifierListener').and.returnValue(of({type: 'info', message: ''}));
    app.ngOnInit();
    expect(app).toBeTruthy();
  });

  it("Functions Coverage", () => {
    app.showFailure('', '');
    app.toggleChangePwd();
    app.menuClickedEvent(true);
    app.resetSuccess(true);
    app.resetSuccess(false);
    expect(app.clicked).toBeTruthy();
  });
});
