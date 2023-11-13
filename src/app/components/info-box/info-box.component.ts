import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent {
  @Input() boxTitle = '';
  @Input() boxValue = 0.00;
  @Input() boxIcon = '';
  @Input() valueUnit=''

  @Output()
  clickAction=new EventEmitter<any>()

  fireClickAction(data:any){
    this.clickAction.emit(data);
  }
}
