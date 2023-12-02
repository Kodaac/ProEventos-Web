import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserUpdate } from '@app/_models/identity/UserUpdate';
import { AccountService } from '@app/_services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/_helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  //Pega um form field apenas com a letra F
  get f(): any{
    return this.form.controls;
  }

  constructor(private fb: FormBuilder, public accountService: AccountService, private router: Router, private toatrs: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void{
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toatrs.success("Usuário carregado!", "Sucesso");
      },
      (error: any) => {
        console.error(error);
        this.toatrs.error("Não foi possível carregar o usuário.", "Erro");
        this.router.navigate(["/dashboard"]);
      }
    ).add(() => this.spinner.hide());
  }

  public validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmaPassword')
    };

    this.form = this.fb.group({
      username: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['',[Validators.required, Validators.maxLength(60)]],
      ultimoNome: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      descricao: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      password: ['', [Validators.nullValidator, Validators.minLength(6)]],
      confirmaPassword: ['', Validators.nullValidator]
    }, formOptions);
  }

  public onSubmit(){
    this.atualizarUsuario();
  }

  public atualizarUsuario(){
    this.userUpdate = {... this.form.value};
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toatrs.success("Usuário atualizado!", "Sucesso"),
      (error: any) => {
        this.toatrs.error(error.error);
        console.error(error);
      },
    ).add(() => this.spinner.hide());
  }

  public resetForm(event: any): void{
    event.preventDefault();
    this.form.reset()
  }



}
