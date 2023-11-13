import { EmployeeFormComponent } from './../employee/employee-form/employee-form.component';
import { AppModalComponent } from './../components/app-modal/app-modal.component';
import { EmployeeComponent } from './../employee/employee.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class ModalServiceService {
  constructor(public dialog: MatDialog) {}
  /** Gets the total cost of all transactions. */

  openDialog() {
    this.dialog.open(EmployeeFormComponent, {
      width: "600px",
      height: 'auto',
      data: {
        title: 'New Room',
      },
    });
  }
}
