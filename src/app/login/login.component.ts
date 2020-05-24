import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../servicios/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AlertService} from '../servicios/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private alertService: AlertService) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/homepage']);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      user: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  get c() {
    return this.form.controls;
  }

  login() {
    const val = this.form.value;

    if (val.user && val.password) {
      this.authService.login(val.user, val.password)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigateByUrl('/homepage');
          },
          error => {
            this.alertService.error('Usuario o password no existe!');
          }
        );
    }
  }
}
