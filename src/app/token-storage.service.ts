import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// This service will be used to store stuff, now primarily in the local storage
export class TokenStorageService {

  constructor() {}

  // saves a string
  setString(id: string, value: string) {
    localStorage.setItem(id, value);
  }

  // gets a string
  getString(id: string): string {
    return localStorage.getItem(id);
  }

  // saves an object
  setObj(id: string, value: object){
    localStorage.setItem(id, JSON.stringify(value));
  }

  // returns an object
  getObj(id: string){
    let item = localStorage.getItem(id);
    if(item != null || item != undefined)
      return JSON.parse(item);
    else
      return null;
  }

  //removes an item from storage
  removeItem(id: string){
    localStorage.removeItem(id);
  }
}
