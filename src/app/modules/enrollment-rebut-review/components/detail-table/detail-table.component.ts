import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { NotifierService } from "src/app/services/notifier.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Component({
  selector: "app-detail-table",
  templateUrl: "./detail-table.component.html",
  styleUrls: ["./detail-table.component.css"]
})
export class DetailTableComponent implements OnInit, OnChanges {
  @ViewChild("scoreTable", { static: false }) scoreTable;
  @Input()
  public gridData: any[];
  @Input()
  public type: string;
  @Input()
  public cols: {
    field: string;
    header: string;
    visible?: boolean;
    filter?: string;
    link?: boolean;
  }[];
  @Input()
  public header = "";
  @Output()
  public selectAndNavigate: EventEmitter<any> = new EventEmitter();
  @Input()
  public assign: boolean;
  @Input()
  public name: string;
  @Input()
  public deleteButton: boolean;
  @Input()
  public selectedIds: any[];
  @Output()
  public selectedIdsChange: EventEmitter<any[]> = new EventEmitter();
  @Output()
  public onAssignment: EventEmitter<any> = new EventEmitter();
  @Input()
  public searchPlaceholder: string;
  @Output()
  public onAssignToggle: EventEmitter<boolean> = new EventEmitter();
  @Input()
  public viewAssign: boolean;
  @Input()
  public backToHome: boolean;
  @Input()
  public dataKey: string;
  public showFilter: boolean;
  @Output()
  public onDelete: EventEmitter<any> = new EventEmitter();
  @Input()
  public conditionalSelect: boolean;
  @Input()
  public selectItemCondition: (item) => boolean;
  public allCheckbox: boolean;

  constructor(
    private notifierService: NotifierService,
    private confirmationService: ConfirmationService,
    public datePipe: DatePipe,
    private authService: AuthenticationService,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    console.log("NAME:", this.name);
  }

  ngOnChanges() {
    this.showFilter = this.cols && this.cols.some(e => e.filter);
  }

  selectedCol(rowData) {
    this.confirmAndNavigate(rowData);
  }

  checkForNavigation(field: string) {
    return field === "subscriptionId";
  }

  confirmAndNavigate(rowData) {
    this.confirmationService.confirm({
      message:
        "Are you sure want to load the transaction in Enrollment Transaction Queue ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptVisible: true,
      rejectVisible: true,
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.selectForNavigate(rowData);
      }
    });
  }

  selectForNavigate(rowData) {
    if (this.enrollmentService.subscriptionDetails.taskId === null) {
      this.selectAndNavigate.emit(rowData);
    } else {
      this.notifierService.throwNotification({
        type: "warning",
        message:
          "You can not load a transaction in Queue until you Complete/Pend/Route the current Transaction"
      });
    }
  }

  openAssign() {
    this.viewAssign = this.selectedIds && this.selectedIds.length > 0;
  }

  toggleDialog(status) {
    this.onAssignToggle.emit(status);
  }

  emitSelection() {
    this.selectedIdsChange.emit(this.selectedIds);
  }

  navigateToHome() {
    this.authService.redirectAfterLogin();
  }

  deleteRecord() {
    this.onDelete.emit(this.selectedIds);
  }

  getOptions(col, tableData) {
    const data: any[] =
      tableData && tableData.length > 0
        ? tableData
            .map(c => c[col.field])
            .filter((val, i, self) => self.indexOf(val) === i)
        : [];
    return data;
  }

  getSelectable() {
    const array =
      this.gridData && this.gridData.length > 0
        ? this.gridData.filter(value => {
            return this.selectItemCondition(value);
          })
        : [];
    return array;
  }

  selectAllSelectable(checkValue) {
    if (checkValue) {
      this.selectedIds = this.gridData.filter(value => {
        return this.selectItemCondition(value);
      });
    } else {
      this.selectedIds = [];
    }
  }

  checkAllSelected() {
    if (
      this.selectedIds.length > 0 &&
      this.getSelectable().length === this.selectedIds.length
    ) {
      this.allCheckbox = true;
    } else {
      this.allCheckbox = false;
    }
  }
}
