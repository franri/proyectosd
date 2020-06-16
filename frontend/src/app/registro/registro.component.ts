import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../servicios/auth.service";
import {Router} from "@angular/router";
import {AlertService} from "../servicios/alert.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      user: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    });
  }

  get c() {
    return this.form.controls;
  }

  signUp() {
    this.submitted = true;
    const val = this.form.value;
    this.loading = true;
    if (val.user && val.password) {
      this.authService.signUp(val.user, val.password)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.clear();
            this.alertService.success('Operacion correcta!');
            this.router.navigateByUrl('/login');
          },
          error => {
            this.loading = false;
            this.alertService.clear();
            this.alertService.error('Usuario ya existe!');
          }
        );
    }
  }

  passwordDistintas() {
    return ((this.c.password !== null && this.c.confirmPassword !== null) ||
      (this.c.password !== undefined && this.c.confirmPassword !== undefined)) &&
      this.c.password.value !== this.c.confirmPassword.value;
  }
}
