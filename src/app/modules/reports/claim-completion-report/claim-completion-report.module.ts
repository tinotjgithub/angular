import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClaimCompletionReportComponent } from "./claim-completion-report/claim-completion-report.component";
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "primeng/tooltip";
import { MultiSelectModule } from "primeng/multiselect";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MessageModule } from "primeng/message";

@NgModule({
  declarations: [ClaimCompletionReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    TableModule,
    MultiSelectModule,
    ComponentsModule,
    CalendarModule,
    DropdownModule,
    MessageModule
  ],
  exports: [ClaimCompletionReportComponent]
})
export class ClaimCompletionReportModule {}
