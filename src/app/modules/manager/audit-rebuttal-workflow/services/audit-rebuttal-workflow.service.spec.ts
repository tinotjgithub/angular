import { TestBed } from "@angular/core/testing";
import { AuditRebuttalWorkflowService } from "./audit-rebuttal-workflow.service";
import { BaseHttpService } from "src/app/services/base-http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("AuditRebuttalWorkflowService", () => {
  let service: AuditRebuttalWorkflowService;
  let http: BaseHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [BaseHttpService]
    });
    service = TestBed.get(AuditRebuttalWorkflowService);
    http = TestBed.get(BaseHttpService);
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getSavedWorkFlowConfig", () => {
    expect(service.getSavedWorkFlowConfig()).toBeTruthy();
  });

  it("saveWorkFlowConfig", () => {
    expect(service.saveWorkFlowConfig(1)).toBeTruthy();
  });
});
