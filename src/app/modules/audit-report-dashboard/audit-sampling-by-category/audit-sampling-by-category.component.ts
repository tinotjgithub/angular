import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuditReportDashboardService } from "./../audit-report-dashboard.service";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-audit-sampling-by-category",
  templateUrl: "./audit-sampling-by-category.component.html"
})
export class AuditSamplingByCategoryComponent implements OnInit, OnDestroy {
  claimtypeSelect: MultiSelect;
  auditReportBarChartMaps: any;
  @Input() resetFormSubject: Subject<boolean> = new Subject<boolean>();
  @Input()
  auditDetails: { auditDates: [] };
  public processedDates: Array<{}>;
  public enlargedDisplay = false;
  userAuditReportDto: any;
  plan = [];
  public isDataPresent = false;
  onload = true;
  samplingMethod = [];
  samplingGroup: FormGroup;
  private auditSubscription: Subscription = new Subscription();

  private auditSamplingMethodSubscription: Subscription = new Subscription();

  public titleAudit = "";
  public typeAudit = "ColumnChart";
  public columnNamesAudit = [];

  claimSourceArray = [];
  samplingArray = [];
  lobArray = [];
  paymentStatusArray = [];
  claimTypeArray = [];

  claimSrc = [];
  paymentSts = [];
  samplingMtd = [];
  lob = [];
  public optionsAudit = {
    annotations: {
      textStyle: {
        fontSize: 10
      }
    },
    colors: ["#ff9226", "#017ecf", "#cc3f6c", "#565454"],
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    height: 200,
    isStacked: false,
    vAxis: {
      format: "0",
      minValue: 0,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    hAxis: {
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 30,
      right: 40,
      top: 30,
      bottom: 30
    },
    legend: {
      position: "top",
      textStyle: { fontSize: 12 },
      width: "50%"
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };

  public optionsAuditEnlarged = {
    annotations: {
      textStyle: {
        fontSize: 14
      }
    },
    height: 400,
    width: 700,
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    isStacked: false,
    colors: ["#ff9226", "#017ecf", "#cc3f6c", "#565454"],
    minValue: 0,
    vAxis: {
      format: "0",
      title: "",
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    hAxis: {
      title: "",
      format: "0",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      textStyle: {
        color: "black",
        fontSize: 12,
        textPosition: "Horizontal"
      }
    },
    chartArea: {
      left: 30,
      right: 55,
      top: 25,
      bottom: 30
    },
    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        color: "black",
        fontSize: 14,
        textPosition: "Horizontal"
      }
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    }
  };
  public inValidDate = false;
  public maxDate = new Date();
  public dataAudit = [];
  public isAuditRendered = false;
  public widthAudit: any = 600;
  public heightAudit = 180;

  public samplingList = [];
  public claimSourceList = [];
  public businessList = [];
  public paymentStatusList = [];
  public claimTypeList = [];
  constructor(
    private fbAge: FormBuilder,
    private auditReportDashboardService: AuditReportDashboardService,
    public datePipe: DatePipe
  ) {
    this.samplingGroup = fbAge.group({
      samplingMethod: ["", Validators.required],
      claimSource: ["", Validators.required],
      ListOfBusiness: ["", Validators.required],
      paymentStatus: ["", Validators.required],
      claimType: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.auditDetails = this.auditReportDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getAuditDays();
    this.getAuditDetails();
    this.samplingGroup.valueChanges.subscribe(val => {
      if (this.samplingGroup.valid) {
        this.onSubmitCategory();
      }
    });
  }

  getAuditDetails() {
    this.processedDates = [];
    this.resetFormSubject.subscribe(response => {
      if (response) {
        this.auditDetails = this.auditReportDashboardService.getAuditDates();
        this.processedDates = this.auditDetails.auditDates;
        this.getAuditDays();
      }
    });
  }

  getClaimTypeList() {
    const selectedScopes = [];
    this.claimTypeList = [];
    this.claimTypeList.push({
      label: "Professional",
      value: { id: "1", name: "Professional", code: "Professional" }
    });
    this.claimTypeList.push({
      label: "Institutional-IP",
      value: { id: "2", name: "Institutional-IP", code: "Institutional-IP" }
    });
    this.claimTypeList.push({
      label: "Institutional-OP",
      value: { id: "3", name: "Institutional-OP", code: "Institutional-OP" }
    });
    this.claimTypeList.push({
      label: "Others",
      value: { id: "4", name: "Others", code: "Others" }
    });
    this.claimTypeList.forEach(item => selectedScopes.push(item.value));
    this.samplingGroup.get("claimType").setValue(selectedScopes);
    this.getClaimsParameterList();
  }

  getClaimsParameterList() {
    this.samplingMethod = [];
    this.auditReportDashboardService.getClaimsParameterList();
    this.samplingMethod = this.auditReportDashboardService.claimsParameterListResponse;
    this.auditSamplingMethodSubscription = this.auditReportDashboardService
      .getClaimsParameterListListner()
      .subscribe(data => {
        this.samplingMethod = data.samplingCategory;
        this.lob = data.lineOfBusiness;
        this.claimSrc = data.claimSource;
        this.paymentSts = data.paymentStatus;
        this.mapSamplingList();
        this.mapClaimSource();
        this.mapLOB();
        this.mapPaymentStatus();
        this.auditSamplingMethodSubscription.unsubscribe();
      });
  }

  mapSamplingList() {
    const selectedScopes = [];
    this.samplingList = [];
    if (
      this.samplingMethod &&
      this.samplingMethod !== null &&
      this.samplingMethod !== undefined &&
      this.samplingMethod.length > 0
    ) {
      this.samplingMethod.forEach(s => {
        this.samplingList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.samplingList.forEach(item => selectedScopes.push(item.value));
      this.samplingGroup.get("samplingMethod").setValue(selectedScopes);
    }
  }

  mapLOB() {
    const selectedScopes = [];
    this.businessList = [];
    if (
      this.lob &&
      this.lob !== null &&
      this.lob !== undefined &&
      this.lob.length > 0
    ) {
      this.lob.forEach(s => {
        this.businessList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.businessList.forEach(item => selectedScopes.push(item.value));
      this.samplingGroup.get("ListOfBusiness").setValue(selectedScopes);
    }
  }

  mapClaimSource() {
    const selectedScopes = [];
    this.claimSourceList = [];
    if (
      this.claimSrc &&
      this.claimSrc !== null &&
      this.claimSrc !== undefined &&
      this.claimSrc.length > 0
    ) {
      this.claimSrc.forEach(s => {
        this.claimSourceList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.claimSourceList.forEach(item => selectedScopes.push(item.value));
      this.samplingGroup.get("claimSource").setValue(selectedScopes);
    }
  }

  mapPaymentStatus() {
    const selectedScopes = [];
    this.paymentStatusList = [];
    if (
      this.paymentSts &&
      this.paymentSts !== null &&
      this.paymentSts !== undefined &&
      this.paymentSts.length > 0
    ) {
      this.paymentSts.forEach(s => {
        this.paymentStatusList.push({
          label: s.name,
          value: {
            id: s.id,
            name: s.name,
            code: s.name
          }
        });
      });
      this.paymentStatusList.forEach(item => selectedScopes.push(item.value));
      this.samplingGroup.get("paymentStatus").setValue(selectedScopes);
    }
  }

  showDialog() {
    this.enlargedDisplay = true;
  }

  getAuditChartNoValue() {
    this.isDataPresent = false;
    this.dataAudit = [];
    this.columnNamesAudit = [];
    this.optionsAudit.legend.position = "none";
    this.optionsAudit.tooltip.trigger = "none";
    this.optionsAuditEnlarged.legend.position = "none";
    this.optionsAuditEnlarged.tooltip.trigger = "none";
    this.dataAudit.push(["NO DATA", 0, "0"]);
    this.columnNamesAudit.push("");
    this.columnNamesAudit.push("Professional");
    this.columnNamesAudit.push({ role: "annotation" });
  }

  mapData(responseValue) {
    this.dataAudit = [];
    const typeArray = [];
    responseValue.forEach((val, i) => {
      this.dataAudit.push([val.claimType]);
      if (val.hasOwnProperty("Professional")) {
        this.dataAudit[i].push(val.Professional);
        this.dataAudit[i].push(val.Professional);
        typeArray.push("Professional");
      }
      if (val.hasOwnProperty("InstitutionalIP")) {
        this.dataAudit[i].push(val.InstitutionalIP);
        this.dataAudit[i].push(val.InstitutionalIP);
        typeArray.push("InstitutionalIP");
      }
      if (val.hasOwnProperty("InstitutionalOP")) {
        this.dataAudit[i].push(val.InstitutionalOP);
        this.dataAudit[i].push(val.InstitutionalOP);
        typeArray.push("InstitutionalOP");
      }
      if (val.hasOwnProperty("Others")) {
        this.dataAudit[i].push(val.Others);
        this.dataAudit[i].push(val.Others);
        typeArray.push("Others");
      }
    });
    this.mapColumns(typeArray);
  }

  mapColumns(typeArray) {
    this.columnNamesAudit = [];
    this.columnNamesAudit.push("");
    if (typeArray.includes("Professional")) {
      this.columnNamesAudit.push("Professional");
      this.columnNamesAudit.push({ role: "annotation" });
    }
    if (typeArray.includes("InstitutionalIP")) {
      this.columnNamesAudit.push("Institutional(IP)");
      this.columnNamesAudit.push({ role: "annotation" });
    }
    if (typeArray.includes("InstitutionalOP")) {
      this.columnNamesAudit.push("Institutional(OP)");
      this.columnNamesAudit.push({ role: "annotation" });
    }
    if (typeArray.includes("Others")) {
      this.columnNamesAudit.push("Others");
      this.columnNamesAudit.push({ role: "annotation" });
    }
  }

  getAuditChartValues() {
    this.isDataPresent = true;
    this.optionsAudit.legend.position = "top";
    this.optionsAudit.tooltip.trigger = "focus";
    this.optionsAuditEnlarged.legend.position = "top";
    this.optionsAuditEnlarged.tooltip.trigger = "focus";
    let responseValue = [];
    responseValue = this.auditReportBarChartMaps;
    this.mapData(responseValue);
    this.setChartScroll();
  }

  onSubmitCategory() {
    this.auditDetails = this.auditReportDashboardService.getAuditDates();
    this.processedDates = this.auditDetails.auditDates;
    this.getAuditDays();
    this.getAuditDetails();
  }

  setChartScroll() {
    const statusLength = this.dataAudit.length;
    /*  const newHeightEnlarged = statusLength > 5 ? statusLength * 90 : 400;
    const newGeneratedHeightEnlarged =
      newHeightEnlarged > 400 ? newHeightEnlarged : 400;
    const newHeight = statusLength > 5 ? statusLength * 30 : 210;
    const newGeneratedHeight = newHeight > 230 ? newHeight : 210;
    this.optionsAuditEnlarged.height = newGeneratedHeightEnlarged; */
    // this.optionsAudit.height = newGeneratedHeight;
    this.widthAudit = statusLength > 3 ? statusLength * 200 : 700;
    this.optionsAuditEnlarged.width =
      statusLength > 3 ? statusLength * 150 : 700;
  }

  getToDateValue() {
    const toDateValue =
      this.processedDates[1] !== null &&
      this.processedDates[1] !== "" &&
      this.processedDates[1] !== undefined
        ? this.processedDates[1]
        : this.processedDates[0];
    return toDateValue;
  }

  mapSamplingArray(sampling) {
    this.samplingArray = [];
    if (
      sampling &&
      sampling !== undefined &&
      sampling !== "" &&
      sampling !== null &&
      sampling.length > 0
    ) {
      sampling.forEach(q => {
        const name = q.name;
        this.samplingArray.push(name.toUpperCase());
      });
    }
  }

  mapClaimSourceArray(claimSource) {
    this.claimSourceArray = [];
    if (
      claimSource &&
      claimSource !== undefined &&
      claimSource !== "" &&
      claimSource !== null &&
      claimSource.length > 0
    ) {
      claimSource.forEach(q => {
        this.claimSourceArray.push(q.name);
      });
    }
  }

  mapLOBArray(lob) {
    this.lobArray = [];
    if (
      lob &&
      lob !== undefined &&
      lob !== "" &&
      lob !== null &&
      lob.length > 0
    ) {
      lob.forEach(q => {
        this.lobArray.push(q.name);
      });
    }
  }

  mapPaymentStatusArray(paymentSts) {
    this.paymentStatusArray = [];
    if (
      paymentSts &&
      paymentSts !== undefined &&
      paymentSts !== "" &&
      paymentSts !== null &&
      paymentSts.length > 0
    ) {
      paymentSts.forEach(q => {
        this.paymentStatusArray.push(q.name);
      });
    }
  }

  mapClaimTypeArray(claimType) {
    this.claimTypeArray = [];
    if (
      claimType &&
      claimType !== undefined &&
      claimType !== "" &&
      claimType !== null &&
      claimType.length > 0
    ) {
      claimType.forEach(q => {
        this.claimTypeArray.push(q.name);
      });
    }
  }

  getAuditDays() {
    this.mapSamplingArray(this.samplingGroup.get("samplingMethod").value);
    this.mapClaimSourceArray(this.samplingGroup.get("claimSource").value);
    this.mapLOBArray(this.samplingGroup.get("ListOfBusiness").value);
    this.mapPaymentStatusArray(this.samplingGroup.get("paymentStatus").value);
    this.mapClaimTypeArray(this.samplingGroup.get("claimType").value);
    const toDateValue = this.getToDateValue();
    const fromDateValue = this.processedDates[0];
    let payload = {};
    if (this.onload) {
      payload = {
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        type: "initial"
      };
    } else {
      payload = {
        fromDate: this.datePipe.transform(fromDateValue, "yyyy-MM-dd"),
        toDate: this.datePipe.transform(toDateValue, "yyyy-MM-dd"),
        type: "not initial",
        claimSource: this.claimSourceArray,
        samplingCategory: this.samplingArray,
        lineOfBusiness: this.lobArray,
        paymentStatus: this.paymentStatusArray,
        claimType: this.claimTypeArray
      };
    }
    this.auditReportDashboardService.getAuditSamplingCategory(payload);
    this.auditReportBarChartMaps = this.auditReportDashboardService.auditSamplingCategoryResponse;
    this.auditReportBarChartMaps = null;
    this.auditSubscription = this.auditReportDashboardService
      .getAuditSamplingCategoryListner()
      .subscribe((data: any) => {
        this.auditReportBarChartMaps = data.auditReportBarChartMaps;
        this.dataAudit = [];
        this.auditReportBarChartMaps && this.auditReportBarChartMaps.length > 0
          ? this.getAuditChartValues()
          : this.getAuditChartNoValue();
        if (this.onload) {
          this.getClaimTypeList();
          this.onload = false;
        }
        this.auditSubscription.unsubscribe();
      });
    if (
      this.auditReportBarChartMaps === null ||
      this.auditReportBarChartMaps === undefined
    ) {
      this.getAuditChartNoValue();
    }
    this.isAuditRendered = true;
  }
  ngOnDestroy() {
    this.auditSubscription.unsubscribe();
  }
}
