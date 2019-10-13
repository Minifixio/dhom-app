import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  name = this.authService.username;
  id: number;
  loginStatus = this.authService._loggedIn;
  loginMessage: string;

  users: Observable<any>;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private apiService: ApiService) { }

  ngOnInit() {
    this.loginStatus = this.authService._loggedIn;
    if(this.authService._loggedIn){
      this.authService.returnUser().then(user => {console.log(user); this.loginMessage = "Connecté en temps que : " + user});    
    } else {
      this.loginMessage = "Authentifiez vous :"
    }
    this.loadUsers();
  }
  
  loadUsers():void{
    this.users = this.apiService.getUsers();
  }

  public setUser(userId, userName): void{
    this.authService.setUser(userName, userId);
    this.navCtrl.navigateRoot('/menu/home')
  }
}
