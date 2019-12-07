import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-washing-machine-statut',
  templateUrl: './washing-machine-statut.page.html',
  styleUrls: ['./washing-machine-statut.page.scss'],
})

export class WashingMachineStatutPage implements OnInit {

  machines = {
    creatorId: 0,
    creatorName: '',
    typeId: 0,
    typeName: '',
    day: '',
    scheduleTime: '',
    size: 0,
    message: '',
    scheduleDate: ''
  };

  progressTime: number;
  countdown: string;
  today = new Date();

  rangeQuantity: number;
  globalSize: number;
  maxRange: number;
  size = 0; // Default size : zero to let the gauge load propreply

  showJoinButton = true;
  statut = 'loading';

  userId = this.authService.getUserId();
  contributors = [];

  constructor(
    private apiService: ApiService,
    public events: Events,
    private authService: AuthService,
    public navCtrl: NavController
  ) {
    events.subscribe('machine-added', size => {
      this.size = size;
      this.getMachinesInfos();
    });
  }

  ngOnInit() {
    this.getMachinesInfos();
    this.getContributors();
    this.authService.returnUserId().then(userId => this.userId = userId);
    const interval = setInterval(() => {
      this.udpateCountdown(this.machines.scheduleDate);
    }, 60000);
  }

  ionViewDidLoad() {
    this.getMachinesInfos();
  }

  async getMachinesInfos() {
    this.statut = 'loading';
    const result = await this.apiService.getMachine().toPromise();
    this.statut = 'success';

    this.machines = result[0];
    this.size = this.machines.size;
    this.globalSize = this.machines.size;

    this.maxRange = 100 - this.machines.size;
    this.udpateCountdown(this.machines.scheduleDate);

    // Hide the join button if the user is the creator of the machine
    const userId = await this.authService.returnUserId();
    this.userId = userId;
    if (userId === this.machines.creatorId) {
      this.showJoinButton = false;
    }
  }

  getContributors() {
    this.contributors = [];
    this.apiService.getContributors().subscribe(data => {
      for (const [key, value] of Object.entries(data)) {
        this.apiService.getUserById(value.userid).then(data => {
          this.contributors.push([value.userid, data, value.size]);

          // Hide the join button if the user is already part of the contributors
          this.authService.returnUserId().then(userId => {
            if (value.userid === userId) {
              this.showJoinButton = false;
            }
          });
        });
      }
    });
  }

  refreshPage(event) {
    this.getContributors();
    this.getMachinesInfos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  updateRange() {
    this.size = this.globalSize + this.rangeQuantity;
  }

  joinMachine(info) {
    if (info === 'join') {
      this.statut = 'joining';
    }
    if (info === 'leave') {
      this.statut = 'success';
    }
  }

  updateSize() {
    this.statut = 'success';

    const postParams = {
      body: {
        machineId: 1,
        userId: this.userId,
        size: this.rangeQuantity
      }
    };

    this.apiService.post('join-machine', postParams);
  }

  udpateCountdown(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();

    let hoursDiff = date.getHours() - today.getHours();
    let minutesDiff = date.getMinutes() - today.getMinutes();

    if (today.getDay() !== date.getDay()) {
      hoursDiff = hoursDiff + 24;
      this.machines.day = 'demain';
    } else {
      this.machines.day = 'aujourd\'hui';
    }

    if (minutesDiff < 0) {
      hoursDiff = hoursDiff - 1;
      minutesDiff = 60 + minutesDiff;
    }

    const timeBetween = (date.getTime() - today.getTime()) / 3600000;
    this.progressTime = timeBetween / 48;

    this.countdown = (hoursDiff + 'h et ' + minutesDiff + 'min');
  }
}
