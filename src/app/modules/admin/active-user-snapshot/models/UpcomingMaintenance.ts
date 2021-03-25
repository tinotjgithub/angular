/* export interface  {
  maintenanceMessage: string;
  maintenanceFrom: string;
  maintenanceTo: string;
  fromTime: string;
  toTime: string;
} */

export interface UpComingMaintenance {
  maintenanceSubject: string;
  maintenanceMessage: string;
  maintenanceFrom: string;
  maintenanceTo: string;
  emailTriggerDate: string;
  recipients: string;
}
