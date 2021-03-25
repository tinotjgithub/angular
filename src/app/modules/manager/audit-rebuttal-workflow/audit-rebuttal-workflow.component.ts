import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";

@Component({
  selector: "app-audit-rebuttal-workflow",
  templateUrl: "./audit-rebuttal-workflow.component.html"
})
export class AuditRebuttalWorkflowComponent implements OnInit {
  ngOnInit() {}
  constructor(private authService: AuthenticationService) {}
}
