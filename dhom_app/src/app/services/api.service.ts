import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlApi = Constants.URL_API;
  uriApi = Constants.URI_API;
 
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

  getUserById(userId) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.urlApi}/${this.uriApi}/users`).forEach(
      value => {
        Object.values(value).forEach(function(element) {
          if (element.id === userId) {
            resolve(element.username);
          }
        });
      });
    });
  }

  async post(url, request) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = { headers };

    return await this.http.post(`${this.urlApi}/${this.uriApi}/` + url, request, options).toPromise();
  }
}
