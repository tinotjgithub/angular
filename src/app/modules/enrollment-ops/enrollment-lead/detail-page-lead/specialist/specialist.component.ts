import { Component, OnInit } from '@angular/core';
import { EmrollmentLeadLandingPageService } from '../../enrollment-lead-landing-page/services/emrollment-lead-landing-page.service';

@Component({
  selector: 'app-specialist',
  templateUrl: './specialist.component.html',
  styleUrls: ['./specialist.component.css']
})
export class SpecialistComponent implements OnInit {

  public cols: any[];
  public gridData: any[];

  constructor(private service: EmrollmentLeadLandingPageService) { }

  ngOnInit() {
    this.cols = [
      { header: "First Name", field: "firstName", visible: true },
      { header: "Last Name", field: "lastName", visible: true },
      { header: "User Name", field: "userName", visible: true },
      { header: "Active Date", field: "activeDate", visible: true },
      { header: "Deactivation Date", field: "deactivationDate", visible: true },
      { header: "Current status", field: "currentStatus", visible: true },
      { header: "Proficiency", field: "proficiency", visible: true },
      { header: "LDAP/Local user", field: "ldapOrLocal", visible: true },
      { header: "User Group Name", field: "userGroupName", visible: true },
    ];
    this.getData();
  }

  getData() {
    this.gridData = [];
    this.service.getDeatilsSpecialist().subscribe(res => {
      this.gridData =  res;
    });
  }

}
