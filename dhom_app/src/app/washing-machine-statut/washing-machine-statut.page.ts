import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-washing-machine-statut',
  templateUrl: './washing-machine-statut.page.html',
  styleUrls: ['./washing-machine-statut.page.scss'],
})
export class WashingMachineStatutPage implements OnInit {
  value: number = 70.0;

  constructor() { }

  ngOnInit() {
  }
}
