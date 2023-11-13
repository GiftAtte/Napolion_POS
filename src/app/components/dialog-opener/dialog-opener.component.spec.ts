import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOpenerComponent } from './dialog-opener.component';

describe('DialogOpenerComponent', () => {
  let component: DialogOpenerComponent;
  let fixture: ComponentFixture<DialogOpenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOpenerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
