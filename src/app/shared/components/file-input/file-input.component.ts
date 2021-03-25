import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { NotifierService } from "src/app/services/notifier.service";
import { FILE_EXTENSIONS } from "src/app/modules/auditor/model/auditor.model";

@Component({
  selector: "app-file-input",
  templateUrl: "./file-input.component.html"
})
export class FileInputComponent implements OnInit, OnChanges {
  @Input()
  input: Array<any>;

  @Input()
  type: string;

  @Input()
  disableadd: boolean;

  @Input()
  disabledelete: boolean;

  @Input()
  disabledownload: boolean;

  @Input()
  disableupload: boolean;

  @Input()
  disabled: boolean;

  @Output()
  download: EventEmitter<any> = new EventEmitter();

  @Output()
  deleteFile: EventEmitter<any> = new EventEmitter();

  @Output()
  fileChange: EventEmitter<any> = new EventEmitter();

  @Input()
  maxNoOfFiles: number;

  @Input()
  enableRemoveEvent: boolean;

  @Input()
  codeFile: boolean;

  constructor(private notifierService: NotifierService) {}

  ngOnInit() {
    this.input = !this.input || this.input.length === 0 ? [""] : this.input;
  }

  ngOnChanges() {
    this.input = !this.input || this.input.length === 0 ? [""] : this.input;
  }

  getVal(val, i: number) {
    const files: any[] = val.target ? val.target.files : [];
    if (files.length > 0) {
      const fileNames = this.input.map(e => e.fileName);
      const size = files[0].size / 1024 / 1024;
      const fileName = String(files[0].name);
      const extension = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      );
      if (this.codeFile && size > 15) {
        this.notifierService.throwNotification({
          type: "warning",
          message: "File size should not be more than 15MB."
        });
        return;
      } else if (!this.codeFile && size > 2) {
        this.notifierService.throwNotification({
          type: "warning",
          message: "File size should not be more than 2MB."
        });
        return;
      }
      if (
        !this.type &&
        FILE_EXTENSIONS.indexOf(extension.toLowerCase()) === -1
      ) {
        this.notifierService.throwNotification({
          type: "warning",
          message:
            "The allowed file formats are jpg, png, excel, MS docs, text, pdf, zip."
        });
        return;
      }
      if (
        this.type === "bulk" &&
        !this.codeFile &&
        extension.toLowerCase() !== "csv" &&
        extension.toLowerCase() !== "xlsx"
      ) {
        this.notifierService.throwNotification({
          type: "warning",
          message: "Only csv and xlsx file formats allowed."
        });
        return;
      } else if (
        this.type === "bulk" &&
        this.codeFile &&
        extension.toLowerCase() !== "txt" &&
        extension.toLowerCase() !== "csv" &&
        extension.toLowerCase() !== "xlsx"
      ) {
        this.notifierService.throwNotification({
          type: "warning",
          message: "Only txt,csv and xlsx file formats are allowed."
        });
        return;
      }
      if (this.type === "template" && extension.toLowerCase() !== "xlsx") {
        this.notifierService.throwNotification({
          type: "warning",
          message: "Only .xlsx file format is allowed."
        });
        return;
      }

      if (fileNames.indexOf(files[0].name) > -1) {
        this.notifierService.throwNotification({
          type: "warning",
          message: "Already the file has been added."
        });
        return;
      }
      const fileReader: FileReader = new FileReader();
      fileReader.onload = reader => {
        const data = fileReader.result;
        this.input[i] = {
          fileName: files[0].name,
          data,
          value: files[0],
          index: i,
          local: true
        };
      };
      fileReader.readAsDataURL(files[0]);
      this.fileChange.emit();
    }
  }

  addFile() {
    if (this.disabled || this.checkValues()) {
      return;
    }
    this.input.push("");
  }

  removeFile(index: number) {
    if (this.disabled) {
      return;
    }
    if (this.input[index].local || !this.input[index]) {
      this.input.splice(index, 1);
      if (index === 0 && this.input.length < 1) {
        this.input.push("");
      }
      if (this.enableRemoveEvent) {
        this.deleteFile.emit(index);
      }
    } else {
      this.deleteFile.emit(index);
    }
  }

  downloadClick(input) {
    if (input.local) {
      const link = document.createElement("a");
      link.setAttribute("href", input.data);
      link.setAttribute("download", input.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.download.emit(input);
    }
  }

  checkValues() {
    const filteredArray = this.input.filter(e => e);
    return filteredArray.length !== this.input.length;
  }
}
