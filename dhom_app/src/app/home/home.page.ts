import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { FcmService } from '../services/fcm.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  name = this.authService.username;
  loggedIn: boolean;
  machinesCount = 0;
  machineType: string;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: Storage,
    private fcmservice: FcmService,
    private apiService: ApiService) {
      if (window.cordova) {
        this.fcmservice.setupFCM();
      }
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
    this.getMachines();
  }

  public getUser() {
    this.authService.getUser();
  }

  public disconnect() {
    this.storage.clear();
  }

  public async getMachines() {

    const result = await this.apiService.getMachine().toPromise();
    const machine = result[0];
    this.machinesCount = 1;
    this.machineType = machine.typeName;

  }
}
