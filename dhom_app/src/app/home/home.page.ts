import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  name = this.authService.username;
  loggedIn: boolean;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: Storage) {
    }

  ngOnInit() {
    this.authService.checkLoggedIn().then(
      loggedIn => {
        if (!loggedIn) {
          this.navCtrl.navigateRoot('/login-page');
        } else {
          this.authService._loggedIn = true;
          this.loggedIn = true;
          this.authService.returnUser().then(username => this.name = username);
        }
      }
    );
  }

  public getUser(){
    this.authService.getUser();
  }

  public disconnect(){
    this.storage.clear();
  }

  public test(){

  }
}
