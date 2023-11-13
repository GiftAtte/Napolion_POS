import { Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppService } from './../../services/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss'],
})
export class SettingsFormComponent {
  settingForm!: FormGroup;
  actionBtnText = 'save';
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dialogRef: MatDialogRef<SettingsFormComponent>
  ) {}

  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }
  }

  addSettings() {
    //console.log(this.employeeForm.value);
    if (this.settingForm.valid) {
      this.appService.createApp(this.settingForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'settings added succefully', 'success');
          this.settingForm.reset();
          this.dialogRef.close();         
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateSettings() {
    console.log(this.settingForm.value);
    if (this.settingForm.valid) {
      this.appService.putApp(this.settingForm.value).subscribe({
        next: (res) => {
          alert('settings updated succefully');
          this.settingForm.reset();
          this.dialogRef.close();
        },
        error: () => {
          alert('there was error:');
        },
      });
    } else {
      console.log(this.settingForm);
    }
  }

  fillForm(data: any) {
    // console.log("hhhh",this.data)
    this.settingForm.controls['companyName'].setValue(data.companyName);
    this.settingForm.controls['phone'].setValue(data.phone);
    this.settingForm.controls['email'].setValue(data.email);
    this.settingForm.controls['address'].setValue(data.address);
    this.settingForm.controls['state'].setValue(data.state);
    this.settingForm.controls['website'].setValue(data.website);
    this.settingForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.settingForm = this.formBuilder.group({
      id: null,
      companyName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      website: [''],
      logo: [''],
      //date: ['', Validators.required],
    });
  }
}






