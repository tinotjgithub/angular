import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { YesNoModelComponent } from "./yes-no-model/yes-no-model.component";
import { MessageService } from "primeng/api";
import { FileInputComponent } from "./file-input/file-input.component";
import { TooltipModule } from "primeng/tooltip";
import { LoaderComponent } from "./loader/loader.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { GoogleChartsModule } from "angular-google-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
// tslint:disable-next-line: max-line-length
import { ClaimsOpenInventoryViewComponent } from "src/app/modules/manager/manager-dash-board/claims-manager-dashboard/claims-open-inventory-view/claims-open-inventory-view.component";
// tslint:disable-next-line: max-line-length
import { ClaimsNearingThreasholdSlaComponent } from "src/app/modules/manager/manager-dash-board/claims-manager-dashboard/claims-nearing-threashold-sla/claims-nearing-threashold-sla.component";
// tslint:disable-next-line: max-line-length
import { ClaimsOpenInventorySlaComponent } from "src/app/modules/manager/manager-dash-board/claims-manager-dashboard/claims-open-inventory-sla/claims-open-inventory-sla.component";
const components = [
  YesNoModelComponent,
  FileInputComponent,
  LoaderComponent,
  ClaimsOpenInventorySlaComponent,
  ClaimsOpenInventoryViewComponent,
  ClaimsNearingThreasholdSlaComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    MessageModule,
    MessagesModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    TableModule,
    ProgressSpinnerModule
  ],
  exports: [...components],
  providers: [MessageService]
})
export class ComponentsModule {}
