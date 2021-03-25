import { Component, OnInit } from "@angular/core";
import { TaskmanagementService } from "src/app/services/task-management/taskmanagement.service";
import { NotifierService } from "./../../../../services/notifier.service";
import { timeout } from "rxjs/operators";
import { catchError } from "rxjs/operators";
import { CryptoService } from 'src/app/services/crypto-service/crypto.service';

@Component({
  selector: "app-manual-synchronization",
  templateUrl: "./manual-synchronization.component.html"
})
export class ManualSynchronizationComponent implements OnInit {
  public queueList = [];
  public queueNames = [];
  queue: any[];
  public isLoading = false;
  public queueNamesArray = [];
  public userRoleID: string = this.secureLocalStorage.getItem("roleId");

  constructor(
    private taskManagementService: TaskmanagementService,
    private messageService: NotifierService,
    private secureLocalStorage: CryptoService
  ) {}

  ngOnInit() {
    this.isLoading = false;
  }

  refresh() {
    this.isLoading = true;
    this.taskManagementService
      .refreshClaimWorkBasket()
      .pipe(
        timeout(60000),
        catchError(e => {
          this.messageService.throwNotification({
            type: "error",
            message: "Refresh timed out! Please try after sometime."
          });
          this.isLoading = false;
          return null;
        })
      )
      .subscribe((data: any) => {
        if (
          data.status.toUpperCase() === "SUCCESS" ||
          data.status.toUpperCase() === "SUCCESS!"
        ) {
          this.isLoading = false;
          this.messageService.throwNotification({
            type: "success",
            message: data.message
          });
        } else if (
          data.status.toUpperCase() === "FAILURE" ||
          data.status.toUpperCase() === "FAILURE!"
        ) {
          this.isLoading = false;
          this.messageService.throwNotification({
            type: "error",
            message: data.message
          });
        }
      });
  }
}
