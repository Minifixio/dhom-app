import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import {Http, Headers, RequestOptions} from '@angular/http';
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

  testMessage = 'hello';
  progressTime;
  countdown: string;
  today = new Date();
  size = 0;
  createdBy: string;
  scheduleTime: string;
  userName: any;
  day: string;
  type;
  statut = 'loading';
  message;
  rangeQuantity;
  globalSize;
  maxRange;
  userId = this.authService.getUserId();
  contributors = [];
  showJoinButton = true;
  urlApi = 'http://192.168.10.22:3000';
  uriApi = 'v1';


  constructor(
    private apiService: ApiService,
    public events: Events,
    private http: Http,
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

    this.machines = result[0];
    this.size = this.machines.size;
    this.globalSize = this.machines.size;
    this.machines.message = this.message;

    this.statut = 'success';
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
      console.log(data);
      for (const [key, value] of Object.entries(data)) {
        console.log(`${key}: ${value.userid}`);
        this.apiService.getUserById(value.userid).then(data => {
          this.contributors.push([value.userid, data, value.size]);

          // Hide the join button if the user is already part of the contributors
          this.authService.returnUserId().then(userId => {
            if (value.userid === userId) {
              this.showJoinButton = false;
            }
          });

          console.log(this.contributors);
        });
      }
    });
  }

  refreshPage(event) {
    console.log(event);
    this.getContributors();
    this.getMachinesInfos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  updateRange() {
    console.log(this.rangeQuantity);
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
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });

    const postParams = {
      body: {
        machineId: 1,
        userId: this.userId,
        size: this.rangeQuantity
      }
    };

    this.http.post(`${this.urlApi}/${this.uriApi}/join-machine`, postParams, options)
    .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error); // Error getting the data
    });
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
    console.log(timeBetween);
    this.progressTime = timeBetween / 48;
    console.log(hoursDiff);
    console.log(minutesDiff);

    this.countdown = (hoursDiff + 'h et ' + minutesDiff + 'min');

  }
}
