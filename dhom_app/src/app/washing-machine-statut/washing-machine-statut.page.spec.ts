import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingMachineStatutPage } from './washing-machine-statut.page';

describe('WashingMachineStatutPage', () => {
  let component: WashingMachineStatutPage;
  let fixture: ComponentFixture<WashingMachineStatutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashingMachineStatutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashingMachineStatutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
