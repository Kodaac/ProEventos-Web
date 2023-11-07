import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {
  
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';

  get f(): any{
    return this.form.controls;  //Toda vez que chamar o f, ele ja trará os controls dos formulários
  }

  get bsConfig(): any {
    return {  
      adaptivePosition: true, 
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }
  
  constructor(
    private fb: FormBuilder, 
    private localeService: BsLocaleService, 
    private router: ActivatedRoute, 
    private eventService: EventoService, 
    private spinner: NgxSpinnerService,
    private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void{
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventService.getEventoById(+eventoIdParam).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar evento.');
          console.log(error);
        },
        complete: () => {this.spinner.hide();}
      });

    }
  }

  public validation(): void{
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemUrl: ['', Validators.required]
    });
  }

  public resetForm(): void{
    this.form.reset();
  }

  public salvarAlteracao(): void{
    this.spinner.show();

    if(this.form.valid){

      if(this.estadoSalvar == 'post'){
        this.evento = {...this.form.value}
      } else {
        this.evento = {id: this.evento.id , ...this.form.value}
      }

      this.eventService[this.estadoSalvar](this.evento).subscribe({
        next: () => {
          this.toastr.success("Evento salvo com sucesso!", "Sucesso");
        },
        error: (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error("Erro ao salvar evento.", "Erro");
        },
        complete: () => {this.spinner.hide();}
      });
    }
  }


}
