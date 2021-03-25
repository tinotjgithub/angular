import { Component, OnInit } from "@angular/core";
import { EnableAuditChecklistService } from "../../service/enable-audit-checklist.service";
import { NotifierService } from "src/app/services/notifier.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-enable-audit-checklist",
  templateUrl: "./enable-audit-checklist.component.html",
  styleUrls: ["./enable-audit-checklist.component.css"]
})
export class EnableAuditChecklistComponent implements OnInit {
  savedConfig: any;
  myModal: {};
  workCategories: WorkCategory[];
  constructor(
    private checklistService: EnableAuditChecklistService,
    private messageService: NotifierService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.checklistService.getEnableFlag().subscribe(res => {
      this.setModalClass(res);
    });
  }

  setModalClass(res: WorkCategory[] = []) {
    this.workCategories = res;
    const obj = new Object();
    res.map(el => {
      obj[el.workCategory] = el.enabled;
    });
    this.savedConfig = obj;
  }

  onChangeAuditConfig(ev, workCategory) {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to " +
        (ev.checked ? "enable" : "disable") +
        " Audit checklist for " +
        workCategory,
      accept: () => {
        this.checklistService
          .updateFlag({
            workCategory,
            enabled: ev.checked
          })
          .subscribe(res => {
            this.setModalClass(res);
            this.messageService.throwNotification({
              type: "info",
              message: "Audit Checklist Status Updated for " + workCategory
            });
          });
      },
      reject: () => {
        this.savedConfig[workCategory] = !this.savedConfig[workCategory];
      }
    });
  }
}

class WorkCategory {
  workCategory: string;
  enabled: boolean;
}
