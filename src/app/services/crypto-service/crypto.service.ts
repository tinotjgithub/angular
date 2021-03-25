import { Injectable } from "@angular/core";
const CryptoJS = require("crypto-js");
const SecureStorage = require("secure-web-storage");
const SECRET_KEY = "my secret key";
const secureStorage = new SecureStorage(localStorage, {
  hash: function hash(key) {
    key = CryptoJS.SHA256(key, SECRET_KEY);

    return key.toString();
  },
  encrypt: function encrypt(data) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  },
  decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }
});
@Injectable({
  providedIn: "root"
})
export class CryptoService {
  constructor() {}
  setItem(key, value) {
    secureStorage.setItem(key, value);
  }
  getItem(key) {
    try {
      return secureStorage.getItem(key);
    } catch (e) {
      this.clear();
    }
  }
  clear() {
    secureStorage.clear();
  }
}
