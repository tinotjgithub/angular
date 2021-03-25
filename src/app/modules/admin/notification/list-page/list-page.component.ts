import { Component, OnInit } from "@angular/core";
import { UpComingMaintenance } from "../../active-user-snapshot/models/UpcomingMaintenance";
import { ConfigurationService } from "src/app/services/configuration/configuration.service";

@Component({
  selector: "app-list-page",
  templateUrl: "./list-page.component.html"
})
export class ListPageComponent implements OnInit {
  public upcomingMaintenance: UpComingMaintenance[];
  public message = "No Upcoming Maintenance Scheduled";
  public addNotification: boolean;
  public cols: any[];
  public editNotification: boolean;
  public editDetails: any;
  public today = new Date();
  mode: any;
  constructor(private configurationService: ConfigurationService) {}

  ngOnInit() {
    this.cols = [
      { field: "emailSubject", header: "Email Subject" },
      { field: "emailTriggerDate", header: "Email Trigger Date" },
      { field: "maintenanceFrom", header: "Scheduled From" },
      { field: "maintenanceTo", header: "Scheduled To" },
      { field: "recipients", header: "Recipients" }
    ];
    this.getSchedule();
  }

  emailTriggered(date) {
    return new Date(date) < this.today;
  }
  public getSchedule() {
    this.configurationService.getSavedNotification().subscribe(resp => {
      this.upcomingMaintenance = resp || [];
    });
  }

  processString(str: string) {
    return str ? str.split(",").join(", ") : "";
  }

  openEdit(notification, mode) {
    this.mode = mode;
    this.editNotification = true;
    this.editDetails = notification;
  }
}
