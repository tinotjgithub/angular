import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditRoutedInDetailComponent } from './audit-routed-in-detail.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { AuditClaimRoutingService } from '../../services/audit-claim-routing.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/config/config.service';
import { APP_INITIALIZER } from '@angular/core';
import { loadConfigServiceTest } from 'src/app/services/auditor/auditor.service.spec';

describe('AuditRoutedInDetailComponent', () => {
  let component: AuditRoutedInDetailComponent;
  let fixture: ComponentFixture<AuditRoutedInDetailComponent>;
  let service: AuditClaimRoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuditRoutedInDetailComponent],
      imports: [
        TableModule,
        DropdownModule,
        ConfirmDialogModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        AppConfigService,        
        { provide: APP_INITIALIZER, useFactory: loadConfigServiceTest , deps: [AppConfigService], multi: true },
        ConfirmationService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRoutedInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(AuditClaimRoutingService);
  });

  it('should create', () => {
    spyOn(service, 'getManagerLeadRouteReasons').and.returnValue(of([]).subscribe());
    spyOn(service, 'getRoutedInList').and.returnValue(of([]).subscribe());
    spyOn(service, 'getManagerLeadRouteReasonsListner').and.returnValue(of(''));
    spyOn(service, 'routedInClaimListListener').and.returnValue(of([]));
    expect(component).toBeTruthy();
  });

  it('manager lead route reason', () => {
    spyOn(service, 'getManagerLeadRouteReasons').and.returnValue(of([]).subscribe());
    spyOn(service, 'getRoutedInList').and.returnValue(of([]).subscribe());
    spyOn(service, 'getManagerLeadRouteReasonsListner').and.returnValue(of([
        {
            routeReason: 'test'
        }
    ]));
    spyOn(service, 'routedInClaimListListener').and.returnValue(of([]));
    component.getManagerRouteReasons();
    expect(component.routeReasonList.length).toEqual(1);
  });

  it('MapReason', () => {
    component.routeReasonList = null;
    component.mapRouteReasons();
    expect(component.routeReasonOptions.length > 0).toBeTruthy();
  });

  it('table filter', () => {
    const claimsTable = jasmine.createSpyObj("claimsTable", ["filter"]);
    component.claimsTable = claimsTable;
    component.tableFilter(claimsTable, '', 'field', '');
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyNavigate = spyOn(router, 'navigate');
    component.onRowEditInit('');
    expect(spyNavigate).toHaveBeenCalled();
  });
});
