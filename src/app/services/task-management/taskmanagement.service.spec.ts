import { TestBed } from "@angular/core/testing";

import { TaskmanagementService } from "./taskmanagement.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BaseHttpService } from "../base-http.service";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { DrawClaim } from "./models/DrawClaim";
import { MockBaseHttpService } from "src/app/mocks/base-http.mock";

describe("TaskmanagementService", () => {
  let http: BaseHttpService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TaskmanagementService,
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        MessageService
      ]
    })
  );

  beforeEach(() => {
    http = TestBed.get(BaseHttpService);
  });

  it("should be created", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    service.getDiffDays(new Date(), new Date());
    expect(service).toBeTruthy();
  });

  describe("Timer functionality", () => {
    let service: TaskmanagementService;
    beforeEach(() => {
      service = TestBed.get(TaskmanagementService);
    });

    it("Start Timer", () => {
      service.claimDetails = {
        claimId: null,
        claimFactKey: 0,
        taskId: 0,
        claimReceivedDate: null,
        age: 0,
        status: "",
        queueName: "",
        endTimer: "",
        pendReason: "",
        comments: "",
        routeReason: "",
        firstPendDate: null,
        lastPendDate: null
      };
      service.startTimer();
      expect(service.interval).toBeTruthy();
      service.pauseTimer();
      expect(service.pauseValue).toBeTruthy();
    });

    it("set time color conditions - greater than one minute", () => {
      const time = service.splitTimer("01:01:30");
      spyOn(service, "splitTimer").and.returnValue(time);
      service.resetTaskTimer();
      expect(service.timerColor).toEqual("#FF0000");
    });

    it("set time color conditions - between 20 and 30 seconds", () => {
      const time = service.splitTimer("00:00:25");
      spyOn(service, "splitTimer").and.returnValue(time);
      service.resetTaskTimer();
      expect(service.timerColor).toEqual("#FFBF00");
      expect(service.timerFadeColorValue).toEqual("#00b0b621");
    });

    it("set time color conditions - greater than 30 seconds", () => {
      const time = service.splitTimer("00:00:35");
      spyOn(service, "splitTimer").and.returnValue(time);
      service.resetTaskTimer();
      expect(service.timerColorValue).toEqual("#FF0000");
    });
  });

  it("should get the claim detail", () => {
    spyOn(http, "get").and.returnValue(
      of({
        claimId: 123,
        claimFactKey: 0,
        taskId: 0,
        claimReceivedDate: null,
        age: 0,
        status: "",
        queueName: "",
        endTimer: "",
        pendReason: "",
        comments: "",
        routeReason: "",
        firstPendDate: null,
        lastPendDate: null
      })
    );
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    service.getClaim(null, "Pended");
    expect(service.claimDetails).toBeTruthy();
    let value: DrawClaim;
    service.getClaimDetailsListener().subscribe(val => (value = val));
    service.getClaim(123, null);
    expect(service.claimDetails).toBeTruthy();
    expect(value.endTimer).toEqual("");
  });

  it("should get the claim detail with undefined claim id", () => {
    spyOn(http, "get").and.returnValue(
      of({
        claimId: null,
        claimFactKey: 0,
        taskId: 0,
        claimReceivedDate: null,
        age: 0,
        status: "",
        queueName: "",
        endTimer: "",
        pendReason: "",
        comments: "",
        routeReason: "",
        firstPendDate: null,
        lastPendDate: null
      })
    );
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    service.getClaim(null, "Pended");
    expect(service.claimDetails).toBeTruthy();
    service.getClaim(123, null);
    expect(service.claimDetails).toBeTruthy();
  });

  it("should get route roles", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getRouteRolesListner().subscribe(val => (value = val));
    service.getRouteRoles();
    expect(value).toEqual([]);
  });

  it("should handle the error on route roles", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getRouteRoles();
    expect(service.routeRoleResponse).toEqual([]);
  });

  it("should get roles to route", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getRolesToRouteListner().subscribe(val => (value = val));
    service.getRolesToRoute();
    expect(value).toEqual([]);
  });

  it("should handle the error on route roles", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getRolesToRoute();
    expect(service.rolesToRouteResponse).toEqual([]);
  });

  it("should get manager queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getManagerQueueNamesListner().subscribe(val => (value = val));
    service.getManagerQueueNames(1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getManagerQueueNames(1);
    expect(service.managerQueueNamesResponse).toEqual([]);
  });

  it("should get lead queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLeadQueueNamesListner().subscribe(val => (value = val));
    service.getLeadQueueNames(1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadQueueNames(1);
    expect(service.leadQueueNamesResponse).toEqual([]);
  });

  it("should get lead status", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLeadStatusesListner().subscribe(val => (value = val));
    service.getLeadStatuses(1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead status", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadStatuses(1);
    expect(service.leadStatusesResponse).toEqual([]);
  });

  it("should get lead names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLeadNamesListner().subscribe(val => (value = val));
    service.getLeadNames(1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadNames(1);
    expect(service.leadNamesResponse).toBeUndefined();
  });

  it("should get queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getManagerQueuesListner().subscribe(val => (value = val));
    service.getManagerQueues();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting queue names", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getManagerQueues();
    expect(service.queueNamesResponse).toBeUndefined();
  });

  it("should get user target", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getUserTargetListner().subscribe(val => (value = val));
    service.getUserTarget();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting user target", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getUserTarget();
    expect(service.userTargetResponse).toEqual([]);
  });

  it("should get SLA configuration", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getSLAConfigListner().subscribe(val => (value = val));
    service.getSLAConfig();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting SLA configuration", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getSLAConfig();
    expect(service.slaConfigResponse).toEqual([]);
  });

  it("should get Inventory Claims", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getInventoryClaimsListner().subscribe(val => (value = val));
    service.getInventoryClaims("test", "test");
    expect(value).toBeUndefined();
  });

  it("should handle the error on getting Inventory Claims", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getInventoryClaims("test", "test");
    expect(service.inventoryClaimsResponse).toBeUndefined();
  });

  it("should get Lead Claims Examinerss", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLeadClaimsExaminersListner().subscribe(val => (value = val));
    service.getLeadClaimsExaminers("123");
    expect(value).toBeUndefined();
  });

  it("should handle the error on getting Lead Claims Examiners", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadClaimsExaminers("123");
    expect(service.leadClaimsExaminersResponse).toBeUndefined();
  });

  it("should get Lead User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLeadUserGroupsListner().subscribe(val => (value = val));
    service.getLeadUserGroups("123");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Lead User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadUserGroups("123");
    expect(service.leadUserGroupsResponse).toEqual([]);
  });

  it("should get Manager Queues", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getManagerQueuesListner().subscribe(val => (value = val));
    service.getManagerQueues();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Manager Queues", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getManagerQueues();
    expect(service.queueNamesResponse).toBeUndefined();
  });

  it("should get ReAssigned Route Reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getReAssignedRouteReasonsListner().subscribe(val => (value = val));
    service.getReAssignedRouteReasons();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting ReAssigned Route Reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getReAssignedRouteReasons();
    expect(service.reassignedRouteReasonResponse).toEqual([]);
  });

  it("should get Manager User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getManagerUserGroupsListner().subscribe(val => (value = val));
    service.getManagerUserGroups("123");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Manage User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getManagerUserGroups("123");
    expect(service.managerUserGroupsResponse).toEqual([]);
  });

  it("should get status", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getStatusListner().subscribe(val => (value = val));
    service.getStatus();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting status", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getStatus();
    expect(service.statusResponse).toEqual([]);
  });

  it("should get Lead Examiner Pass Fail Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service
      .getLeadExaminerPassFailScoresListner()
      .subscribe(val => (value = val));
    service.getLeadExaminerPassFailScores("test", "test", "test", "test");
    expect(value).toBeUndefined();
  });

  it("should handle the error on getting Lead Examiner Pass Fail Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLeadExaminerPassFailScores("test", "test", "test", "test");
    expect(service.leadExaminerPassFailScoreResponse).toBeUndefined();
  });
  it("should get Claims Threashold", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getClaimsThreasholdListner().subscribe(val => (value = val));
    service.getClaimsThreashold("test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Claims Threashold", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getClaimsThreashold("test");
    expect(service.claimsThreasholdResponse).toEqual([]);
  });

  it("should get Claims Open Inventory", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getClaimsOpenInventoryListner().subscribe(val => (value = val));
    service.getClaimsOpenInventory("test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Claims Open Inventory", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getClaimsOpenInventory("test");
    expect(service.claimsOpenInvResponse).toEqual([]);
  });

  it("should get Lead Team Productivity Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getLeadTeamProdScoresListner().subscribe(val => (value = val));
    service.getLeadTeamProdScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting Lead Team Productivity Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getLeadTeamProdScores("test", "test");
    expect(service.leadTeamProdScoreResponse).toEqual([]);
  });

  it("should get routed roles", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getRoutedRolesListner().subscribe(val => (value = val));
    service.getRoutedRoles();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting routed roles", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getRoutedRoles();
    expect(service.routedRoleResponse).toEqual([]);
  });

  it("should get Low Performing Examiners", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getLowPerExaminersListner().subscribe(val => (value = val));
    service.getLowPerExaminers("test", "test", "test");
    expect(value).toBeUndefined();
  });

  it("should handle the error on getting Low Performing Examiners", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getLowPerExaminers("test", "test", "test");
    expect(service.lowPerExaminersResponse).toBeUndefined();
  });

  it("should get upload File Users", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getUserReportListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.uploadFileUsers(formData);
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting upload File Users", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.uploadFileUsers(formData);
    expect(service.userUploadResponse).toEqual({ body: "success" });
  });

  it("should get upload template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.userUploadTemplateListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.userUploadTemplate();
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting upload template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.userUploadTemplate();
    expect(service.userUploadTemplateResponse).toEqual({ body: "success" });
  });

  it("should get upload user Group template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.userGrpUploadTemplateListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.userGrpUploadTemplate();
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting user Group Upload Template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.userGrpUploadTemplate();
    expect(service.userGrpUploadTemplateResponse).toEqual({ body: "success" });
  });

  it("should get upload File Reason Template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.uploadFileReasonTemplateListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.uploadFileReasonTemplate();
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting upload File Reason Template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.uploadFileReasonTemplate();
    expect(service.uploadFileReasonTemplateResponse).toEqual({
      body: "success"
    });
  });

  it("should get upload File Reason", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getReasonReportListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.uploadFileReason(formData);
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting upload File Reason Template", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.uploadFileReason(formData);
    expect(service.reasonUploadResponse).toEqual({ body: "success" });
  });

  it("should get upload File User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getUserGrpReportListner().subscribe(val => (value = val));
    const formData = new FormData();
    service.uploadFileUserGroups(formData);
    expect(value).toEqual({ body: "success" });
  });

  it("should handle the error on getting upload File User Groups", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    const formData = new FormData();
    service.uploadFileUserGroups(formData);
    expect(service.userGrpUploadResponse).toEqual({ body: "success" });
  });

  // uploadFileReason

  it("should get route reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getRouteReasonsListner().subscribe(val => (value = val));
    service.getRouteReasons();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting route reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getRouteReasons();
    expect(service.routeReasonResponse).toEqual([]);
  });

  it("should get route user", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getRouteUserListener().subscribe(val => (value = val));
    service.getRouteUser(1, 2);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting route users", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getRouteUser(1, 2);
    expect(service.routeUserResponse).toEqual([]);
  });

  it("should get lead route user", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getLeadRouteUserListener().subscribe(val => (value = val));
    service.getLeadRouteUser(1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead route users", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getLeadRouteUser(1);
    expect(service.routeUserResponse).toEqual([]);
  });

  it("should get pend reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getPendReasonsListner().subscribe(val => (value = val));
    service.getPendReasons();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting pend reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getPendReasons();
    expect(service.pendReasonResponse).toEqual([]);
  });

  it("should get pend reasons config", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getPendReasonsConfigListner().subscribe(val => (value = val));
    service.getPendReasonsConfig();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting pend reasons config", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getPendReasonsConfig();
    expect(service.pendReasonConfigResponse).toEqual([]);
  });

  it("should get route reasons config", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getRouteReasonsConfigListner().subscribe(val => (value = val));
    service.getRouteReasonsConfig();
    expect(value).toEqual([]);
  });

  it("should handle the error on getting route reasons config", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getRouteReasonsConfig();
    expect(service.routeReasonConfigResponse).toEqual([]);
  });

  it("should get claim lists", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getClaimListListner().subscribe(val => (value = val));
    service.getClaimList("test");
    expect(value).toBeUndefined();
  });

  it("should handle the error on getting claim list", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getClaimList("test");
    expect(service.claimListResponse).toBeUndefined();
  });

  it("should get productivity scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getMyProdScoresListner().subscribe(val => (value = val));
    service.getMyProdScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting productivity scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getMyProdScores("test", "test");
    expect(service.myprodScoreResponse).toEqual([]);
  });

  it("should get financial scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getMyFinScoresListner().subscribe(val => (value = val));
    service.getMyFinScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting financial scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getMyFinScores("test", "test");
    expect(service.myfinScoreResponse).toEqual([]);
  });

  it("should get manager/lead financial scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerFinScoresListner().subscribe(val => (value = val));
    service.getManagerFinScores("2020-06-16", "2020-06-23", 1, 2);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager/lead financial scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerFinScores("2020-06-16", "2020-06-23", 1, 2);
    expect(service.managerFinScoreResponse).toEqual([]);
  });

  it("should handle the error on getting manager/lead procedural scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerProcScores("2020-06-16", "2020-06-23", 1, 2);
    expect(service.managerProcScoreResponse).toEqual([]);
  });

  it("should get manager/lead procedural scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerProcScoresListner().subscribe(val => (value = val));
    service.getManagerProcScores("2020-06-16", "2020-06-23", 1, 2);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager Team Productivity Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getMyTeamProdScores("2020-06-16", "2020-06-23");
    expect(service.myTeamProdScoreResponse).toEqual([]);
  });

  it("should get manager/lead procedural scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getMyTeamProdScoresListner().subscribe(val => (value = val));
    service.getMyTeamProdScores("2020-06-16", "2020-06-23");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager/lead processed vs audited scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerProcessedScores("2020-06-16", "2020-06-23", 1);
    expect(service.processedScoreResponse).toEqual([]);
  });

  it("should get manager/lead processed vs audited scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerProcessedScoresListner().subscribe(val => (value = val));
    service.getManagerProcessedScores("2020-06-16", "2020-06-23", 1);
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager/lead Audit Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerAuditScores("2020-06-16", "2020-06-23", 1);
    expect(service.managerAuditScoreResponse).toEqual([]);
  });

  it("should get manager/lead Audit Scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerAuditScoresListner().subscribe(val => (value = val));
    service.getManagerAuditScores("2020-06-16", "2020-06-23", 1);
    expect(value).toEqual([]);
  });

  it("should get procedural scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getMyProcScoresListner().subscribe(val => (value = val));
    service.getMyProcScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting procedural scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getMyProcScores("test", "test");
    expect(service.myprocScoreResponse).toEqual([]);
  });

  it("should get quality scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getAuditScoresListner().subscribe(val => (value = val));
    service.getAuditScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting quality scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getAuditScores("test", "test");
    expect(service.auditScoreResponse).toEqual([]);
  });

  it("should get status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getStatusScoresListner().subscribe(val => (value = val));
    service.getStatusScores("test", "test");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getStatusScores("test", "test");
    expect(service.statusScoreResponse).toEqual([]);
  });

  it("should get examiner count", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getExaminerCountListner().subscribe(val => (value = val));
    service.getExaminerCount("test", "test", "Status");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting examiners count", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getExaminerCount("test", "test", "Status");
    expect(service.examinerCountResponse).toEqual([]);
  });

  it("should get manager status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerStatusScoresListner().subscribe(val => (value = val));
    service.getManagerStatusScores("test", "test", "Status");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting manager status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerStatusScores("test", "test", "Status");
    expect(service.managerStatusScoreResponse).toEqual([]);
  });

  it("should get lead status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getLeadStatusScoresListner().subscribe(val => (value = val));
    service.getLeadStatusScores("test", "test", "Status");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead status scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getLeadStatusScores("test", "test", "Status");
    expect(service.leadStatusScoreResponse).toEqual([]);
  });

  it("should get lead & manager age scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getLeadAgeScoresListner().subscribe(val => (value = val));
    service.getManagerAgeScoresListner().subscribe(val => (value = val));
    service.getManagerAgeScores("test", "test", "", "Status");
    service.getLeadAgeScores("test", "test", "", "status");
    expect(value).toEqual([]);
  });

  it("should handle the error on getting lead & manager age scores", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getLeadAgeScores("test", "test", "", "Status");
    service.getManagerAgeScores("test", "test", "", "status");
    expect(service.leadAgeScoreResponse).toEqual([]);
    expect(service.managerAgeScoreResponse).toEqual([]);
  });

  describe("Should get report", () => {
    let service: TaskmanagementService;
    beforeEach(() => {
      service = TestBed.get(TaskmanagementService);
      spyOn(http, "getExcel").and.returnValue(of([]));
    });

    it("Status Report", () => {
      let value;
      service.getStatusReportListner().subscribe(val => (value = val));
      service.getStatusReport("test", "test");
      expect(value).toEqual([]);
    });

    it("Productivity Report", () => {
      let value;
      service.getProductivityReportListner().subscribe(val => (value = val));
      service.getProductivityReport("test", "test");
      expect(value).toEqual([]);
    });

    it("Finance Report", () => {
      let value;
      service.getFinanceReportListner().subscribe(val => (value = val));
      service.getFinanceReport("test", "test");
      expect(value).toEqual([]);
    });

    it("Audit Report", () => {
      let value;
      service.getAuditReportListner().subscribe(val => (value = val));
      service.getAuditReport("test", "test");
      expect(value).toEqual([]);
    });

    it("Procedural Report", () => {
      let value;
      service.getProcReportListner().subscribe(val => (value = val));
      service.getProcReport("test", "test");
      expect(value).toEqual([]);
    });
  });

  describe("Should handle error on getting report", () => {
    let service: TaskmanagementService;
    beforeEach(() => {
      service = TestBed.get(TaskmanagementService);
      spyOn(http, "getExcel").and.returnValue(throwError({ status: 400 }));
    });

    it("Status Report", () => {
      service.getStatusReport("test", "test");
      expect(service.statusReportResponse).toEqual([]);
    });

    it("Productivity Report", () => {
      service.getProductivityReport("test", "test");
      expect(service.productivityReportResponse).toEqual([]);
    });

    it("Finance Report", () => {
      service.getFinanceReport("test", "test");
      expect(service.financeReportResponse).toEqual([]);
    });

    it("Audit Report", () => {
      service.getAuditReport("test", "test");
      expect(service.auditReportResponse).toEqual([]);
    });

    it("Procedural Report", () => {
      service.getProcReport("test", "test");
      expect(service.procReportResponse).toEqual([]);
    });
  });

  describe("Save and Navigate to next claim", () => {
    let service: TaskmanagementService;
    const data = {
      pendComments: "",
      pendReason: {
        value: "Text"
      },
      routeReason: {
        value: "Text"
      },
      routeComments: "",
      routeTo: {
        value: "Text"
      }
    };
    beforeEach(() => {
      service = TestBed.get(TaskmanagementService);
      service.auditClaimDetails = {
        billedAmount: 0,
        claimId: "1",
        claimSource: "Test",
        claimType: "",
        entryDate: null,
        finalizedBy: "",
        finalizedDate: null,
        receiptDate: null,
        reviewRepairReason: "",
        state: "",
        taskAssignmentId: 1,
        workBasketName: "",
        action: "",
        comments: ""
      };
      spyOn(http, "get").and.returnValue(of(null));
      service.claimDetails.taskId = 1;
    });

    it("Action pended", () => {
      spyOn(http, "post").and.returnValue(of(null));
      service.saveAndNavigateToNextClaim("PENDED", data);
      expect(service.currentClaimDetails.taskId).toEqual(1);
    });

    it("Action Routed", () => {
      spyOn(http, "post").and.returnValue(of(null));
      service.saveAndNavigateToNextClaim("ROUTED", data);
      expect(service.currentClaimDetails.taskId).toEqual(1);
    });

    it("Action Completed", () => {
      spyOn(http, "post").and.returnValue(of(null));
      let value;
      service.updateUserInfoListener().subscribe(val => (value = val));
      service.saveAndNavigateToNextClaim("COMPLETED", data);
      expect(service.currentClaimDetails.taskId).toEqual(1);
      expect(value).toBeUndefined();
    });

    it("NO Action", () => {
      spyOn(http, "post").and.returnValue(of(null));
      service.saveAndNavigateToNextClaim("", data);
      expect(service.currentClaimDetails.taskId).toEqual(1);
    });

    it("NO Action - error", () => {
      spyOn(http, "post").and.returnValue(throwError("Test"));
      service.saveAndNavigateToNextClaim("", data).catch(err => {
        expect(service.currentClaimDetails.taskId).toEqual(1);
      });
    });
  });

  it("Should get data", () => {
    spyOn<any>(http, "get").and.returnValue(true);
    spyOn<any>(http, "post").and.returnValue(true);
    spyOn<any>(http, "callHealthEdge").and.returnValue(true);
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    expect(service.callHealthEdge()).toBeTruthy();
    expect(service.getManagerClaimsStatus()).toBeTruthy();
    expect(service.reprioritizeClaims(true)).toBeTruthy();
    expect(service.getPriorityListBySearch(true)).toBeTruthy();
    expect(service.getUnassignedReprioritizeList()).toBeTruthy();
    expect(service.getReprioritizeClaims()).toBeTruthy();
    expect(service.leadModifyUserUpdate({ value: "Test" })).toBeTruthy();
    expect(service.refreshClaimWorkBasket()).toBeTruthy();
    expect(service.modifyUserTarget("Test", "Test")).toBeTruthy();
    expect(service.getQueueNamesLead(1)).toBeTruthy();
    expect(service.getQueueNamesManager(1)).toBeTruthy();
    expect(service.saveTargetSettingsFetch()).toBeTruthy();
    expect(service.getReprioritizeSearchFields().length).toEqual(6);
  });

  it("should get audit data", () => {
    spyOn<any>(http, "get").and.returnValue(
      of({
        billedAmount: 0,
        claimId: "1",
        claimSource: "Test",
        claimType: "",
        entryDate: null,
        finalizedBy: "",
        finalizedDate: null,
        receiptDate: null,
        reviewRepairReason: "",
        state: "",
        taskAssignmentId: 1,
        workBasketName: "",
        action: "",
        comments: ""
      })
    );
    spyOn<any>(http, "post").and.returnValue(of(true));
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    service.getAuditClaim();
    expect(service.auditClaimDetails).toBeDefined();
    service.auditClaimDetails.taskAssignmentId = 1;
    service.assignAuditTask();
    expect(service.assignAuditTaskResponse).toBeTruthy();
    service.assignAuditTaskResponse = {
      auditTaskId: 0,
      auditorAction: "",
      auditorComments: "",
      auditorID: 0,
      createdAt: null,
      auditorPrimaryEmail: "",
      processorPrimaryEmail: "",
      processorAction: "",
      processorComments: "",
      processorId: 0,
      taskAssignmentId: 0,
      verificationCriteria: ""
    };
    service.auditClaimDetails = {
      billedAmount: 0,
      claimId: "1",
      claimSource: "Test",
      claimType: "",
      entryDate: null,
      finalizedBy: "",
      finalizedDate: null,
      receiptDate: null,
      reviewRepairReason: "",
      state: "",
      taskAssignmentId: 1,
      workBasketName: "",
      action: "",
      comments: ""
    };
    service.saveAndNavigateToNextAuditClaim("", "", "");
    expect(service.auditClaimDetails).toBeDefined();
    service.savePendReason("");
    service.saveRouteReason("");
    service.saveRouteRole("");
    service.getQueueNotification();
    // service.saveTargetSettings('Test');
    // expect(service.targetSettingsDetailsResponse).toBeTruthy();
  });

  it("should get audit data", () => {
    spyOn<any>(http, "get").and.returnValue(throwError({ status: 400 }));
    spyOn<any>(http, "post").and.returnValue(throwError("Test"));
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    service.assignAuditTaskResponse = {
      auditTaskId: 0,
      auditorAction: "",
      auditorComments: "",
      auditorID: 0,
      createdAt: null,
      auditorPrimaryEmail: "",
      processorPrimaryEmail: "",
      processorAction: "",
      processorComments: "",
      processorId: 0,
      taskAssignmentId: 0,
      verificationCriteria: ""
    };
    service.auditClaimDetails = {
      billedAmount: 0,
      claimId: "1",
      claimSource: "Test",
      claimType: "",
      entryDate: null,
      finalizedBy: "",
      finalizedDate: null,
      receiptDate: null,
      reviewRepairReason: "",
      state: "",
      taskAssignmentId: 1,
      workBasketName: "",
      action: "",
      comments: ""
    };
    service.saveAndNavigateToNextAuditClaim("", "", "");
    service.savePendReason("");
    service.getConScoresListner();
    service.getTaskTimerListener();
    service.getUserRolesListner();
    service.saveRouteReason("");
    service.saveRouteRole("");
    service.getAuditClaimDetailsListener();
    service.getUserInfo();
    expect(service.assignAuditTaskResponse).toBeDefined();
  });

  it("should get reassignment reasons", () => {
    spyOn<any>(http, "get").and.returnValue(true);
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    expect(service.getReassignmentReasons()).toBeTruthy();
  });

  it("should save reassignment reasons", () => {
    spyOn<any>(http, "post").and.returnValue(true);
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    expect(service.saveReassignmentReasons({})).toBeTruthy();
  });

  it("should get manager and lead claim examiners", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of([]));
    let value;
    service.getManagerClaimsExaminersListner().subscribe(val => (value = val));
    service.getManagerClaimsExaminers(2);
    expect(value).toEqual([]);
  });

  it("should handle the error for manager and lead claim examiners", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(throwError({ status: 400 }));
    service.getManagerClaimsExaminers(null);
    expect(service.managerClaimsExaminersResponse).toEqual([]);
  });

  it("should get manager and lead financial score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerFinScoresListner().subscribe(val => (value = val));
    service.getManagerFinScores("2020-03-29", "2020-06-29", 2, "Manager");
    expect(value).toEqual([]);
  });
  it("should handle the error for manager and lead financial score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerFinScores(null, null, null, null);
    expect(service.managerFinScoreResponse).toEqual([]);
  });
  it("should get manager and lead procedural score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of([]));
    let value;
    service.getManagerProcScoresListner().subscribe(val => (value = val));
    service.getManagerProcScores("2020-03-29", "2020-06-29", 2, "Manager");
    expect(value).toEqual([]);
  });
  it("should handle the error for manager and lead procedural score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getManagerProcScores(null, null, null, null);
    expect(service.managerProcScoreResponse).toEqual([]);
  });
  it("should get high performing examiner details for Claims Lead", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    let detail;
    service.getHighPerExaminersListner().subscribe(val => (detail = val));
    service.getHighPerExaminers("2020-06-16", "2020-06-23", "Claims Lead");
    expect(detail).toBeTruthy();
  });

  it("should get high performing examiner details - handle error for Claims Lead", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getHighPerExaminers("2020-06-16", "2020-06-23", "Claims Lead");
    expect(service.highPerExaminersResponse).toEqual([]);
  });
  it("should get high performing examiner details for Manager", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    let detail;
    service.getHighPerExaminersListner().subscribe(val => (detail = val));
    service.getHighPerExaminers("2020-06-16", "2020-06-23", "Manager");
    expect(detail).toBeTruthy();
  });

  it("should get high performing examiner details - handle error for Manager", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(throwError({ status: 400 }));
    service.getHighPerExaminers("2020-06-16", "2020-06-23", "Manager");
    expect(service.highPerExaminersResponse).toEqual([]);
  });

  it("should add route reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.addRouteReason({});
    expect(service).toBeTruthy();
  });

  it("should add route reasons", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.addRouteReason({});
    expect(service).toBeTruthy();
  });

  it("should get OpenInvReport", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.getOpenInvReport("test", "test");
    expect(service).toBeTruthy();
  });

  it("should save Financial Target Score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.saveFinancialTargetScore("test");
    expect(service).toBeTruthy();
  });
  it("should save Sla Configuration value", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.saveSlaConfig("test");
    expect(service).toBeTruthy();
  });
  it("should update Sla Configuration", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.updateSlaConfig("test");
    expect(service).toBeTruthy();
  });
  it("should save Procedural Target Score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.saveProceduralTargetScore("test");
    expect(service).toBeTruthy();
  });
  it("should update Productivity Target Score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.updateProductivityTargetScore("test");
    expect(service).toBeTruthy();
  });
  it("should save Productivity Target Score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.saveProductivityTargetScore("test");
    expect(service).toBeTruthy();
  });
  it("should  update  Procedural Target Score", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "post").and.returnValue(of(true));
    service.updateProceduralTargetScore("test");
    expect(service).toBeTruthy();
  });

  it("should  get Dashboard Data", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.getDashboardData();
    expect(service).toBeTruthy();
  });

  it("should  add Reassignment Reason", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.addReassignmentReason("test");
    expect(service).toBeTruthy();
  });

  it("should update Reassignment Reason", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.updateReassignmentReason("test", "test");
    expect(service).toBeTruthy();
  });
  it("should delete Reassignment Reason", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.deleteReassignmentReason("test");
    expect(service).toBeTruthy();
  });
  it("should get Audit Failed Rebuttal Accepted", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.deleteReassignmentReason("test");
    expect(service).toBeTruthy();
  });
  it("should get complete Route Claim", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.completeRouteClaim("test");
    expect(service).toBeTruthy();
  });
  it("should repioritize", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.repioritizeAssign("test", true);
    expect(service).toBeTruthy();
  });
  it("should get Assigned Details", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.getAssignedDetails();
    expect(service).toBeTruthy();
  });
  it("should get client Vendor Queue", () => {
    const service: TaskmanagementService = TestBed.get(TaskmanagementService);
    spyOn(http, "get").and.returnValue(of(true));
    service.clientVendorQueue();
    expect(service).toBeTruthy();
  });
});
