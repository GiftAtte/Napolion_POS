import { Designation } from './../../../../../napolion/src/app/employee/employee-form/designation';
import { Observable, startWith, map } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ROLES } from 'src/app/auth/Roles';
import { ActivatedRoute } from '@angular/router';
import { DEPARTMENT } from '../department';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
})
export class EmployeeProfileComponent implements OnInit, AfterViewInit {
  department = DEPARTMENT;
  isLinear = false;
  employeeId: any = '';
  data: any;
  showLoader = false;
  employeeForm!: FormGroup;
  loginForm:FormGroup;
  imageSrc: any;
  progress: number = 0;
  photo: any;
  options: string[] = Designation;
  userImage = '';
  roleList: any = ROLES;
  filteredDesignation: Observable<string[]>;
  designation = new FormControl('');
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private activeRoute: ActivatedRoute,
    private toatsr:ToastrService
  ) {
    //this.loadProfile(this.employeeId);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.employeeId = this.activeRoute.snapshot.paramMap.get('id');
    console.log(this.employeeId);
    if (this.employeeId) {
      this.loadProfile(this.employeeId);
    }

    this.filteredDesignation = this.designation.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngAfterViewInit(): void { }

  fillForm(data: any) {
    console.log('data to fill', data);
    this.employeeForm.controls['surname'].setValue(data.surname);
    this.employeeForm.controls['firstName'].setValue(data.firstName);
    this.employeeForm.controls['gender'].setValue(data.gender);
    this.employeeForm.controls['phone'].setValue(data.phone);
    this.employeeForm.controls['department'].setValue(data.department);
    this.employeeForm.controls['id'].setValue(data._id);
    this.employeeForm.controls['nationality'].setValue(data.nationality);
    this.employeeForm.controls['stateOfOrigin'].setValue(data.stateOfOrigin);
    this.employeeForm.controls['lgaOfOrigin'].setValue(data.lgaOfOrigin);
    this.employeeForm.controls['department'].setValue(data.department);
    this.employeeForm.controls['hiredDate'].setValue(data.hiredDate);
    this.employeeForm.controls['contactAddress'].setValue(data.contactAddress);
    this.employeeForm.controls['designation'].setValue(data.designation);
    this.employeeForm.controls['email'].setValue(data.user.email);
    this.employeeForm.controls['workStyle'].setValue(data.workStyle);
    this.employeeForm.controls['jobType'].setValue(data.jobType);
    this.employeeForm.controls['hiredDate'].setValue(data.hiredDate);
    this.employeeForm.controls['salary'].setValue(data.salary);
    this.employeeForm.controls['maritalStatus'].setValue(data.maritalStatus);
  }

  initializeForm() {
    this.employeeForm = this.formBuilder.group({
      id: null,
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: [''],
      state: [''],
      contactAddress: [''],
      lgaOfOrigin: ['', Validators.required],
      stateOfOrigin: ['', Validators.required],
      department: ['', Validators.required],
      jobType: ['', Validators.required],
      workStyle: ['', Validators.required],
      hiredDate: ['', Validators.required],
      salary: ['', Validators.required],
      email: [''],
      designation: [''],
      dob: [''],
      qualification: [''],
      maritalStatus: [''],
      password: [''],
      passwordConfirm: [''],
      currentPassword: [""],
      photo: [''],
      roles: [[55667], Validators.required],

    });
  }

  loadProfile(id: any) {
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        this.data = res.data;
        this.userImage = '../../../assets/img/profile/' + this.data.user.photo;
        this.fillForm(res.data);
      },
    });
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.photo = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.photo);
      this.uploadPhoto(event.target.files[0]);
    }
  }

  uploadPhoto(file) {
    this.employeeService
      .uploadProfileImg({ id: this.data.user._id, photo: file })
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
        }
      });
  }
  // UDATE USER


  updatePassword() {

    const user = {
      password: this.employeeForm.value.password,
      passwordConfirm: this.employeeForm.value.passwordConfirm,
      currentPassword: this.employeeForm.value.currentPassword,
      id: this.data.user._id
    };
    if (user.password && user.passwordConfirm) {
      this.showLoader=true
      this.employeeService.putPassword(user).subscribe({
        next: (res) => {
          Swal.fire("Success", "password updated successfully", 'success')
          this.showLoader=false
        },
        error: (err) => {
          Swal.fire('Error', "Check your current password", 'error');
         this.showLoader=false
        }
      })
    }

  }

  updateEmployeeProfile(){
    this.showLoader=true
    this.employeeForm.controls['designation'].setValue(this.designation.value)
    console.log(this.employeeForm.value)
    this.employeeService.putEmployees(this.employeeForm.value).subscribe({
      next:(res)=>{
        console.log(res)
        this.showLoader=false
        this.toatsr.success("Profile updated successfully");

      },
      error:(err)=>{
        console.log(err)
      }
    })

  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
