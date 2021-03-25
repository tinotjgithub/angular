import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Component({
  selector: "app-audit-review-workflow",
  templateUrl: "./audit-review-workflow.component.html"
})
export class AuditReviewWorkflowComponent implements OnInit {
  ngOnInit() {}
  constructor(private authService: AuthenticationService) {}
}
