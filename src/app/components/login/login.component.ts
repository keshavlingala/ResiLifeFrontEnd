import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService} from "../../services/backend.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  })
  isLoginScreen = true

  constructor(
    private backend: BackendService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    if (backend.isLoggedIn) {
      this.router.navigate(['/']);
    }
    backend.loggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/']);
        this.snack.open('Logged in', 'OK', {duration: 3000});
      }
    })
  }

  toggleVisibility(password: HTMLInputElement) {
    password.type = password.type === 'password' ? 'text' : 'password';
  }

  login() {
    const {email, password} = this.loginForm.value;
    console.log('Logging in with', email, password);
    this.backend.login(email, password);
  }

  register() {
    const {email, password, firstName, lastName} = this.registerForm.value;
    this.backend.register(email, password, firstName, lastName).subscribe(res => {
      this.snack.open('Registered', 'OK', {duration: 3000});
    })
  }
}
