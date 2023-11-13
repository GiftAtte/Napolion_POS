import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss'],
})
export class AppModalComponent implements OnInit {
  @Input() createAction: any;
  @Input() updateAction: any;
  @Input() modalTitle = '';
  @Input() isUpdate=false
  @Input()showLoader=false;
  @Input()showActionBtn=true
  @Output()
  createActionEmitter = new EventEmitter<any>();

  @Output()
  updateActionEmitter = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    // this.modalTitle=this.updateAction?"Update Info":"New Info"
  }

  addNew() {
    this.createActionEmitter.emit(null);
  }
  updateInfo() {
    this.updateActionEmitter.emit(null)
  }
}
