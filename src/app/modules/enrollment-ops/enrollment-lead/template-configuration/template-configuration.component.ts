import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService } from "primeng/api";
import { Router, ActivatedRoute } from "@angular/router";
import { TemplateConfigurationService } from "./template-configuration.service";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { DatePipe } from "@angular/common";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { NotifierService } from "src/app/services/notifier.service";
import { SelectItem } from "primeng/api";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-template-configuration",
  templateUrl: "./template-configuration.component.html",
  styleUrls: ["./template-configuration.component.css"],
  providers: [ConfirmationService]
})
export class TemplateConfigurationComponent implements OnInit {
  public cols = [];
  public filterValue: string;
  public editMode: boolean;
  public editUser: any;
  public fileValue: any;
  public searchDone: boolean;
  public userGroups: any[];
  public userRoleID: string = this.secureLocalStorage.getItem("roleId");
  public addUser: boolean;
  public allUserList: any[];
  public rows = 10;
  public currentPage: number;
  public currentRows: any;
  selectedValues: any[] = [];
  searchField: SelectItem;
  public allCheckbox: boolean;

  constructor(
    private route: ActivatedRoute,
    private messageSercvice: MessageService,
    private authService: AuthenticationService,
    private router: Router,
    private notifierService: NotifierService,
    private templateConfigurationService: TemplateConfigurationService,
    private datePipe: DatePipe,
    private secureLocalStorage: CryptoService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.editMode = false;
    this.initiateTable();
    this.getAllusers();
  }

  public getAllusers() {
    this.allUserList = [];
    this.templateConfigurationService.getAllUsers().subscribe(res => {
      if (res) {
        this.allUserList = [...res];
      } else {
        this.allUserList = [];
      }
    });
  }

  public initiateTable() {
    this.cols = [
      { field: "slNo", header: "SI.No", visible: true },
      { field: "workCategory", header: "Work Category", visible: true },
      { field: "fileName", header: "Attachment", visible: true },
      { field: "fileId", header: "File Id", visible: false },
      { field: "existingTemplate", header: "ExistingTemplate", visible: false },
      { field: "fileHeaders", header: "File Headers", visible: false },
      { field: "systemHeaders", header: "System Headers", visible: false },
      {
        field: "mandatoryHeaders",
        header: "Mandatory Headers",
        visible: false
      },
      { field: "id", header: "Template Id", visible: false }
    ];
  }

  openEdit(user) {
    this.editMode = true;
    const file = [];
    this.editUser = user;
    this.fileValue = file;
    const data = {
      fileValue: this.fileValue,
      editUser: JSON.stringify({ user })
    };
    this.router.navigate(["/template-configuration/EditTemplate"], {
      queryParams: data
    });
  }

  deleteRow(rowIndex: number, i) {
    this.confirmationService.confirm({
      message: "Do you want to delete this template?",
      accept: () => {
        this.checkUpload(rowIndex);
      }
    });
  }

  checkUpload(rowIndex) {
    const item = this.allUserList[rowIndex];
    this.templateConfigurationService
      .checkFileUpload(item.id)
      .subscribe(res => {
        if (res === "true" || res === true) {
          this.notifierService.throwNotification({
            type: "error",
            message: "File upload in progress..Please try again later!"
          });
          return;
        } else {
          this.deleteTemplate(rowIndex);
        }
      });
  }

  deleteTemplate(rowIndex) {
    const item = this.allUserList[rowIndex];
    this.templateConfigurationService.deleteTemplate(item.id).subscribe(res => {
      this.notifierService.throwNotification({
        type: "info",
        message: "Template deleted."
      });
      this.getAllusers();
    });
  }

  navigateToAdd() {
    this.router.navigateByUrl("/UserConfig/add-user?returnEdit=true");
  }

  onUpdateSucces() {
    this.editMode = false;
    if (!this.filterValue) {
      this.getAllusers();
    }
  }

  closeEdit() {
    this.editUser = null;
    this.fileValue = null;
  }

  onCreateUser() {
    const workCategoryList = [];
    if (this.allUserList.length > 0) {
      this.allUserList.forEach(e => {
        workCategoryList.push(e.workCategory);
      });
    }
    this.addUser = true;
    const data = {
      addUser: workCategoryList
    };
    this.router.navigate(["/template-configuration/CreateTemplate"], {
      queryParams: data,
      skipLocationChange: true
    });
  }
}
