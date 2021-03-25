import { Component, OnInit } from '@angular/core';
import { ClaimsChecklist } from '../model/auditor.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { AuditorService } from 'src/app/services/auditor/auditor.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html'
})
export class ChecklistComponent implements OnInit {

  public cols: any[];
  public selectedClaims: ClaimsChecklist = ClaimsChecklist.initialize();
  public claimsData: ClaimsChecklist = ClaimsChecklist.initialize();
  public checklistForm: FormGroup;
  public addChecklist: boolean;

  constructor(
    private fb: FormBuilder,
    private notifierService: NotifierService,
    private auditorService: AuditorService
  ) { }

  ngOnInit() {
    this.checklistForm = this.fb.group({
      type: ['', [Validators.required]],
      checkpoint: ['', [Validators.required, Validators.maxLength(32)]]
    });
    this.cols = [
      { field: 'checkpoint', header: 'Checkpoint'},
      { field: 'select', header: 'Select'},
    ];
    this.getChecklistItems();
  }

  getChecklistItems() {
    this.auditorService.getChecklist().subscribe(res => {
      this.claimsData = this.getChecklistValue(res);
    });
  }

  addCheckPoint() {
    if (this.checklistForm.invalid) {
      const message = (this.checklistForm.get('checkpoint').hasError('required') || this.checklistForm.get('type').hasError('required')) ?
      'Claim Type & Checkpoint Name are required.' : 'Checkpoint Name should be alphanumeric.';
      this.notifierService.throwNotification({
        type: 'warning',
        message
      });
      return;
    }
    if (!String(this.checklistForm.value.checkpoint).trim()) {
      this.notifierService.throwNotification({
        type: "warning",
        message: 'Claim Type & Checkpoint Name are required.',
      });
      return;
    }
    const payload = {
      checkpoints : {
        [this.checklistForm.value.type] : [String(this.checklistForm.value.checkpoint).trim()]
      }
    };
    this.auditorService.addChecklist(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Checkpoint successfully added!'
      });
      this.addChecklist = false;
      this.checklistForm.reset();
      this.claimsData = this.getChecklistValue(res);
    });
  }

  deleteChecklist(type) {
    const payload = {
      checkpoints: {
        [type]: this.selectedClaims[type]
      }
    };
    this.auditorService.removeChecklist(payload).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'Checkpoints successfully removed!'
      });
      this.claimsData = this.getChecklistValue(res);
      this.selectedClaims[type] = [];
    });
  }

  private getChecklistValue(res) {
    return (res && res.checkpoints) ? res.checkpoints : ClaimsChecklist.initialize();
  }
}
