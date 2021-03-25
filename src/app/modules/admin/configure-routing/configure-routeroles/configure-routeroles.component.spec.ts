import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifierService } from "src/app/services/notifier.service";
import { ConfigureRouterolesComponent } from './configure-routeroles.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { routeRoleList, roleList, routeArrayList } from 'src/app/mocks/mock-data';
import { of } from 'rxjs';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';

class MockTaskMgtService extends TaskmanagementService {
  getRolesToRoute() {
    const roleArray: any = routeRoleList;
    this.rolesToRouteSub.next(roleArray);
  }
  getRoutedRoles() {
    const roleArray: any = routeArrayList;
    this.routeReasonsSub.next(roleArray);
  }
}

describe('ConfigureRouterolesComponent', () => {
  let component: ConfigureRouterolesComponent;
  let fixture: ComponentFixture<ConfigureRouterolesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureRouterolesComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        DialogModule,
        ConfirmDialogModule,
        DropdownModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        CardModule,
        HttpClientTestingModule,
      ],
      providers: [
        MessageService,
        ConfirmationService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: TaskmanagementService, useClass: MockTaskMgtService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureRouterolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("should set and set values", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigureRouterolesComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should map route roles and set route roles if present", () => {
      component.routeRoleList = [];
      component.routedRoleList = roleList;
      fixture.detectChanges();
      component.mapRoutedRoles();
      expect(component.isRouteRolePresent).toBeTruthy();
    });
    it("should map route roles and not set route roles if not present", () => {
      component.routeRoleList = [];
      component.routedRoleList = [];
      fixture.detectChanges();
      component.mapRoutedRoles();
      expect(component.isRouteRolePresent).toBeFalsy();
    });
    it("should set data as empty when role status is not present", () => {
      component.routeRoleList = [];
      component.routedRoleList = [];
      fixture.detectChanges();
      component.mapRoutedRoles();
      expect(component.routeRoleList.length).toEqual(0);
    });
    it("should set data when role status is present", () => {
      component.routeRoleList = [];
      component.routedRoleList = roleList;
      fixture.detectChanges();
      component.mapRoutedRoles();
      expect(component.routeRoleList.length).toBeGreaterThan(0);
    });
    it("should map roles and set data when role routing is not enabled", () => {
      component.routeFromRoleList = [];
      component.routeToRoleList = [];
      fixture.detectChanges();
      component.mapRoles();
      expect(component.routeFromRoleList.length).toEqual(0);
      expect(component.routeToRoleList.length).toEqual(0);
    });
    it("should set data when role routing enabled", () => {
      component.roleList = routeRoleList.roles;
      component.routeFromRoleList = [];
      component.routeToRoleList = [];
      fixture.detectChanges();
      component.mapRoles();
      expect(component.routeFromRoleList.length).toBeGreaterThan(0);
      expect(component.routeToRoleList.length).toBeGreaterThan(0);
    });

    it("should get table fields", () => {
      component.cols = [];
      fixture.detectChanges();
      component.getTableColumns();
      expect(component.cols.length).toBeGreaterThan(0);
    });
    it("should delete row when a row is selected", () => {
      const routeRoleTable = jasmine.createSpyObj('routeRoleTable', ['reset']);
      component.routeRoleTable = routeRoleTable;
      component.selectedRoles = roleList;
      const saveSpy = spyOn(service, 'saveRouteRole').and.callFake(() => console.log('service call fake'));
      // const compSpy = spyOn(component, 'routeRole').and.callFake(() => console.log('service call fake'));
      spyOn(service, 'getRoutedRolesListner').and.returnValue(of({
        routingOptionDtos: [
          {
            routeFrom: new Date(),
            routeTo: new Date(),
            routeStatus: false
          }
        ]
      }));
      fixture.detectChanges();
      roleList.forEach(e => component.deleteRow(e));
      // component.deleteRow();
      expect(saveSpy).toHaveBeenCalled();
      // expect(compSpy).toHaveBeenCalled();
      expect(component.selectedRoles.length).toEqual(2);
    });
    /* it("should not delete row when a row is not selected", () => {
      const routeRoleTable = jasmine.createSpyObj('routeRoleTable', ['reset']);
      component.routeRoleTable = routeRoleTable;
      component.selectedRoles = [];
      const saveSpy = spyOn(service, 'saveRouteRole').and.callFake(() => console.log('service call fake'));
      fixture.detectChanges();
      component.deleteRow();
      expect(saveSpy).not.toHaveBeenCalled();
    }); */
    it("should get role names for the role id when roleid is present", () => {
      component.roleList = routeRoleList.roles;
      component.selectedRoles = [];
      fixture.detectChanges();
      const roleName = component.getRoleName("1");
      expect(roleName).toEqual("Claims Lead");
    });
    it("should set role names as empty when roleid is undefined", () => {
      component.roleList = undefined;
      component.selectedRoles = [];
      fixture.detectChanges();
      const roleName = component.getRoleName("1");
      expect(roleName).toEqual(undefined);
    });
    it("should set role names as empty when roleid is empty", () => {
      component.roleList = [];
      component.selectedRoles = [];
      fixture.detectChanges();
      const roleName = component.getRoleName("1");
      expect(roleName).toEqual(undefined);
    });
  });

  describe("should fetch data from service and save data to service", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigureRouterolesComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should get roles data from service", () => {
      component.routeRoleList = roleList;
      const servSpy = spyOn(service, 'getRolesToRoute').and.callFake(() => console.log('service call fake'));
      spyOn(service, 'getRolesToRouteListner').and.returnValue(of({
        roles: [
          {
            isRoutingEnabled: false,
            id: 1,
            roleName: 'test'
          }
        ]
      }));
      fixture.detectChanges();
      component.getRoles();
      expect(component.roleList.length).toEqual(1);
      expect(servSpy).toHaveBeenCalled();
    });
    it("should get route data from service", () => {
      component.routeRoleList = roleList;
      const servSpy = spyOn(service, 'getRoutedRoles').and.callFake(() => console.log('service call fake'));
      spyOn(service, 'getRoutedRolesListner').and.returnValue(of([]));
      fixture.detectChanges();
      component.getRoutedRoles();
      expect(servSpy).toHaveBeenCalled();
    });
    it("should add route data to service", () => {
      component.routeRoleList = roleList;
      component.selectedRoles = roleList;
      const routeRoleTable = jasmine.createSpyObj('routeRoleTable', ['reset']);
      component.routeRoleTable = routeRoleTable;
      component.routeRoleGroup.get("routeFromRole").setValue("Claims Examiner");
      component.routeRoleGroup.get("routeToRole").setValue("Claims Examiner");
      const servSpy = spyOn(service, 'saveRouteRole').and.callFake(() => console.log('service call fake'));
      spyOn(component, 'validateRoles').and.returnValue(true);
      fixture.detectChanges();
      component.addRouteRole();
      expect(servSpy).toHaveBeenCalled();
      expect(component.selectedRoles.length).toEqual(0);
    });
    it("should not add route data to service when invalid values are present", () => {
      component.routeRoleList = roleList;
      component.selectedRoles = roleList;
      const routeRoleTable = jasmine.createSpyObj('routeRoleTable', ['reset']);
      component.routeRoleTable = routeRoleTable;
      component.routeRoleGroup.get("routeFromRole").setValue("");
      component.routeRoleGroup.get("routeToRole").setValue("");
      spyOn(component, 'validateRoles');
      const servSpy = spyOn(service, 'saveRouteRole').and.callFake(() => console.log('service call fake'));
      fixture.detectChanges();
      component.addRouteRole();
      expect(servSpy).not.toHaveBeenCalled();
    });
  });

  describe("should validate pend reasons", () => {
    let service;
    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigureRouterolesComponent);
      service = fixture.debugElement.injector.get(TaskmanagementService);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should check for duplicate roles in the list and set validity to false if duplicate not present", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkDuplicates("Claims Examiner", "Claims Lead");
      expect(isValid).toEqual(false);
    });
    it("should check for duplicate roles in the list and set validity to true if duplicate present", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkDuplicates("Claims Lead", "Manager");
      expect(isValid).toEqual(true);
    });
    it("should set validity to true when role is selected", () => {
      const isValid = component.checkIfEmptyOrNull("Claims Lead");
      expect(isValid).toEqual(true);
    });
    it("should set validity to false when role is null", () => {
      const isValid = component.checkIfEmptyOrNull(null);
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when role is empty", () => {
      const isValid = component.checkIfEmptyOrNull("");
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when routed from examiner to manager", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkIfValid("Claims Examiner", "Manager");
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when routed from Claims Lead to Claims Lead", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkIfValid("Claims Lead", "Claims Lead");
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when routed from Manager to Manager", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkIfValid("Manager", "Manager");
      expect(isValid).toEqual(false);
    });
    it("should set validity to true for others", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.checkIfValid("Manager", "Claims Examiner");
      expect(isValid).toEqual(true);
    });

    it("should set validity to false when duplicate roles are added", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.validateRoles("Claims Lead", "Claims Examiner");
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when from role is empty", () => {
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.validateRoles("", "Claims Examiner");
      expect(isValid).toEqual(false);
    });
    it("should set validity to false when to role is empty", () => {
      component.routeRoleGroup.get("routeFromRole").setValue("Manager");
      component.routeRoleGroup.get("routeToRole").setValue("");
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.validateRoles("Manager", "");
      expect(isValid).toEqual(false);
    });
    it("should set validity to true when invalidity is false", () => {
      component.routeRoleGroup.get("routeFromRole").setValue("Manager");
      component.routeRoleGroup.get("routeToRole").setValue("Manager");
      component.routeRoleList = roleList;
      fixture.detectChanges();
      const isValid = component.validateRoles("Manager", "Manager");
      expect(isValid).toEqual(true);
    });
    it("should set validity to true when otherwise all validations are passed", () => {
      component.routeRoleGroup.get("routeFromRole").setValue("Manager");
      component.routeRoleList = roleList;
      component.routeRoleGroup.get("routeToRole").setValue("Claims Examiner");
      fixture.detectChanges();
      const isValid = component.validateRoles("Manager", "Claims Examiner");
      expect(isValid).toEqual(true);
    });
  });
});
