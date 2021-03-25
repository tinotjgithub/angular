import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ClaimListComponent } from "./claim-list/claim-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogModule } from "primeng/dialog";
import { MessageService, ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { RouteClaimOverlayComponent } from "./route-claim-overlay/route-claim-overlay.component";
import { DropdownModule } from "primeng/dropdown";

const routes: Routes = [
  {
    path: "",
    component: ClaimListComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "ClaimRouting",
    component: ClaimListComponent,
    data: {
      breadcrumb: []
    }
  },
  {
    path: "RouteMyClaim",
    component: RouteClaimOverlayComponent,
    data: {
      breadcrumb: [{ label: "Route To" }]
    }
  }
];

@NgModule({
  declarations: [ClaimListComponent, RouteClaimOverlayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgbModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ClaimRoutingModule {}
