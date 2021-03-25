import { Component, OnInit } from '@angular/core';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { WorkCategory } from '../modal';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-manage-work-category',
  templateUrl: './manage-work-category.component.html',
  styleUrls: ['./manage-work-category.component.css']
})
export class ManageWorkCategoryComponent implements OnInit {

  public workCategory: WorkCategory[];

  constructor(
    private enrollmentService: EnrollmentManagementService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.getWorkCategory();
  }

  getWorkCategory() {
    this.workCategory = [];
    this.enrollmentService.getWorkCategory().subscribe(res => {
      this.workCategory = res;
    });
  }

  updateStatus(workCat: WorkCategory, event) {
    this.enrollmentService.updateWorkCategory(workCat.id, event).subscribe(res => {
      this.notifierService.throwNotification({
        type: "success",
        message: "Successfully updated the status.",
      })
      this.getWorkCategory();
    });
  }

}
