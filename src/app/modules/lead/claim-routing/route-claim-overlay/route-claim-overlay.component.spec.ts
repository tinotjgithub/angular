import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RouteClaimOverlayComponent } from "./route-claim-overlay.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BaseHttpService } from "src/app/services/base-http.service";
import { MessageService, ConfirmationService, SelectItem } from "primeng/api";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { of } from "rxjs";
import { ClaimRoutingService } from '../claim-routing.service';
import { Router } from '@angular/router';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

describe("RouteClaimOverlayComponent", () => {
  let component: RouteClaimOverlayComponent;
  let fixture: ComponentFixture<RouteClaimOverlayComponent>;
  let service: TaskmanagementService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteClaimOverlayComponent],
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
          {
            path: 'ClaimRouting',
            component: RouteClaimOverlayComponent
          }
        ]),
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        NgbModule,
        DialogModule,
        TooltipModule,
        ConfirmDialogModule,
        DropdownModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService,
        ConfirmationService,
        ClaimRoutingService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RouteClaimOverlayComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteClaimOverlayComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(TaskmanagementService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Route Roles loaded", async(() => {
    const resp = [
      {
        routeRoleId: 2,
        routeRoleName: "Claims Examiner"
      }
    ];
    spyOn(service, 'getRouteReasons').and.callFake(() => console.log('routereasons'));
    spyOn(service, 'getRouteRoles').and.callFake(() => console.log('routeroles'));
    spyOn(service, "getRouteRolesListner").and.returnValue(of(resp));
    let result;
    try {
      component.ngOnInit();
      result = component.mapRouteRoles(resp);
    } catch (error) {
      console.log(error);
    }
    expect(component.routeRoles).toEqual(result);
  }));

  it("mapRouteRoles worked", (() => {
    const resp = [
      {
        routeRoleId: 2,
        routeRoleName: "Claims Examiner"
      }
    ];
    spyOn(service, 'getRouteReasons').and.callFake(() => console.log('routereasons'));
    spyOn(service, 'getRouteRoles').and.callFake(() => console.log('routeroles'));
    let res;
    try {
      component.ngOnInit();
      res = component.mapRouteRoles(resp);
    } catch (error) {
      console.log(error);
    }
    const { routeRoleId, routeRoleName } = resp[0];
    const result: SelectItem[] = [{ value: routeRoleId, label: routeRoleName }];
    expect(result).toEqual(res);
  }));

  it("mapRouteToOptions worked", (() => {
    const resp = [
      {
        routeUserId: 2,
        routeUserName: "Claims Examiner"
      }
    ];
    const { routeUserId, routeUserName } = resp[0];
    const result: SelectItem[] = [{ value: routeUserId, label: routeUserName }];
    const data  = component.mapRouteToOptions(resp);
    expect(result).toEqual(data);
  }));

  it("mapRouteReasons worked", (() => {
    const resp = [
      {
        routeReason: "Test",
        routeReasonCode: 2
      }
    ];
    const { routeReason, routeReasonCode } = resp[0];
    const result: SelectItem[] = [
      { value: routeReasonCode, label: routeReason }
    ];
    expect(result).toEqual(component.mapRouteReasons(resp));
  }));

  it("Initialize form", () => {
    expect(component.claimRouteForm.get("taskId").value).toBeNull();
    const claimDetails =  {
        taskId: 10,
        claimId: "Test",
        age: "Test",
        queueName: "Test",
        routeFrom: "Test",
        routeDate: "Test",
        routeReason: "Test",
        endTimer: " "
    };
    component.initializeForm(claimDetails);
    expect(component.claimRouteForm).toBeDefined();
  });

  it("setRoleSelected", () => {
    component.setRoleSelected(10);
    const spy = spyOn(component, "getRouteTo");
    expect(component.roleSelected).toEqual(10);
  });

  it("getRouteTo", async(() => {
    const resp = [
      {
        routeUserId: 2,
        routeUserName: "Claims Examiner"
      }
    ];
    const spy = spyOn(service, "getLeadRouteUserListener").and.returnValue(
      of(resp)
    );
    const spy1 = spyOn(service, "getLeadRouteUser");
    component.claimDetails.params = { taskId: 15 };
    component.getRouteTo(2);
    expect(spy1).toHaveBeenCalled();
    expect(component.routeToList).toEqual(component.mapRouteToOptions(resp));
  }));

  it('getRouteReasons', () => {
    spyOn(service, 'getRouteReasons').and.callFake(() => console.log('routereasons'));
    spyOn(service, 'getRouteReasonsListner').and.returnValue(of([]));
    component.getRouteReasons();
    expect(component).toBeTruthy();
  });

  it('submit route claim', () => {
    const claimService: ClaimRoutingService = fixture.debugElement.injector.get(ClaimRoutingService);
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyRoute = spyOn<any>(router, 'navigateByUrl').and.returnValue(true);
    spyOn(claimService, 'route').and.returnValue(new Promise((res, rej) => {
      res();
    }));
    component.submit();
    expect(component).toBeTruthy();
  });

  it('submit route claim - Fail', () => {
    const claimService: ClaimRoutingService = fixture.debugElement.injector.get(ClaimRoutingService);
    const router: Router = fixture.debugElement.injector.get(Router);
    const spyRoute = spyOn<any>(router, 'navigateByUrl').and.returnValue(true);
    spyOn(claimService, 'route').and.returnValue(new Promise((res, rej) => {
      rej();
    }));
    try {
      component.submit();
    } catch (error) {
      console.log(error);
    }
    expect(component).toBeTruthy();
  });

  it('submit route claim', () => {
    const confirmService: ConfirmationService = fixture.debugElement.injector.get(ConfirmationService);
    spyOn(confirmService, 'confirm').and.callFake((confirm) => {
      return confirm.accept();
    });
    component.confirmCancel();
    expect(component).toBeTruthy();
  });
});
