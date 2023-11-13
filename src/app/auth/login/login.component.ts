import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLogin = false;
  showLoader=false
  userForm!: FormGroup;
  hide = true;
  message:string=''
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) { 
      location.href = '';
    }
  }

  loginUser() {
    this.showLoader=true
  
    this.authService.logIn(this.userForm.value).subscribe({
      next: (res) => {
        console.log(res)
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.data.user));
          location.href=""
          this.showLoader=false
          this.message=""
        } 
    },
    error:(err) =>{
      console.log(err)
      if(err.statusText==="Unauthorized"||err.statusText==="Bad Request"){
        this.message="Wrong credentials"
      }else{
        this.message="Something went wrong"
      }
     this.showLoader=false
     
    },
  
  
  } 
    
    
    
    )
  }
}
