import { Component, OnInit } from "@angular/core";
import { UserManagementService } from "src/app/services/user-management/user-management.service";
import { UpComingMaintenance } from "../models/UpcomingMaintenance";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Component({
  selector: "app-active-user-snapshot",
  templateUrl: "./active-user-snapshot.component.html"
})
export class ActiveUserSnapshotComponent implements OnInit {
  activeUsers: any;
  upcomingMaintenance: UpComingMaintenance[];
  message = "No Upcoming Maintenance Scheduled";
  addUser: boolean;
  addNotification: boolean;
  public cols: any[];
  public adminType: string;

  constructor(
    private userMangementService: UserManagementService,
    private authService: AuthenticationService
  ) {}
  ngOnInit() {
    this.cols = [
      { field: "emailSubject", header: "Email Subject" },
      { field: "emailTriggerDate", header: "Email Trigger Date" },
      { field: "maintenanceFrom", header: "Scheduled From" },
      { field: "maintenanceTo", header: "Scheduled To" },
      { field: "recipients", header: "Recipients" }
    ];
    this.adminType = this.authService.adminType;
    this.userMangementService.getActiveUserSnapshotCount().subscribe(resp => {
      this.activeUsers = resp;
    });
    this.getMaintenanceGridData();
  }

  getMaintenanceGridData() {
    this.userMangementService.getUpcomingScheduledDetails().subscribe(resp => {
      this.upcomingMaintenance = resp || [];
    });
  }

  openAddUser() {
    this.addUser = true;
  }

  processString(str: string) {
    return str ? str.split(",").join(", ") : "";
  }
}
