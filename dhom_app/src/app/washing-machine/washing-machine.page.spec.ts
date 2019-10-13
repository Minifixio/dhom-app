import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingMachinePage } from './washing-machine.page';

describe('WashingMachinePage', () => {
  let component: WashingMachinePage;
  let fixture: ComponentFixture<WashingMachinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashingMachinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashingMachinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
