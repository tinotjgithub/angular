import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendbackReasonComponent } from './sendback-reason.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { BaseHttpService } from 'src/app/services/base-http.service';
import { MockBaseHttpService } from 'src/app/mocks/base-http.mock';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { TaskmanagementService } from 'src/app/services/task-management/taskmanagement.service';
import { of, throwError } from 'rxjs';
import { SendBackReason } from 'src/app/services/task-management/models/SendBackReason';
import { NotifierService } from 'src/app/services/notifier.service';

class MockTaskService extends TaskmanagementService {
  getAllSendBackReasons() {
    return of(null);
  }
};

describe('SendbackReasonComponent', () => {
  let component: SendbackReasonComponent;
  let fixture: ComponentFixture<SendbackReasonComponent>;
  let service: TaskmanagementService;
  let notifierService: NotifierService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendbackReasonComponent ],
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ConfirmDialogModule,
        CheckboxModule,
        DropdownModule,
        InputTextModule,
        TableModule,
        TooltipModule,
        CardModule,
        MessageModule
      ],
      providers: [
        { provide: BaseHttpService, useClass: MockBaseHttpService },
        { provide: TaskmanagementService, useClass: MockTaskService },
        MessageService,
        ConfirmationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendbackReasonComponent);
    service = fixture.debugElement.injector.get(TaskmanagementService);
    notifierService = fixture.debugElement.injector.get(NotifierService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get sendback Reason', () => {
    spyOn(service, 'getAllSendBackReasons').and.returnValue(of({
      sendBackReasonDtos: [
       {
        sendBackReason: 'test',
        sendBackReasonCode: 1
      }
      ]
    }));
    component.getSendBackReasons();
    expect(component.sendBackList.length).toEqual(1);
  });

  it('should validate sendback Reason', () => {
    component.sendBackReasonChange(null);
    component.validateSendBackReason(null);
    expect(component.isValid).toBeFalsy();
    component.sendBackList = [];
    component.validateSendBackReason('Test');
    expect(component.isValid).toBeTruthy();
    component.sendBackList = [
      {
        sendBackReason: 'Test'
      }
    ];
    component.sendBackReasonGroup.patchValue({
      sendBackReason: 'Test'
    });
    component.addSendBackReason();
    expect(component.isValid).toBeFalsy();
  });

  it('should add sendback Reason', () => {
    component.sendBackList = [];
    const spied = spyOn(service, 'getAllSendBackReasons').and.returnValue(of({
      sendBackReasonDtos: []
    }));
    spyOn(service, 'addSendBackReason').and.returnValue(of(null));
    component.sendBackReasonGroup.patchValue({
      sendBackReason: 'Test'
    });
    component.addSendBackReason();
    expect(spied).toHaveBeenCalled();
  });

  it('should delete sendback Reason', () => {
    component.sendBackReasonList = [
      {
        sendBackReasonCode: 1,
        sendBackReason: 'Test'
      }
    ];
    const spied = spyOn(service, 'getAllSendBackReasons').and.returnValue(of({
      sendBackReasonDtos: []
    }));
    spyOn(service, 'deleteSendBackReason').and.returnValue(of(null));
    component.deleteRow(0);
    expect(spied).toHaveBeenCalled();
  });

  it('onRowEditInit', () => {
    component.onRowEditInit({
      sendBackReason: 'test',
      sendBackReasonCode: 1
    }, 0);
    expect(component.sendBackReasonArray[0]).toEqual({
      sendBackReason: 'test',
      sendBackReasonCode: 1
    });
  });

  it('OnRowSave Null', () => {
    const spi = spyOn(notifierService, 'throwNotification');
    let sendBack: SendBackReason = {
      sendBackReasonCode: 1,
      sendBackReason: ''
    };
    component.onRowEditSave(sendBack, 0);
    sendBack = {
      sendBackReasonCode: 1,
      sendBackReason: ' '
    };
    component.onRowEditSave(sendBack, 0);
    expect(spi).toHaveBeenCalled();
  });

  it('OnRowSave Duplicate', () => {
    const spi = spyOn(notifierService, 'throwNotification');
    const copy = [
      {
        sendBackReasonCode: 1,
        sendBackReason: "Test",
      },
      {
        sendBackReasonCode: 2,
        sendBackReason: 'Test 1'
      }
    ];
    component.sendBackReasonListCopy = copy;
    component.sendBackCopy = copy;
    let sendBack: SendBackReason = {
      sendBackReasonCode: 1,
      sendBackReason: 'Test 1'
    };
    component.onRowEditSave(sendBack, 0);
    expect(spi).toHaveBeenCalled();
  });

  it('OnRowSave Valid', () => {
    const spi = spyOn(service, 'updateSendBackReason').and.returnValue(of(true));
    component.sendBackCopy = [];
    component.sendBackReasonArray = {
      0: {
        sendBackReasonCode: 1,
        sendBackReason: 'Test 1'
      }
    };
    let sendBack: SendBackReason = {
      sendBackReasonCode: 1,
      sendBackReason: 'Test 1'
    };
    component.onRowEditSave(sendBack, 0);
    expect(spi).not.toHaveBeenCalled();
    component.sendBackReasonArray = {
      0: {
        sendBackReasonCode: 1,
        sendBackReason: 'Test 1'
      }
    };
    sendBack.sendBackReason = 'Test';
    component.onRowEditSave(sendBack, 0);
    expect(spi).toHaveBeenCalled();
  });

  it('OnRowSave Valid - err', () => {
    const spi = spyOn(service, 'updateSendBackReason').and.returnValue(throwError(null));
    component.sendBackCopy = [];
    component.sendBackReasonList = [
      {
        sendBackReasonCode: 1,
        sendBackReason: 'Test 1' 
      }
    ];
    component.sendBackReasonArray = {
      0: {
        sendBackReasonCode: 1,
        sendBackReason: 'Test 1'
      }
    };
    let sendBack: SendBackReason = {
      sendBackReasonCode: 1,
      sendBackReason: 'Test'
    };
    component.onRowEditSave(sendBack, 0);
    expect(spi).toHaveBeenCalled();
  });

  it('OnRowCancel', () => {
    component.sendBackReasonList = [
      {
        sendBackReasonCode: 1,
        sendBackReason: 'Test' 
      }
    ];
    component.sendBackReasonArray = {
      0: {
        sendBackReasonCode: 1,
        sendBackReason: 'Test 1'
      }
    };
    component.onRowEditCancel(0)
    expect(component.sendBackReasonList[0].sendBackReason).toEqual('Test 1');
  });
});
