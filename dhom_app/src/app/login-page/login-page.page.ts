import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { FCM } from '@ionic-native/fcm/ngx'; // Push

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
  statut;
  fcmNotificationTitle: string = null;
  fcmNotificationBody: string = null;

  users: Observable<any>;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private apiService: ApiService,
    private fcm: FCM
  ) {
    this.setupFCM();
  }

  ngOnInit() {
    this.loginStatus = this.authService._loggedIn;
    this.refreshUsers();
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe(
      data => console.log('success', data),
      error => this.statut = 'error'
    );
    this.users = this.apiService.getUsers();
  }

  public setUser(userId, userName): void {
    this.authService.setUser(userName, userId);
    this.navCtrl.navigateRoot('/menu/home')
  }

  refreshUsers() {
    if (this.authService._loggedIn) {
      this.authService.returnUser().then(user => {
        console.log(user);
        this.loginMessage = 'Connecté en temps que : ' + user;
        this.statut = 'success';
      });
    } else {
      this.loginMessage = 'Authentifiez vous :';
      this.statut = 'success';
    }
    this.loadUsers();
  }

  setupFCM() {

    this.fcm.subscribeToTopic('washingMachine');

    // Get FCM token for this app
    this.fcm.getToken().then(token => {
      console.log(token);
    });

    // Listen for the FCM token refresh event
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });

    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background', data);
      } else {
        console.log('Received in foreground', data);
      }
      this.fcmNotificationTitle = data.title;
      this.fcmNotificationBody = data.body;
    });
  }
}
