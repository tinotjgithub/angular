import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FileInputComponent } from "./file-input.component";
import { NotifierService } from "src/app/services/notifier.service";

class MockFileReader {
  onload;
  result;

  constructor() {}
  readAsDataURL(file) {
    this.result = file;
    this.onload();
  }
}

describe("FileInputComponent", () => {
  let component: FileInputComponent;
  let fixture: ComponentFixture<FileInputComponent>;
  const getFile = (
    name = "file.txt",
    size = 1024,
    type = "plain/txt",
    lastModified = new Date()
  ) => {
    const blob = new Blob(["a".repeat(size)], { type });
    blob[`lastModifiedDate`] = lastModified;
    return new File([blob], name);
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit", () => {
    component.input = [];
    component.ngOnInit();
    expect(component.input).toEqual([""]);
    component.input = ["FileOne"];
    component.ngOnInit();
    expect(component.input).toEqual(["FileOne"]);
  });
  it("ngOnChanges", () => {
    component.input = [];
    component.ngOnChanges();
    expect(component.input).toEqual([""]);
    component.input = ["FileOne"];
    component.ngOnChanges();
    expect(component.input).toEqual(["FileOne"]);
  });

  it("getVal", () => {
    let fakeF = getFile("file.txt", 3e6, "plain/txt", new Date());
    let target = {
      target: {
        files: [fakeF]
      }
    };
    component.input = [
      {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.txt"
      }
    ];
    const notifierService = fixture.debugElement.injector.get(NotifierService);
    const spy = spyOn(notifierService, "throwNotification");
    component.getVal(target, 1);
    expect(spy).toHaveBeenCalledWith({
      type: "warning",
      message: "File size should not be more than 2MB."
    });

    fakeF = getFile("file.sms", 1024, "plain/txt", new Date());
    target = {
      target: {
        files: [fakeF]
      }
    };
    component.getVal(target, 1);
    expect(spy).toHaveBeenCalledWith({
      type: "warning",
      message:
        "The allowed file formats are jpg, png, excel, MS docs, text, pdf, zip."
    });

    fakeF = getFile(
      "Institutional_IP__Claim_Validation_Rules.txt",
      1024,
      "plain/txt",
      new Date()
    );

    target = {
      target: {
        files: [fakeF]
      }
    };
    component.getVal(target, 1);
    expect(spy).toHaveBeenCalledWith({
      type: "warning",
      message: "Already the file has been added."
    });
  });

  it("addFile", () => {
    component.input = [];
    component.disabled = true;
    component.addFile();
    expect(component.input).toEqual([]);
    component.disabled = false;
    component.addFile();
    expect(component.input).toEqual([""]);
  });

  it("removeFile", () => {
    component.input = [
      {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.txt",
        local: true
      }
    ];
    component.disabled = true;
    component.removeFile(0);
    expect(component.input).toEqual([
      {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.txt",
        local: true
      }
    ]);

    component.disabled = false;
    component.removeFile(0);
    expect(component.input).toEqual([""]);
    component.input = [
      {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.txt"
      }
    ];
    const spy = spyOn(component.deleteFile, "emit");
    component.removeFile(0);
    expect(spy).toHaveBeenCalled();
  });

  it("downloadClick", () => {
    const input = {
      filePosition: "attachmentOne",
      fileId: 29,
      fileName: "Institutional_IP__Claim_Validation_Rules.txt",
      local: true
    };
    component.downloadClick(input);
    const spy = spyOn(component.download, "emit");

    expect(spy).not.toHaveBeenCalled();
    const input1 = {
      filePosition: "attachmentOne",
      fileId: 29,
      fileName: "Institutional_IP__Claim_Validation_Rules.txt"
    };
    component.downloadClick(input1);
    expect(spy).toHaveBeenCalled();
  });

  it("checkValues", () => {
    component.input = [
      {
        filePosition: "attachmentOne",
        fileId: 29,
        fileName: "Institutional_IP__Claim_Validation_Rules.txt",
        local: false
      }
    ];
    expect(component.checkValues()).toBeFalsy();
  });

  it("get val - empty", () => {
    component.getVal('', 1);
    expect(component.input.length).toEqual(1);
    const val = {
      target: {
        files: [
          {
            name: 'test.xls',
            size: 123
          }
        ]
      }
    };
    component.type = "bulk";
    component.getVal(val, 1);
    expect(component.input.length).toEqual(1);
    const dummyFileReader = new MockFileReader();
    spyOn<any>(window, "FileReader").and.returnValue(dummyFileReader);
    component.type = '';
    component.getVal(val, 0);
    component.input = [
      {
        local: true
      },
      {
        local: true
      }
    ];
    component.removeFile(0);
    expect(component.input.length).toEqual(1);
  });
});
