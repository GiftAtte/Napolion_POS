import { ModalServiceService } from './../../services/modal-service.service';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
})
export class SimpleTableComponent {
  constructor(private modalService:ModalServiceService) {
    
  }
  @Input() showToolBar = true;
  @Input() showAction = true;
  @Input() detailsAction: any;
  @Input() deleteAction: any;
  @Input() editAction: any;

  @Input() tableHeaders: any = [];

  @Input() data: any = [];

  editDetails(row: any) {
    this.modalService.openDialog();
  }
  deleteDetails(row: any) {
    console.log(row);
  }
  showDetails(row: any) {
    console.log(row);
  }
}
