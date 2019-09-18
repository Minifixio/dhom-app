import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _loggedIn: boolean = false;
  public username: string;

  constructor(
    private storage: Storage) {}

  checkLoggedIn():Promise<boolean> {
    return new Promise(
      (resolve) =>{
        if(this._loggedIn){
          resolve(true);
        }
        else{
          this.storage.keys()
          .then(data => {
            this._loggedIn = this.checkRegistred(data);
            resolve(this._loggedIn);
          })
        }
      }
    );
  }

  public checkRegistred(data): boolean{
    return data.includes('user');
  }

  public setUser(name, id) {
    this.storage.set('user', name);
    this.storage.set('id', id);
  }

  public getUser(): string {
    if(this._loggedIn){
      this.storage.get('user').then(
        user => {return user;}
      );
    } else {
      return "?";
    }
  }

  public returnUser(): Promise<string>{
    if(this._loggedIn){
      return this.storage.get('user');
    } else {
      return new Promise(
        (resolve) => {
          return "?";
        }
      );
    }
  }
}
