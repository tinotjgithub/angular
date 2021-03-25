import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { NotifierService } from 'src/app/services/notifier.service';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentManagementService } from 'src/app/services/enrollment-management/enrollment-management.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-configure-transaction-category',
  templateUrl: './configure-transaction-category.component.html',
  styleUrls: []
})
export class ConfigureTransactionCategoryComponent implements OnInit {

  public category: string;
  public categoryList: any[] = [];
  private categoryListCopy: any[] = [];
  public cols: any [];
  selectedCategory: any;
  @ViewChild('reasonTable', {static: false})
  public table: Table;

  constructor(
    private notifierService: NotifierService,
    private enrollmentService: EnrollmentManagementService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.cols = [{header: 'Transaction Category', field: 'category'}];
    this.getCategory();
  }

  addReason() {
    if (this.checkReasonValidation(this.category, this.categoryList)) {
      this.enrollmentService.addTransactionCategory(this.category).subscribe(res => {
        this.category = "";
        this.notifierService.throwNotification({
          type: "info",
          message: "Transaction Category Added."
        });
        this.getCategory();
      });
    }
  }

  checkDuplicate(category: string, list: any[]) {
    const categories = list.map(e => String(e.category).toLowerCase().trim());
    return categories.indexOf(category.toLowerCase().trim()) > -1;
  }

  getCategory() {
    this.categoryList = [];
    this.enrollmentService.getTransactionCategory().subscribe(res => {
      this.categoryList = res || [];
      this.categoryListCopy = this.categoryList.map(x => Object.assign({}, x));
    });
  }

  onRowEditInit(row, index) {
    this.selectedCategory = {...this.selectedCategory, [row.transactionCategoryCode]: {...row}};
  }

  onRowEditCancel(row, index) {
    this.categoryList[index] = this.selectedCategory[row.transactionCategoryCode];
    delete this.selectedCategory[row.transactionCategoryCode];
  }

  onRowEditSave(row, index) {
    const category = row.category;
    const list = this.categoryList.filter(e => e.transactionCategoryCode !== row.transactionCategoryCode);
    if (this.checkReasonValidation(category, list, true, index, row.transactionCategoryCode)) {
      const currentCategory = this.selectedCategory[row.transactionCategoryCode];
      if (currentCategory.category !== category) {
        this.enrollmentService.updateTransactionCategory(row.transactionCategoryCode, category).subscribe(res => {
          this.notifierService.throwNotification({
            type: "info",
            message: "Transaction Category Modified."
          });
          this.getCategory();
        }, err => {
          this.categoryList[index] = currentCategory;
          delete this.selectedCategory[row.transactionCategoryCode];
        });
      }
    } else {
      return;
    }
  }

  checkReasonValidation(category: string, list: any[], editing?, index?, code?) {
    if (!(category && category.trim())) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Category Cannot Be Empty."
      });
      if (editing) {
        this.categoryList[index] = {...this.selectedCategory[code]};
      } else {
        this.category = "";
      }
      return false;
    } else if (this.checkDuplicate(category, list)) {
      this.notifierService.throwNotification({
        type: "error",
        message: "Category Already Exists."
      });
      if (editing) {
        this.categoryList[index] = {...this.selectedCategory[code]};
      }
      return false;
    }
    return true;
  }

  deleteRow(index) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this transaction category?",
      accept: () => {
        this.enrollmentService.deleteTransactionCategory(this.categoryList[index].transactionCategoryCode).subscribe(res => {
          this.notifierService.throwNotification({
            type: "info",
            message: "Transaction Category Deleted."
          });
          this.getCategory();
        });
      }
    });
  }

  checkIfEdited() {
    const reasonList = this.categoryList;
    let objectsAreSame = false;
    if (this.categoryListCopy.length !== reasonList.length) {
      objectsAreSame = true;
    } else {
      for (const obj of this.categoryListCopy) {
        const code = obj.transactionCategoryCode;
        const filtered = reasonList.filter(o => o.transactionCategoryCode === code);
        if (filtered.length > 0) {
          const reason = filtered[0].category;
          if (reason !== obj.category) {
            objectsAreSame = true;
          }
        } else {
          const reasons = reasonList.map(e => String(e.category).toLowerCase().trim());
          if (reasons.indexOf(String(obj.category).toLowerCase().trim()) === -1) {
            objectsAreSame = true;
          }
        }
      }
    }
    return objectsAreSame;
  }

  filteTable(value) {
    if (this.categoryList.length > 0) {
      this.table.filterGlobal(value, 'contains');
    }
  }

}
