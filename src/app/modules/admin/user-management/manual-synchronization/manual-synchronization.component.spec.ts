import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  tick,
  fakeAsync
} from "@angular/core/testing";
import { NotifierService } from "src/app/services/notifier.service";
import { ManualSynchronizationComponent } from "./manual-synchronization.component";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { ButtonModule } from "primeng/button";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { TooltipModule } from "primeng/tooltip";
import { CardModule } from "primeng/card";
import { MessageService, ConfirmationService } from "primeng/api";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import {
  HttpTestingController
} from "@angular/common/http/testing";
import { HttpRequest } from "@angular/common/http";
import { throwError, of } from "rxjs";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";
describe("Manual Sync", () => {
  let component: ManualSynchronizationComponent;
  let fixture: ComponentFixture<ManualSynchronizationComponent>;

  let injector: TestBed;
  let service: TaskmanagementService;
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManualSynchronizationComponent],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MessageModule,
        ProgressSpinnerModule,
        TooltipModule,
        CardModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        {provide: BaseHttpService, useClass: MockBaseHttpService},
        ConfirmationService,
        TaskmanagementService
      ]
    }).compileComponents();
    injector = getTestBed();
    service = injector.get(TaskmanagementService);
    httpMock = injector.get(HttpTestingController);
  }));
  afterEach(() => {
    httpMock.verify();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSynchronizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /* it("should get refreshed data from service", fakeAsync(() => {
    const res = { id: 4 };
    localStorage.setItem("user-details", JSON.stringify(res));
    const results = { data: [] };

    service.refreshClaimWorkBasket().subscribe(_ => expect(results).toBe(_));

    const req = httpMock.expectOne((request: HttpRequest<any>): boolean => {
      expect(request.url).toEqual(
        "http://localhost:8081/api/data-load/claims "
      );
      expect(request.method).toBe("POST");
      return true;
    });
    req.flush(results);
    tick();
  })); */

  it("should call service on refresh and return success if refreshed and stop progress spinner", () => {
    const res = { id: 4 };
    localStorage.setItem("user-details", JSON.stringify(res));
    const servSpy = spyOn(service, "refreshClaimWorkBasket").and.returnValue(
      of({ status: "Success" })
    );
    fixture.detectChanges();
    component.refresh();
    expect(servSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
  });

  it("should call service on refresh and return failure if failed and stop progress spinner", () => {
    const res = { id: 4 };
    localStorage.setItem("user-details", JSON.stringify(res));
    const servSpy = spyOn(service, "refreshClaimWorkBasket").and.returnValue(
      of({status: "Failure"})
    );
    fixture.detectChanges();
    component.refresh();
    expect(servSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
  });

  it("should return null in case of error", () => {
    const res = { id: 4 };
    localStorage.setItem("user-details", JSON.stringify(res));
    const servSpy = spyOn(service, "refreshClaimWorkBasket").and.returnValue(
      throwError({ status: 400 })
    );
    fixture.detectChanges();
    component.refresh();
    expect(servSpy).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
  });
});
