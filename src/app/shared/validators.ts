import { AbstractControl } from "@angular/forms";

const SPECIAL_CHARACTERS_MINIMAL = /[-;',:&@#*()_+:"~.\/]/;
const EMAIL_REGEX = /^([\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})$/;
const NUMBER_REGEX = /^\d+$/;
const NUM_REGEX = /^-?[0-9]\d*(\.\d+)?$/;
const NAME_REGEX = /^[a-z ,.'-]+$/i;
const ALPHA_NUMERIC = /^[a-z0-9]+$/i;
const POSITIVE_PERCENTAGE = /^(?!0*(.0+)?$)(d{0,2}(.d{1,2})?|100(.00?)?)$/;

export class GlobalValidators {
  static nameControl(control: AbstractControl) {
    if (control.value && !NAME_REGEX.test(control.value)) {
      return { invalid_name: true };
    }
    return null;
  }

  static alphaNumControl(control: AbstractControl) {
    if (control.value && !ALPHA_NUMERIC.test(control.value)) {
      return { invalid_val: true };
    }
    return null;
  }

  static passwordValidation(control: AbstractControl) {
    let hasError = false;
    const password = control.value;
    if (password) {
      if (password.search(/[a-z]/) === -1) {
        hasError = true;
      }
      if (password.search(/[A-Z]/) === -1) {
        hasError = true;
      }
      if (password.search(/[0-9]/) === -1) {
        hasError = true;
      }
      if (!SPECIAL_CHARACTERS_MINIMAL.test(password)) {
        hasError = true;
      }
      if (hasError) {
        return {
          password: true
        };
      } else {
        return null;
      }
    }
  }

  static emailValidation(control: AbstractControl) {
    const value = String(control.value);
    if (value && !EMAIL_REGEX.test(value)) {
      return {
        emailPattern: true
      };
    } else {
      return null;
    }
  }

  static customEmailValidation(control: AbstractControl) {
    const value = String(control.value);
    const emails: any[] = value.split(";");
    if (value && emails.length > 0) {
      let hasError = false;
      emails.forEach(e => {
        if (!EMAIL_REGEX.test(e)) {
          hasError = true;
        }
      });
      if (hasError) {
        return {
          emailPattern: true
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static isValidNumber(value) {
    return NUMBER_REGEX.test(value);
  }

  static isAllNo(value) {
    return NUM_REGEX.test(value);
  }
}
