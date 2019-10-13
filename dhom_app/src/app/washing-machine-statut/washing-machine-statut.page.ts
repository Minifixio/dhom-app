import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import {Http, Headers, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-washing-machine-statut',
  templateUrl: './washing-machine-statut.page.html',
  styleUrls: ['./washing-machine-statut.page.scss'],
})

export class WashingMachineStatutPage implements OnInit {

  machines: Observable<any>;

  testMessage = 'hello';
  size = 0;
  createdBy: string;
  scheduleTime: string;
  userName: any;
  day;
  type;
  statut = "loading";
  message;
  rangeQuantity;
  globalSize;
  maxRange;

  machineTypes = [
    {
      id:1,
      infos : {
        name: 'Lavage 40°C',
        id: 1,
      }
    },
    {
      id:2,
      infos : {
        name: 'Lavage 30°C',
        id: 2,
      }
    },
    {
      id:3,
      infos : {
        name: 'Lavage Blanc',
        id: 3,
      }
    },
    {
      id:4,
      infos : {
        name: 'Lavage Sport',
        id: 4,
      }
    }
  ];

  constructor(
    private apiService: ApiService,
    public events: Events,
    private http: Http,
  ) { 
    events.subscribe('machine-added', size => {
      this.size = size;
    })
  }

  ngOnInit() {
    this.getMachinesInfos();
  }

  ionViewDidLoad() {
    console.log("View loaded");
    this.getMachinesInfos();
  }

  ionViewDidLeave(){
    console.log("View left");
  }

  getMachinesInfos(){
    this.statut = "loading";
    this.machines = this.apiService.getMachine();

    this.machines.subscribe(data => {
      this.statut = "success";
      this.size = data[0].size;
      this.globalSize = data[0].size;
      this.maxRange = 100 - this.globalSize;
      this.createdBy = data[0].createdBy;
      this.scheduleTime = data[0].scheduleTime;
      this.message = data[0].message;
      console.log(data);
      
      this.machineTypes.forEach(obj => {
        if(obj.id == data[0].type){
          this.type = obj.infos.name;
        }
      });

      if(data[0].day == 'today'){
        this.day = "aujourd'hui";
      } else {
        this.day = "demain";
      };
      this.apiService.getUserById(data[0].createdBY).then(username => {this.userName = username});
    
    }, err => {
      this.statut = "error";
    });
  }

  refreshPage(event){
    this.getMachinesInfos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  updateRange(){
    console.log(this.rangeQuantity);
    this.size = this.globalSize + this.rangeQuantity;
  }

  joinMachine(info){
    if(info == "join"){
      this.statut = "joining";
    }
    if(info == "leave"){
      this.statut = "success";
    }
  }

  updateSize(){
    this.statut = "success";
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });

    let postParams = {
      body: {
        size: this.rangeQuantity
      }
    } 

    this.http.post("http://localhost:3000/v1/update-size", postParams, options)
    .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error);// Error getting the data
    });
  } 
}
