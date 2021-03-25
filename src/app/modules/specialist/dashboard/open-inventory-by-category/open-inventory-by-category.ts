import { Component, OnInit, OnDestroy } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-open-inventory-by-category",
  templateUrl: "./open-inventory-by-category.html",
  styleUrls: ["./open-inventory-by-category.css"]
})
export class OpenInventoryByCategoryComponent implements OnInit, OnDestroy {
  reportSubscription: Subscription = new Subscription();
  private statusSubscription: Subscription = new Subscription();
  openInvDto: any;
  public cat = "";
  userStatusReportDto: any;
  public noDataPresent = false;
  public displayEnlarged = false;
  public titleStatus = "";
  public typeStatus = "PieChart";
  public columnNamesStatus = ["Status", "Count"];
  public isValid = true;
  public dataStatus = [];
  public catArray = [];
  public isStatusRendered = false;
  public widthStatus = 450;
  public status = [];
  public catList = [];
  public heightStatus = 250;
  public requestGroup: FormGroup;
  public editUser = {}; 
  public editMode = false;
  public myColumnNamesStatus = [
    "Workbasket",
    "Fallout",
    "Reconciliation",
    "ID Card"
  ];
  public optionsStatus = {
    pieSliceTextStyle: { fontSize: 14 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 50,
      right: 50,
      top: 17,
      bottom: 20
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    }
  };

  public optionsStatusEnlarged = {
    pieSliceTextStyle: { fontSize: 16 },
    animation: {
      duration: 1000,
      easing: "in",
      startup: true
    },
    chartArea: {
      left: 60,
      right: 20,
      top: 30,
      bottom: 10
    },
    colors: [
      "#003f5c",
      "#2f4b7c",
      "#665191",
      "#a05195",
      "#d45087",
      "#f95d6a",
      "#ff7c43",
      "#ffa600",
      "#f6ff00",
      "#02a2ce",
      "#b03761",
      "#6e2550",
      "#a63777",
      "#c03a71",
      "#d74268"
    ],
    pieSliceText: "value-and-percentage",
    tooltip: {
      text: "value-and-percentage",
      trigger: "focus",
      showColorCode: true
    },
    legend: {
      position: "top",
      alignment: "center",
      width: "50%",
      textStyle: {
        fontSize: 13
      }
    }
  };

  get getStatus() {
    return this.requestGroup.controls.status;
  }

  constructor(
    private fbStatus: FormBuilder,
    private enrollmentManagementService: EnrollmentManagementService,
    public datePipe: DatePipe
  ) {
    this.requestGroup = fbStatus.group({
      status: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.mapStatus();
  }

  showDialog() {
    this.displayEnlarged = true;
  }

  getNoDataChart() {
    this.noDataPresent = true;
    this.dataStatus = [];
    this.dataStatus.push(["NO DATA", 1]);
    this.optionsStatus.pieSliceText = "label";
    this.optionsStatus.tooltip.text = "none";
    this.optionsStatus.legend.position = "none";
    this.optionsStatusEnlarged.pieSliceText = "label";
    this.optionsStatusEnlarged.tooltip.text = "none";
    this.optionsStatusEnlarged.legend.position = "none";
  }

  getDataChart() {
    this.noDataPresent = false;
    this.dataStatus = [];
    this.optionsStatus.pieSliceText = "value-and-percentage";
    this.optionsStatus.tooltip.text = "value-and-percentage";
    this.optionsStatus.legend.position = "top";
    this.optionsStatusEnlarged.pieSliceText = "value-and-percentage";
    this.optionsStatusEnlarged.tooltip.text = "value-and-percentage";
    this.optionsStatusEnlarged.legend.position = "top";
    let responseValue = [];
    responseValue = this.openInvDto;
    this.mapResponseValue(responseValue);
  }

  validateStatus() {
    this.isValid = this.requestGroup.get("status").hasError("required")
      ? false
      : true;
    this.isValid ? this.onSubmitStatus() : "";
  }

  mapStatus() {
    this.status = [];
    this.status.push({ status: "Assigned", id: "Assigned" });
    this.status.push({ status: "Routed In", id: "Routed" });
    this.status.push({ status: "Pended", id: "Pended" });
    const selectedScopes = [];
    if (this.status && this.status.length > 0) {
      this.status.forEach(s => {
        this.catList.push({
          label: s.status,
          value: {
            id: s.id,
            name: s.status,
            code: s.status
          }
        });
      });
      this.catList.forEach(item => selectedScopes.push(item.value));
    }
    this.requestGroup.get("status").setValue(selectedScopes);
    this.catList.forEach(q => {
      this.catArray.push(q.value.id);
    });
    this.getStatusDays();
  }

  mapSts(cate) {
    this.catArray = [];
    if (cate !== null && cate.length > 0) {
      cate.forEach(item => {
        this.catArray.push(item.id.toUpperCase());
      });
    }
    return this.catArray;
  }

  convertUpperCase(status) {
    const sts = [];
    status.forEach(st => {
      sts.push(st.id.toUpperCase());
    });
    return sts;
  }

  openPopUp(e) {
    this.editUser = {};
    if (e.length > 0 && this.dataStatus.length > 0) {
      const todaysDate = new Date();
      const defaultFrom = new Date("01-01-1970");
      const fromDateValue = defaultFrom;
      const toDateValue = todaysDate;
      const row = e[0].row;
      const workCategory = this.dataStatus[row][0];
      const status = this.convertUpperCase(
        this.requestGroup.get("status").value
      );
      const count = this.dataStatus[row][1];
      this.cat = this.dataStatus[row][0].toString();
      this.editUser = {
        type: "open-inventory-by-cat",
        workCategory,
        status,
        count,
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd")
      };
      this.editMode = true;
    }
  }

  closePopUp() {
    this.editMode = false;
    this.editUser = null;
  }

  mapResponseValue(responseValue) {
    this.dataStatus = [];
    responseValue.map(val => {
      this.dataStatus.push([val.requestType, val.requestCount]);
    });
  }

  getStatusDays() {
    const todaysDate = new Date();
    const defaultFrom = new Date("01-01-1970");
    const fromDateValue = defaultFrom;
    const toDateValue = todaysDate;
    this.enrollmentManagementService.getOpenInvReq(
      this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
      this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
      this.mapSts(this.requestGroup.get("status").value)
    );
    this.openInvDto = this.enrollmentManagementService.openInvReqResponse;
    this.openInvDto = null;
    this.statusSubscription = this.enrollmentManagementService
      .getOpenInvReqListner()
      .subscribe((data: any) => {
        this.openInvDto = data;
        this.dataStatus = [];
        this.openInvDto && this.openInvDto.length > 0
          ? this.getDataChart()
          : this.getNoDataChart();
        this.statusSubscription.unsubscribe();
      });
    if (this.openInvDto === null || this.openInvDto === undefined) {
      this.getNoDataChart();
    }
    this.isStatusRendered = true;
  }

  onSubmitStatus() {
    if (this.isValid) {
      this.getStatusDays();
    }
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }
}
