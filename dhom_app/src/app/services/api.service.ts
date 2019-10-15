import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlApi = 'http://localhost:3000';
  uriApi = 'v1';
 
  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) { }
 
  /**
  * Get the users
  * 
  * @returns Observable with detailed information
  */
  getUsers() {
    console.log(this.http.get(`${this.urlApi}/${this.uriApi}/users`));
    return this.http.get(`${this.urlApi}/${this.uriApi}/users`);
  }

  getMachine() {
    console.log(this.http.get(`${this.urlApi}/${this.uriApi}/get-machines`));
    return this.http.get(`${this.urlApi}/${this.uriApi}/get-machines`);
  }

  getContributors() {
    console.log(this.http.get(`${this.urlApi}/${this.uriApi}/get-contributors`));
    return this.http.get(`${this.urlApi}/${this.uriApi}/get-contributors`);
  }

  getUserById(userId){
    return new Promise((resolve, reject) => {
      this.http.get(`${this.urlApi}/${this.uriApi}/users`).forEach(
      value => {
        Object.values(value).forEach(function(element){
          if(element.id == userId){
            console.log(element.username);
            resolve(element.username);
          }
        });
      })
    })
  }
}
