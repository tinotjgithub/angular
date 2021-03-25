import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { EnrollmentManagementService } from "src/app/services/enrollment-management/enrollment-management.service";

@Component({
  selector: "app-productivity-by-transaction",
  templateUrl: "./productivity-by-transaction.component.html"
})
export class ProductivityByTransactionComponent implements OnInit {
  enlargedDisplay = false;
  public isMyFinRendered = false;
  public myData = [["NO DATA", 0, 0, 0, 0]];
  public maxDate = new Date();
  public isValid = true;
  public myTitle = "";
  public myType = "LineChart";
  public isDataPresent = false;
  public myColumnNames = [
    "",
    "Transaction Count",
    { role: "annotation" },
    "Target",
    { role: "annotation" }
  ];
  public myWidth = 400;
  public myHeight = 225;
  public myOptions: any = {
    width: "100%",
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#e19b0e", "#b84066"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      gridlines: {
        count: 3
      },
      textStyle: {
        fontSize: 12
      }
    },

    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 30,
      right: 10,
      top: 17,
      bottom: 30
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 5,
    annotations: {
      textStyle: {
        fontSize: 10
      }
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 16
          }
        }
      }
    }
  };
  public myOptionsEnlarged: any = {
    tooltip: {
      trigger: "focus",
      showColorCode: true,
      textStyle: {
        fontSize: 12
      }
    },
    colors: ["#e19b0e", "#b84066"],
    hAxis: {
      title: "",
      type: "string",
      textStyle: {
        fontSize: 12
      }
    },
    vAxis: {
      minValue: 0,
      title: "",
      viewWindowMode: "explicit",
      viewWindow: {
        min: 0
      },
      gridlines: {
        count: 3
      },
      textStyle: {
        fontSize: 12
      }
    },

    legend: {
      position: "top",
      width: "50%",
      textStyle: {
        fontSize: 12
      }
    },
    chartArea: {
      left: 30,
      right: 10,
      top: 30,
      bottom: 40
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pointSize: 5,
    annotations: {
      textStyle: {
        fontSize: 11
      }
    },
    series: {
      0: {
        // series 0
        annotations: {
          stem: {
            length: 0
          }
        }
      },
      1: {
        // series 1
        annotations: {
          stem: {
            length: 16
          }
        }
      }
    }
  };
  public dateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private enrollmentService: EnrollmentManagementService
  ) {}

  ngOnInit() {
    const today = new Date();
    const todaysDate = new Date(this.datePipe.transform(today, "yyyy-MM-dd"));
    const defaultDateRange = [];
    defaultDateRange.push(todaysDate);
    defaultDateRange.push(todaysDate);
    this.dateForm = this.fb.group({
      dateRange: [defaultDateRange, [Validators.required, this.validateDates]]
    });
    this.getData();
  }

  getNoDataChart() {
    this.isDataPresent = false;
    this.myData = [["NO DATA", 0, 0, 0, 0]];
    this.myOptions.legend.position = "none";
    this.myOptionsEnlarged.legend.position = "none";
  }

  validateDates(control: AbstractControl) {
    const dateDifference = formValue => {
      const fromDate = new Date(formValue[0]);
      const toDate = new Date(formValue[1]);
      const diffInMonths =
        (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
        (toDate.getMonth() - fromDate.getMonth());
      return diffInMonths;
    };
    const fromDateValue = control.value;
    if (
      fromDateValue[1] &&
      fromDateValue[1] !== null &&
      fromDateValue[1] !== ""
    ) {
      const diffInMonths = dateDifference(fromDateValue);
      return diffInMonths < 6 ? null : { invalidDate: true };
    } else {
      return null;
    }
  }

  formatTime(time) {
    let hours = time;
    const meridiem = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const startTime = hours + meridiem;
    return startTime;
  }

  getData() {
    const value = this.dateForm.value.dateRange;
    const payload = {
      fromDate: this.datePipe.transform(value[0], "yyyy-MM-dd"),
      toDate: this.datePipe.transform(
        value[1] ? value[1] : value[0],
        "yyyy-MM-dd"
      )
    };
    this.myData = [["NO DATA", 0, 0, 0, 0]];
    this.enrollmentService
      .specialistProductivityByTransaction(payload)
      .subscribe(
        res => {
          if (res && res.length > 0) {
            this.myData = [];
            this.myOptions.legend.position = "top";
            this.myOptionsEnlarged.legend.position = "top";
            this.myOptions.width = res.length > 10 ? res.length * 50 : 500;
            if (res.length > 0) {
              this.isDataPresent = true;
              res.forEach(val => {
                this.myData.push([
                  this.formatTime(val.hour),
                  val.count,
                  val.count,
                  val.target,
                  val.target
                ]);
              });
            }
          } else {
            this.getNoDataChart();
          }
        },
        err => {
          this.getNoDataChart();
        }
      );
  }
}
