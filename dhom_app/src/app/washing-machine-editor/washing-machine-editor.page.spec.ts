import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingMachineEditorPage } from './washing-machine-editor.page';

describe('WashingMachineEditorPage', () => {
  let component: WashingMachineEditorPage;
  let fixture: ComponentFixture<WashingMachineEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashingMachineEditorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashingMachineEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
