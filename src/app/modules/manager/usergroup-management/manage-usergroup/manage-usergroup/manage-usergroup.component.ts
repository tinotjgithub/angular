import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConfirmationService, SelectItem } from "primeng/api";
import { UsergroupManagementService } from "../../usergroup-management.service";
import UserGroup from "../models/UserGroup";
import { AuthenticationService } from "src/app/modules/authentication/services/authentication.service";
import { maxTarget } from "./../../../../../shared/constants";
import { NotifierService } from "src/app/services/notifier.service";
import { CryptoService } from "src/app/services/crypto-service/crypto.service";
import { ROLES } from "src/app/shared/constants.js";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-manage-usergroup",
  templateUrl: "./manage-usergroup.component.html"
})
export class ManageUsergroupComponent implements OnInit {
  userGroupForm: FormGroup;
  editing = false;
  filteredLeads: SelectItem[];
  managers: SelectItem[];
  leads: SelectItem[];
  quenames: SelectItem[];
  groupTypes: SelectItem[];
  leadSearchText = "Search...";
  selectedManager: any;
  userGroupList: UserGroup[];
  leadChanged = false;
  public queueIdList = [];
  public userGroupTypeList = [];
  public cols: any[];
  public currentRole: string;
  public isEnrollment: boolean;
  public addUserGroup: boolean;
  public currentUserGroupName = "";
  public managerType$: Subject<any>;
  public managrType = "";
  public userGroupListArray = [];
  public groupType = [];
  constructor(
    private fb: FormBuilder,
    private messageService: NotifierService,
    private secureLocalStorage: CryptoService,
    private confirmationService: ConfirmationService,
    private userGroupService: UsergroupManagementService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Form Initialize
    this.initializeForm();
    this.currentRole = this.secureLocalStorage.getItem("roleId");
    this.managrType = this.authService.managerType;
    this.setData();
    this.getManagerValues();
  }

  getManagerValues() {
    this.managerType$ = this.authService.managerTypeSubject;
    this.managerType$.subscribe(val => {
      this.managrType = val;
      this.setData();
    });
  }

  setColumns() {
    this.cols = [
      { field: "groupName", header: "User Group Name" },
      { field: "description", header: "Description" },
      { field: "managerName", header: "Manager Name" },
      { field: "leadName", header: "Lead Name" },
      { field: "queueName", header: "Queue Name" },
      { field: "target", header: "Target Count" },
      { field: "userGroupType", header: "User Group Type" }
    ];
  }

  setData() {
    this.setColumns();
    this.getUserGroups();
    this.getUserGroupTypes();
  }

  setGroupTypes(groupType) {
    this.groupTypes = [];
    if (groupType && groupType.length > 0) {
      groupType.forEach(typ => {
        if (this.managrType.toUpperCase() === "ENROLLMENT") {
          typ.label.toUpperCase() === "ENROLLMENT"
            ? this.groupTypes.push(typ)
            : "";
        } else {
          typ.label.toUpperCase() === "CLAIMS" ||
          typ.label.toUpperCase() === "CLAIM"
            ? this.groupTypes.push(typ)
            : "";
        }
      });
    }
  }

  getLeadsOnWorkItemChange(val) {
    const { value, label } = this.groupTypes.filter(el => el.value === val)[0];
    this.getMangers({ value, label });
    this.getQuenames({ value, label });
    const { managerName } = this.userGroupForm.value;
    this.getLeads(managerName, val);
  }

  preventInput(event) {
    const value = this.userGroupForm.get("target").value;
    if (value > maxTarget) {
      event.preventDefault();
      this.userGroupForm
        .get("target")
        .setValue(parseInt(value.toString().substring(0, 2), 10));
    }
  }

  confirmCancel() {
    this.cancelChanges();
  }

