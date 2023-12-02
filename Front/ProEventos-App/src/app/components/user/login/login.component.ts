import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '@app/_models/identity/UserLogin';
import { AccountService } from '@app/_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  model = {} as UserLogin;

  constructor(private accountService: AccountService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {}

  public login(): void{
    this.accountService.login(this.model).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard')
      },
      (error: any) => {
        if(error.status == 401) 
          this.toastr.error("Usuário ou senha inválidos.");
        else
          console.error(error);
      }
    )
  }

}
