import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-washing-machine-editor',
  templateUrl: './washing-machine-editor.page.html',
  styleUrls: ['./washing-machine-editor.page.scss'],
})


export class WashingMachineEditorPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public navCtrl: NavController,
    private http: Http,
    private authService: AuthService,
    public events: Events
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
  urlApi = 'http://192.168.10.22:3000';
  uriApi = 'v1';

  machineTypes = [
    {
      id: 1,
      infos: {
        name: 'Lavage 40°C',
        id: 1,
        isSelected: false
      }
    },
    {
      id: 2,
      infos: {
        name: 'Lavage 30°C',
        id: 2,
        isSelected: false
      }
    },
    {
      id: 3,
      infos: {
        name: 'Lavage Blanc',
        id: 3,
        isSelected: false
      }
    },
    {
      id: 4,
      infos: {
        name: 'Lavage Sport',
        id: 4,
        isSelected: false
      }
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
    if (this.checkedMachine == null && this.timeNow === this.today.getHours() + ':' + this.today.getMinutes()) {
      this.errorToast(3);
    }
    if (this.checkedMachine == null && this.timeNow !== this.today.getHours() + ':' + this.today.getMinutes()) {
      this.errorToast(1);
    }
    if (this.timeNow === this.today.getHours() + ':' + this.today.getMinutes() && this.checkedMachine != null) {
      this.errorToast(2);
    }
    if (this.timeNow !== this.today.getHours() + ':' + this.today.getMinutes() && this.checkedMachine != null) {

      let date = this.setupScheduleTime(this.timeNow, this.pickedDay);

      this.postRequest(this.checkedMachine, this.timeNow, date, this.machineMessage, this.rangeQuantity).then(() => {
        this.events.publish('machine-added', this.rangeQuantity);
        this.navCtrl.navigateBack('/menu/washing-machine/tab1');
      });
    }
  }

  async errorToast(error) {
    if (error === 1) {
      const toast = await this.toastController.create({
        message: 'Il faut selectionner un type de machine !',
        duration: 2000
      });
      toast.present();
    }
    if (error === 2) {
      const toast = await this.toastController.create({
        message: 'Il faut selectionner une heure !',
        duration: 2000
      });
      toast.present();
    }
    if (error === 3) {
      const toast = await this.toastController.create({
        message: 'Il faut selectionner une heure et un type de machine !',
        duration: 2000
      });
      toast.present();
    }
  }

  async postRequest(type, hour, date, message, size) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers });

    const creatorName = this.user;

    if (message == null) {
      const postParams = {
        body: {
          creatorId: this.userId,
          creatorName,
          typeId: type.infos.id,
          typeName: type.infos.name,
          day: this.pickedDay,
          scheduleTime: hour,
          size,
          scheduleDate: date
        }
      };

      return await this.http.post(`${this.urlApi}/${this.uriApi}/add-machine`, postParams, options).toPromise();

    } else {
      const postParams = {
        body: {
          creatorId: this.userId,
          creatorName,
          typeId: type.infos.id,
          typeName: type.infos.name,
          day: this.pickedDay,
          scheduleTime: hour,
          message,
          size,
          scheduleDate: date
        }
      };

      return await this.http.post(`${this.urlApi}/${this.uriApi}/add-machine`, postParams, options).toPromise();
    }
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

  getScheduleTime() {

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const hours = parseInt(this.timeNow.substring(0, 2), 10);
    const minutes = parseInt(this.timeNow.substring(3, 6), 10);

    if (this.pickedDay === 'today') {
      return new Date(year, month, day, hours, minutes);
    }
    if (this.pickedDay === 'tomorrow') {
      return new Date(year, month, day + 1, hours, minutes);
    }
  }

  countDownTime() {
    console.log("hey");
    this.timer = setTimeout(x => {
      console.log("hey");
      }, 1000);
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

  test() {
    console.log(typeof this.timeNow);
    this.setupScheduleTime(this.timeNow, this.pickedDay);
  }
}
