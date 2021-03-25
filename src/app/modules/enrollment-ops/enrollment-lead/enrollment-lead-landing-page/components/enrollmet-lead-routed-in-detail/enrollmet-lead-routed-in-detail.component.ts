import {
  Component,
  OnInit,
  ViewChild,
  Input
} from "@angular/core";
import { Table } from "primeng/table";
import { Router } from "@angular/router";
import { EmrollmentLeadLandingPageService } from "../../services/emrollment-lead-landing-page.service";

@Component({
  selector: "app-enrollmet-lead-routed-in-detail",
  templateUrl: "./enrollmet-lead-routed-in-detail.component.html",
  styleUrls: ["./enrollmet-lead-routed-in-detail.component.css"]
})
export class EnrollmetLeadRoutedInDetailComponent implements OnInit {
  @ViewChild("claimsTable", { static: false }) claimsTable: Table;
  @Input() ngSwitch;
  cols: { field: string; header: string }[];
  numberOfClaims: any = 0;
  routeReasonOptions: Array<any> = [];
  routedClaimList: any[];
  routeReasonList: Array<{
    routeReasonCode: number;
    routeReason: string;
  }> = [];
  public routeReasonOption: any;
  constructor(
    private router: Router,
    private service: EmrollmentLeadLandingPageService
  ) {}

  ngOnInit() {
    this.getColumns();
    this.getRoutedClaims();
  }

  getColumns() {
    this.cols = [
      { field: "slNo", header: "Sl No." },
      { field: "subscriptionId", header: "Subscription ID" },
      { field: "specialistName", header: "Specialist Name." },
      { field: "assignType", header: "Assign Type" },
      { field: "transactionType", header: "Transaction Type" },
      { field: "requestType", header: "Request Type" },
      { field: "routeReason", header: "Route Reason" },
      { field: "routedInDate", header: "Routed In Date" },
      { field: "routedFromName", header: "Routed From Name" },
      { field: "recordAge", header: "Record Age (In Days)" },
      { field: "subscriberName", header: "Subscriber Name" },
      { field: "memberGroupName", header: "Member Group Name" },
      { field: "memberID", header: "Member ID" },
      { field: "memberLastName", header: "Member last Name" },
      { field: "memberFirstName", header: "Member First Name" },
      { field: "memberDOB", header: "Member DOB" },
      { field: "subscriberRelationship", header: "Relation To Subscriber" },
      { field: "benefitPlanName", header: "Benefit Plan/ID Name" },
      { field: "benefitPlanStartDate", header: "Benefit Plan Start Date" },
      { field: "benefitPlanEndDate", header: "Benefit Plan End Date" },
      { field: "userGroupName", header: "User Group Name" },
      { field: "errorDetails", header: "Error Details" }
    ];

    this.routeReasonOptions = [
      { label: "All", value: null },
      { label: "Already Routed Claim", value: "Already Routed Claim" },
      { label: "Incorrect Assignment", value: "Incorrect Assignment" },
      { label: "Approval Required", value: "Approval Required" },
      { label: "Pending Claim", value: "Pending Claim" },
      { label: "Pending For Long Time", value: "Pending For Long Time" },
      {
        label: "Review to Medical Management",
        value: "Review to Medical Management"
      },
      { label: "Unidentified claim type", value: "Unidentified claim type" },
      { label: "Approval is Required", value: "Approval is Required" },
      { label: "Incorrect assigne", value: "Incorrect assigne" },
      { label: "Missing ID", value: "Missing ID" },
      { label: "Missing configuration", value: "Missing configuration" }
    ];
  }

  tableFilter(claimsTable, value, field, matchMode) {
    claimsTable.filter(value, field, matchMode);
  }

  getRoutedClaims() {
    this.service.getRoutedInDetails().subscribe(res => {
      this.routedClaimList = res;
    });
  }

  onRowEditInit(data) {
    this.router.navigate(["/ClaimRouting/RouteMyClaim"], {
      queryParams: data,
      skipLocationChange: true
    });
  }
} 
