import { DatePipe } from '@angular/common';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-sla-config-enrollment',
  templateUrl: './sla-config-enrollment.component.html'
})
export class SlaConfigEnrollmentComponent implements OnInit {

  public addForm: FormGroup
  public addContext;
  public editForm: FormGroup;
  public editSLA: boolean;
  public editContext;
  public requestTypes: any[];
  public slaData: any[];
  public workCategory: any;
  public today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private enrollmentService: EnrollmentManagementService,
    private notifierService: NotifierService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.addForm = this.createForm(false);
    this.editForm = this.createForm(true);
    this.addContext = { form: this.addForm, edit: false };
    this.editContext = { form: this.editForm, edit: true };
    this.getRequestType();
  }

  getRequestType() {
    this.requestTypes = [];
    this.enrollmentService.getUserWorkItemTypes().subscribe(res => {
      this.requestTypes = res ? res : [];
      if (this.requestTypes.length > 0) {
        this.workCategory = this.requestTypes[0].id;
        this.getWorkCategorySLAs(this.requestTypes[0].id);
      }
    });
  }

  getWorkCategorySLAs(workCategoryId) {
    this.slaData = [];
    this.enrollmentService.getWorkCategorySLAs(Number(workCategoryId)).subscribe(res => {
      this.slaData = [];
      if (res) {
        const array: any[] = res.enrollmentSLATargets;
        this.slaData = array.length > 0 ? array.map(e => {
          return {
            ...e,
            ...this.getDisplayDate(e.fromDate, e.toDate)
          }
        }) : [];
      }
    })
  }

  createForm(isEdit: boolean) {
    const group = this.formBuilder.group({
      workCategory: [null, [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      count: ['', [Validators.required, Validators.maxLength(3)]]
    });
    if (isEdit) {
      group.addControl('id', new FormControl('', [Validators.required]));
    }
    group.controls.from.valueChanges.subscribe((val: Date) => {
      const toValue: Date = group.value.to;
      if (val && toValue) {
        const clearToDate = val.getFullYear() > toValue.getFullYear() ? true :
          (val.getFullYear() === toValue.getFullYear() ?
          (val.getMonth() > toValue.getMonth()) : false);
        if (clearToDate) {
          group.controls.to.setValue(null);
        }
      } else {
        group.controls.to.setValue(null);
      }
    });
    return group;
  }

  preventInput(event, form: FormGroup) {
    form.patchValue({
      count: event.target.value.replace(/[^0-9]/g, '')
    });
  }

  addSla() {
    if (this.addForm.invalid) {
      return;
    }
    const {workCategory, from, to, count} = this.addForm.value;
    const payload = {
      fromDate: this.getFormattedDate(from),
      toDate: this.getFormattedDate(to, true),
      slaCount: Number(count),
      workCategoryId: Number(workCategory),
    };
    this.enrollmentService.saveSlaConfig(payload).subscribe(res => {
      this.addForm.reset();
      this.getWorkCategorySLAs(Number(workCategory));
      this.notifierService.throwNotification({
        type: 'success',
        message: 'SLA added successfully.'
      });
    });
  }

  editSla() {
    if (this.editForm.invalid) {
      return;
    }
    const {workCategory, from, to, count, id} = this.editForm.value;
    const selectedWorkCategory = this.requestTypes.filter(e => e.id === Number(workCategory));
    const payload = {
      id,
      fromDate: this.getFormattedDate(from),
      toDate: this.getFormattedDate(to, true),
      slaCount: Number(count),
      workCategoryId: Number(workCategory),
      workCategoryName: selectedWorkCategory[0] ? selectedWorkCategory[0].name : ''
    };
    this.enrollmentService.updateSlaConfig(payload).subscribe(res => {
      this.editForm.reset();
      this.getWorkCategorySLAs(Number(workCategory));
      this.notifierService.throwNotification({
        type: 'success',
        message: 'SLA updated successfully.'
      });
      this.editSLA = false;
    });
  }

  getFormattedDate(date, lastDate?: boolean) {
    const d = new Date(date);
    const calcDate = lastDate ? new Date(d.getFullYear(), d.getMonth() + 1, 0) : d;
    const year = calcDate.getFullYear();
    const month = (1 + calcDate.getMonth()).toString().padStart(2, "0");
    const day = calcDate
      .getDate()
      .toString()
      .padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  showEdit(sla) {
    console.log(sla)
    this.editForm.patchValue({
      workCategory: sla.workCategoryId,
      from: new Date(sla.fromDate),
      to: new Date(sla.toDate),
      count: sla.slaCount,
      id: sla.id
    });
    this.editSLA = true;
  }

  deleteSla(sla) {
    this.enrollmentService.deleteWorkCategorySLA(sla.id).subscribe(res => {
      this.notifierService.throwNotification({
        type: 'success',
        message: 'SLA deleted successfully.'
      });
      this.getWorkCategorySLAs(this.workCategory);
    });
  }

  cancelOperation(form: FormGroup, isEdit: boolean) {
    !isEdit ? (form.dirty ? form.reset() : '') : (this.editSLA = false);
  }

  getDisplayDate(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    let strFormat = ''
    let year = ''
    if (fromDate.getFullYear() === toDate.getFullYear()) {
      strFormat = (fromDate.getMonth() === toDate.getMonth()) ? 
        `${this.datePipe.transform(fromDate, 'MMM')}` 
        : `${this.datePipe.transform(fromDate, 'MMM')} - ${this.datePipe.transform(toDate, 'MMM')}`;
        year = `${fromDate.getFullYear()}`;
    } else {
     strFormat = `${this.datePipe.transform(fromDate, 'MMM y')} - ${this.datePipe.transform(toDate, 'MMM y')}`
    }
    return {strFormat, year};
  }

}
