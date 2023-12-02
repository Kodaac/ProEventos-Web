import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@app/_models/identity/User';
import { AccountService } from '@app/_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/_helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {

  form!: FormGroup;
  user = {} as User;

  get f(): any{
    return this.form.controls;
  }
  
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.validation();
  }

  public validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmaPassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required, Validators.maxLength(50)]],
      ultimoNome: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmaPassword: ['', Validators.required]
    }, formOptions);
  }

  public register(): void{
    this.user = {...this.form.value};
    this.accountService.register(this.user).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
      },
      (error: any) => {
        this.toastr.error("Erro ao tentar cadastrar usuário.");
        console.error(error);
      }
    );
  }

}
