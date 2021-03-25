import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-report-table",
  templateUrl: "./report-table.component.html"
})
export class ReportTableComponent implements OnInit {
  @Input()
  columns: any[];

  @Input()
  header: string;

  @Input()
  data: any[];

  @Input()
  isChart: boolean;

  @Output()
  exportExcel: EventEmitter<boolean> = new EventEmitter();

  @Output()
  rowData: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onRowSelect(event) {
    this.rowData.emit({ event });
  }

  downloadExcel() {
    this.exportExcel.emit(true);
  }
}
