import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-dialog-opener',
  templateUrl: './dialog-opener.component.html',
  styleUrls: ['./dialog-opener.component.scss'],
})
export class DialogOpenerComponent {
  constructor(public dialog: MatDialog) {}
  /** Gets the total cost of all transactions. */
@Input() modalAction!:any
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '500px',
      height: 'auto',
      data: {
        title: 'New Room',
      },
    });
  }
}
