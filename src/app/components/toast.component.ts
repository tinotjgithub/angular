import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  styles: [`
  :host ::ng-deep button {
      margin-right: .25em;
  }
  :host ::ng-deep .custom-toast .ui-toast-message {
      color: #fff!important;
      background: #ed394a;
      background: -webkit-linear-gradient(to right,#b52c39, #b52c39);
      background: linear-gradient(to right, #b52c39, #b52c39);
  }
  :host ::ng-deep .custom-toast .ui-toast-close-icon {
      color: #fff!important;
  }
  :host ::ng-deep .ui-toast{
  top: 15%;
  }
`]
})
export class ToastComponent {
  constructor(private messageService: MessageService) { }
}
