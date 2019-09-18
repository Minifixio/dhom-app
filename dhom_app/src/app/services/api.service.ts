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
    return this.http.get(`${this.urlApi}/${this.uriApi}/users`);
  }
}