  confirmDelete(id) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to Delete User Group?",
      accept: () => {
        this.deleteUserGroup(id);
      }
    });
  }

  deleteUserGroup(id) {
    this.userGroupService.deleteUserGroupData(id);
  }

  getUserGroups() {
    this.userGroupList = [];
    this.queueIdList = [];
    this.userGroupTypeList = [];
    this.userGroupListArray = [];
    this.userGroupService.fetchAllUserGroups();
    this.userGroupList = this.userGroupService.userGroupList;
    this.userGroupService.getUserGroupListListener().subscribe(list => {
      this.userGroupListArray = list;
      this.parseUserGroup();
    });
  }

  parseUserGroup() {
    const listArray = this.userGroupListArray;
    if (listArray.length > 0) {
      listArray.forEach(grp => {
        this.queueIdList.push(grp.queueName.queueId);
        this.userGroupTypeList.push(grp.userGroupType.id);
        grp.queueName = grp.queueName.queueName
          ? grp.queueName.queueName
          : grp.queueName;
        grp.userGroupType = grp.userGroupType.name
          ? grp.userGroupType.name
          : grp.userGroupType;
      });
    }
    this.userGroupList = listArray;
  }

  onRowEditInit(data, index) {
    this.editing = true;
    this.loadForm(data, index);
  }

  deleteRow(data) {
    this.editing = false;
    this.confirmDelete(data.groupId);
  }

  cancelChanges() {
    this.editing = false;
    this.addUserGroup = false;
    this.initializeForm();
  }

  initializeForm() {
    this.leadSearchText = "Search...";
    this.userGroupForm = this.fb.group({
      groupId: [""],
      groupName: ["", [Validators.required, Validators.maxLength(30)]],
      description: ["", [Validators.required, Validators.maxLength(256)]],
      managerName: [this.authService.currentUserId, Validators.required],
      leadName: ["", Validators.required],
      queueName: [null],
      target: ["", [Validators.required, Validators.min(1)]],
      userGroupType: ["", Validators.required]
    });
  }

  queueNameCheck(value) {
    this.userGroupList.forEach((item, i) => {
      if (Number(item.groupId) !== Number(this.userGroupForm.value.groupId)) {
        if (Number(this.queueIdList[i]) === Number(value)) {
          this.confirmationService.confirm({
            acceptLabel: "OK",
            rejectLabel: "Cancel",
            message:
              "This Queue is Already Linked to Another User Group. Do You Wish to Proceed?",
            reject: () => {
              this.userGroupForm.patchValue({
                queueName: null
              });
            }
          });
        }
      }
    });
  }

  loadForm(data, index) {
    const userGroupTypeId = this.userGroupTypeList[index];
    const queueId = this.queueIdList[index];
    const {
      groupId,
      groupName,
      description,
      queueName,
      target,
      userGroupType,
      managerId,
      leadId
    } = data;
    this.currentUserGroupName = this.editing ? data.groupName : "";
    this.getLeads(managerId, userGroupTypeId);
    const value = userGroupTypeId;
    const label = userGroupType;
    this.getMangers({ value, label });
    this.getQuenames({ value, label });
    this.userGroupForm.patchValue({
      groupId,
      groupName,
      description,
      managerName: Number(managerId),
      leadName: Number(leadId),
      queueName: Number(queueId),
      target,
      userGroupType: Number(userGroupTypeId)
    });

    this.leadSearchText = this.leads
      ? [...this.leads].filter(item => {
          return item.value === leadId;
        })[0].label
      : this.leadSearchText;
  }

  onChangeManager(event) {
    const { userGroupType } = this.userGroupForm.value;
    if (event.value !== null || event.value !== "") {
      this.getLeads(event.value, userGroupType);
    }
  }

  onChangeLead(event) {
    this.leadChanged = true;
  }

  getMangers(userGroupType) {
    this.userGroupService.getAllManagers(userGroupType);
    this.managers = this.userGroupService.managersList;
    this.userGroupService.getManagersListListener().subscribe(data => {
      this.managers = data;
    });
  }

  getUserGroupTypes() {
    this.groupType = [];
    this.userGroupService.getAllUserGroupTypes();
    this.groupType = this.userGroupService.userGroupTypesList;
    this.userGroupService.getGroupTypeListListener().subscribe(data => {
      this.groupType = data;
      this.setGroupTypes(this.groupType);
    });
  }

  getQuenames(userGroupType) {
    this.userGroupService.getAllQueueNames(userGroupType);
    this.quenames = this.userGroupService.queueNamesList;
    this.userGroupService.getQueueNameListListener().subscribe(data => {
      this.quenames = data;
    });
  }

  getLeads(managerId, typeId) {
    this.userGroupService.getAllLeads(managerId, typeId);
    this.leads = this.userGroupService.leadsList;
    this.userGroupService.getLeadsListListener().subscribe(data => {
      this.leads = data;
    });
  }

  filterLead(event) {
    this.filteredLeads = [...this.leads].filter(item => {
      return item.label.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  submit() {
    const {
      groupId,
      groupName,
      description,
      managerName,
      leadName,
      queueName,
      target,
      userGroupType
    } = this.userGroupForm.value;

    const payload: UserGroup = {
      groupId: this.editing ? groupId : null,
      groupName,
      description,
      leadUserMaster: this.leadChanged ? leadName.value : leadName,
      managerUserMaster: managerName,
      queueName,
      target,
      userGroupType
    };
    if (!this.hasDuplicateGroupName(payload)) {
      this.userGroupService.saveUserGroupData(payload, this.editing);

      // Reset form
      this.initializeForm();
      this.editing = false;
      this.leadChanged = false;
      this.currentUserGroupName = "";
    } else {
      this.messageService.throwNotification({
        type: "error",
        message: "User Group Name already exist!!"
      });
    }
  }

  hasDuplicateGroupName(payload) {
    let hasDuplicate = false;
    this.userGroupList.forEach(list => {
      if (
        payload.groupName.toUpperCase() !==
          this.currentUserGroupName.toUpperCase() &&
        payload.groupName.toUpperCase() === list.groupName.toUpperCase()
      ) {
        hasDuplicate = true;
      }
    });
    return hasDuplicate;
  }

  getFormControl(controlName) {
    return this.userGroupForm.get(controlName);
  }
}
