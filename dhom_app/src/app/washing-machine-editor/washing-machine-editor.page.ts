import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { AuthService } from '../auth.service';
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

  ngOnInit() {
    this.authService.returnUser().then(user => this.user = user);
    this.authService.returnUserId().then(userId => this.userId = userId);
  }

  rangeQuantity = 0;
  checkedMachine: number;
  today = new Date();
  timeNow = this.today.getHours() + ':' + this.today.getMinutes();
  machineMessage: string;
  user = this.authService.getUser();
  userId = this.authService.getUserId();

  todayButtonColor = "success";
  tomorrowButtonColor = "medium";

  pickedDay = "today";

  machineTypes = [
    {
      id:1,
      infos : {
        name: 'Lavage 40°C',
        id: 1,
        isSelected: false
      }
    },
    {
      id:2,
      infos : {
        name: 'Lavage 30°C',
        id: 2,
        isSelected: false
      }
    },
    {
      id:3,
      infos : {
        name: 'Lavage Blanc',
        id: 3,
        isSelected: false
      }
    },
    {
      id:4,
      infos : {
        name: 'Lavage Sport',
        id: 4,
        isSelected: false
      }
    }
  ];

  onSelectRadioItem(machine){
    this.checkedMachine = machine;
  }

  addMachine(){
    if(this.checkedMachine == null && this.timeNow === this.today.getHours() + ':' + this.today.getMinutes()){
      this.errorToast(3);
    }
    if(this.checkedMachine == null && this.timeNow != this.today.getHours() + ':' + this.today.getMinutes()){
      this.errorToast(1);
    }
    if(this.timeNow === this.today.getHours() + ':' + this.today.getMinutes() && this.checkedMachine != null){
      this.errorToast(2);
    } 
    if(this.timeNow != this.today.getHours() + ':' + this.today.getMinutes() && this.checkedMachine != null) {
      this.navCtrl.navigateBack('/menu/washing-machine/tab1');
      this.postRequest(this.checkedMachine, this.timeNow, this.machineMessage, this.rangeQuantity);
    }
    this.events.publish('machine-added', this.rangeQuantity);
  }

  async errorToast(error) {
    if(error == 1){
      const toast = await this.toastController.create({
        message: 'Il faut selectionner un type de machine !',
        duration: 2000
      });
      toast.present();
    }    
    if(error == 2){
      const toast = await this.toastController.create({
        message: 'Il faut selectionner une heure !',
        duration: 2000
      });
      toast.present();
    }
    if(error == 3){
      const toast = await this.toastController.create({
        message: 'Il faut selectionner une heure et un type de machine !',
        duration: 2000
      });
      toast.present();
    }
  }
  
  postRequest(type, hour, message, size){

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });

    if(message == null) {
      let postParams = {
        body: {
          user: this.userId,
          type: type.infos.id,
          day: this.pickedDay,
          sheduleTime: hour,
          size: size
        }
      }
            
    this.http.post("http://localhost:3000/v1/add-machines", postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);// Error getting the data
      });
    } 
    
    else {
      let postParams = {
        body: {
          user: this.userId,
          type: type.infos.id,
          day: this.pickedDay,
          sheduleTime: hour,
          message: message,
          size: size
        }
      }
      
    this.http.post("http://localhost:3000/v1/add-machines", postParams, options)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);// Error getting the data
      }); 
    }
  }

  test(){
    this.postRequest(this.checkedMachine, this.timeNow, this.machineMessage, this.rangeQuantity);
  }

  dayPick(day){
    this.pickedDay = day;
    if(this.pickedDay == 'today'){
      this.todayButtonColor = "success";
      this.tomorrowButtonColor = "medium";
    }
    if(this.pickedDay == 'tomorrow'){
      this.todayButtonColor = "medium";
      this.tomorrowButtonColor = "success";
    }
  }
}
