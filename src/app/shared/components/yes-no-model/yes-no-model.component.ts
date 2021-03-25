import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-yes-no-model",
  templateUrl: "./yes-no-model.component.html"
})
export class YesNoModelComponent implements OnInit {
  @Output() yesEvent = new EventEmitter<string>();
  @Output() noEvent = new EventEmitter<string>();

  @Input() modalTitle: string;
  @Input() modalBody: string;
  @Input() modalYesButtonText: string;
  @Input() modalNoButtonText: string;
  @Input() modeId: string;


  constructor() {}

  ngOnInit() {
  }

  callParentWithYes() {
    this.yesEvent.emit('yes');
  }

  callParentWithNo() {
    this.noEvent.emit('no');
  }
}
