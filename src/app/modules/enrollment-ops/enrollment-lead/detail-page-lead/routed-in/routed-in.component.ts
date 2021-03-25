import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmrollmentLeadLandingPageService } from "../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { FalloutReconAssignmentService } from "../../fallout-recon-assignment/services/fallout-recon-assignment.service";
import { NotifierService } from "src/app/services/notifier.service";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-routed-in",
  templateUrl: "./routed-in.component.html",
  styleUrls: ["./routed-in.component.css"]
})
export class RoutedInComponent implements OnInit {
  public type: string;
  public cols: any[];
  public gridData: any[];
  public selectedRecord: any[];
  public dialogForm: FormGroup;
  public userGroupResponseDto: any;
  public userGroupList: any;
  public priorityLevels: any;
  public name: string;
  public specialistList: {
    label: any;
    assignedCount: any;
    pendedCount: any;
    value: any;
  }[];
  public checkedMessage: any;
  public showAssign: boolean;
  public routeReasons: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: EmrollmentLeadLandingPageService,
    private formBuilder: FormBuilder,
    private falloutReconAssignmentService: FalloutReconAssignmentService,
    private notifierService: NotifierService,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    this.name = "routed-in";
    this.type = this.activatedRoute.snapshot.queryParamMap.get("type");
    this.dialogForm = this.formBuilder.group({
      userGroup: ["", [Validators.required]],
      specialistName: [[], [Validators.required]],
      routeReasonCode: [0, [Validators.required]],
      comments: [""]
    });
    this.setCols();
    this.getData();
  }

  private setCols() {
    this.cols = [
      { header: "Select", field: "select", visible: true, filter: "check" },
      { header: "Subscription ID", field: "subscriptionId", visible: true },
      { header: "Routed From", field: "routedFromName", visible: true },
      { header: "Route Reason", field: "routeReason", visible: true },
      { header: "Route Comments", field: "routeComments", visible: true },
      { header: "Transaction Type", field: "transactionType", visible: true },
      { header: "Receipt Date", field: "receiptDate", visible: true },
      {
        header: "Record Age (In Days)",
        field: "recordAge",
        visible: true
      },
      { header: "Subscriber Name", field: "subscriberName", visible: true },
      { header: "Member Group Name", field: "memberGroupName", visible: true },
      { header: "Member ID", field: "memberID", visible: true },
      { header: "Member Last Name", field: "memberLastName", visible: true },
      { header: "Member First Name", field: "memberFirstName", visible: true },
      {
        header: "Relation To Subscriber",
        field: "relationToSubscriber",
        visible: true
      },
      { header: "User Group Name", field: "userGroupName", visible: true },
      { header: "Error Details", field: "errorDetails", visible: true }
    ];
    if (this.type !== "Workbasket") {
      this.cols = this.cols.filter(f => f.field !== "transactionType");
    }
  }

  private getData() {
    this.gridData = [];
    this.service.getDeatilsList("my-routedIn", this.type).subscribe(res => {
      this.gridData = res;
    });
  }

  private getReasons() {
    this.routeReasons = [];
    this.enrollmentService.getRouteReasonLead().subscribe(res => {
      this.routeReasons = res;
    });
  }

  assignOpenClose(status) {
    if (status) {
      if (this.selectedRecord.length > 0) {
        const taskIds = this.selectedRecord.map(el => {
          return el.taskId;
        });
        this.falloutReconAssignmentService
          .getUsergrpAndItsSpecialists(taskIds, true)
          .subscribe(res => {
            this.userGroupResponseDto = res.userGroupResponseDtos || [];
            this.userGroupList = this.userGroupResponseDto.map(el => {
              return { id: el.id, name: el.name };
            });
          });
        this.getReasons();
        /* this.dialogForm.patchValue({
          priority: "Low",
        });
        this.falloutReconAssignmentService
          .getPriorityLevels()
          .subscribe((res) => {
            this.priorityLevels = res;
          }); */
      } else {
        this.notifierService.throwNotification({
          type: "warning",
          message: "No subscriptions selected"
        });
      }
    } else {
      this.cancelChanges();
    }
  }

  onChangeUserGrp() {
    const usergrpVal: any[] = this.dialogForm.get("userGroup").value.map(el => {
      return el.id;
    });
    const currentUserGrpDetails =
      this.userGroupResponseDto && this.userGroupResponseDto.length > 0
        ? this.userGroupResponseDto.filter(element => {
            return usergrpVal.includes(element.id);
          })
        : [];
    const specialistArray = [];
    currentUserGrpDetails.map(e => {
      specialistArray.push(...e.specialists);
    });
    this.specialistList = specialistArray.map(e => {
      return {
        label: e.name,
        assignedCount: e.assignedCount,
        pendedCount: e.pendedCount,
        value: e
      };
    });
  }

  checkSubscriptionMessage() {
    this.checkedMessage = null;
    const taskIds = this.selectedRecord.map(el => {
      return el.taskId;
    });
    const { specialistName } = this.dialogForm.value;
    const requestBody = {
      taskIds,
      specialists: specialistName ? specialistName.map(el => el.id) : []
    };
    this.falloutReconAssignmentService
      .checkEnrollSubscriptions(requestBody, true)
      .subscribe(res => {
        this.checkedMessage = res.message;
      });
  }

  cancelChanges() {
    this.dialogForm.reset();
    this.checkedMessage = null;
  }

  saveDetails() {
    const taskIds =
      this.selectedRecord && this.selectedRecord.length > 0
        ? this.selectedRecord.map(item => {
            return item.taskId;
          })
        : [];
    const {
      userGroup,
      specialistName,
      // priority,
      routeReasonCode,
      comments: routeComments
    } = this.dialogForm.value;

    // CREATE REQ
    const payload = {
      taskIds,
      userGroupIds: userGroup ? userGroup.map(el => el.id) : [],
      specialists: specialistName ? specialistName.map(el => el.id) : [],
      // priorityLevel: priority,
      routeReasonCode: Number(routeReasonCode),
      routeComments
    };

    this.falloutReconAssignmentService
      .saveDetails(payload, true)
      .subscribe(res => {
        this.selectedRecord = [];
        if (res) {
          this.getData();
          const failedIds = Array.isArray(res) && res.length > 0 ? res : [];
          this.selectedRecord = this.gridData.filter(
            e => failedIds.indexOf(e.taskId) > -1
          );
        }
        this.showAssign = false;
        this.notifierService.throwNotification({
          type: "success",
          message: "Subscriptions Assigned Successully."
        });
      });
  }
}
