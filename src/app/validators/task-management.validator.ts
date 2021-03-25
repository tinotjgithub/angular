import { AbstractControl } from "@angular/forms";

export function conditionallyRequiredMonthValidator(control: AbstractControl) {
    if (control.value === 3) {
        return { month: true };
    }
    return null;
    return null;
}
