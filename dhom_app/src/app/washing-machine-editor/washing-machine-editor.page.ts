import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Events } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-washing-machine-editor',
  templateUrl: './washing-machine-editor.page.html',
  styleUrls: ['./washing-machine-editor.page.scss'],
})


export class WashingMachineEditorPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public navCtrl: NavController,
    private authService: AuthService,
    public events: Events,
    public apiService: ApiService
  ) { }

  rangeQuantity = 0;
  checkedMachine: number;
  today = new Date();
  timeNow = this.today.getHours() + ':' + this.today.getMinutes();
  machineMessage: string;
  user = this.authService.getUser();
  userId = this.authService.getUserId();
  timer;

  todayButtonColor = 'success';
  tomorrowButtonColor = 'medium';

  pickedDay = 'today';
  urlApi = 'https://dhom-express-server.herokuapp.com';
  uriApi = 'v1';

  machineTypes = [
    {
      id: 1,
      infos: {name: 'Lavage 40°C', id: 1, isSelected: false }
    },
    {
      id: 2,
      infos: {name: 'Lavage 30°C', id: 2, isSelected: false }
    },
    {
      id: 3,
      infos: {name: 'Lavage Blanc', id: 3, isSelected: false }
    },
    {
      id: 4,
      infos: {name: 'Lavage Sport', id: 4, isSelected: false }
    }
  ];

  ngOnInit() {
    this.authService.returnUser().then(user => this.user = user);
    this.authService.returnUserId().then(userId => this.userId = userId);
  }

  onSelectRadioItem(machine) {
    this.checkedMachine = machine;
  }

  addMachine() {
    if (!this.checkedMachine) {
      if (this.timeNow !== this.today.getHours() + ':' + this.today.getMinutes()) {
        this.errorToast(1);
      } else {
        this.errorToast(3);
      }
    } else {
      if (this.timeNow === this.today.getHours() + ':' + this.today.getMinutes()) {
        this.errorToast(2);
      } else {
        const date = this.setupScheduleTime(this.timeNow, this.pickedDay);

        this.postRequest(this.checkedMachine, this.timeNow, date, this.machineMessage, this.rangeQuantity).then(() => {
          this.events.publish('machine-added', this.rangeQuantity);
          this.navCtrl.navigateBack('/menu/washing-machine/tab1');
        });
      }
    }
  }

  async errorToast(error) {
    let errorMessage: string;

    if (error === 1) { errorMessage = 'un type de machine !'; }
    if (error === 2) { errorMessage = 'une heure !'; }
    if (error === 3) { errorMessage = 'une heure et un type de machine !'; }

    const toast = await this.toastController.create({
      message: 'Il faut selectionner ' + errorMessage,
      duration: 2000
    });
    toast.present();
  }

  async postRequest(type, hour, date, message, size) {
    
    const creatorName = this.user;

    const postParams = {
      body: {
        creatorId: this.userId,
        creatorName,
        typeId: type.infos.id,
        typeName: type.infos.name,
        day: this.pickedDay,
        scheduleTime: hour,
        size,
        scheduleDate: date,
      }
    };

    if (message) {
      Object.assign(postParams.body, {message});
    }

    this.apiService.post('add-machine', postParams);
  }

  dayPick(day) {
    this.pickedDay = day;
    if (this.pickedDay === 'today') {
      this.todayButtonColor = 'success';
      this.tomorrowButtonColor = 'medium';
    }
    if (this.pickedDay === 'tomorrow') {
      this.todayButtonColor = 'medium';
      this.tomorrowButtonColor = 'success';
    }
  }

  /**
   * Take a time as string, parse it to get the hours and minutes values and then add the selected day to create a date
   * @param time string
   * @param day string
   */
  setupScheduleTime(time, day) {

    const minutes = (parseInt(time.substring(3, 6), 10));
    const hours = parseInt(time.substring(0, 2), 10);

    const today = new Date();

    if (day === 'today') {
      today.setHours(hours);
      today.setMinutes(minutes);
      return today;
    }

    if (day === 'tomorrow') {
      today.setDate(today.getDate() + 1);
      today.setHours(hours);
      today.setMinutes(minutes);
      return today;
    }
  }
}
