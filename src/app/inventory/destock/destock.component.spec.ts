import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestockComponent } from './destock.component';

describe('DestockComponent', () => {
  let component: DestockComponent;
  let fixture: ComponentFixture<DestockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
