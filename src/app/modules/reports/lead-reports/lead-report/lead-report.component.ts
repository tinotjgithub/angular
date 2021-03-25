import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html'
})
export class LeadReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollItemToView(id: string) {
    document.getElementById(id).scrollIntoView();
  }

}
