import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { Lote } from 'src/app/_models/Lote';
import { LoteService } from 'src/app/_services/lote.service';
import { EventoService } from 'src/app/_services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})

export class EventoDetalheComponent implements OnInit {
  
  evento = {} as Evento;
  eventoId: number;
  form: FormGroup;
  estadoSalvar = 'post';
  modalRef: BsModalRef;
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL = 'assets/img/upload.png';
  file!: File;


  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any{
    return this.form.controls;  //Toda vez que chamar o f, ele ja trará os controls dos formulários
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray
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
    private activatedRouter: ActivatedRoute, 
    private eventService: EventoService, 
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private loteService: LoteService)
  {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public carregarEvento(): void{
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!; //+ é usado para converter para number

    if(this.eventoId != null && this.eventoId != 0){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          if(this.evento.imagemUrl != '') {
            this.imagemURL =  environment.apiURL + 'resources/images/' + this.evento.imagemUrl;
          }
          this.carregarLotes();
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
      imagemUrl: [''],
      lotes: this.fb.array([])
    });
  }

  public resetForm(): void{
    this.form.reset();
  }

  public adicionarLote(): void{
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  public criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
    })
  }

  public salvarEvento(): void{
    this.spinner.show();

    if(this.form.valid){

      if(this.estadoSalvar == 'post'){
        this.evento = {...this.form.value}
      } else {
        this.evento = {id: this.evento.id , ...this.form.value}
      }

      this.eventService[this.estadoSalvar](this.evento).subscribe({
        next: (eventoRetorno: Evento) => {
          this.toastr.success("Evento salvo com sucesso!", "Sucesso");
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
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

  public salvarLotes(): void{
    if(this.form.controls['lotes'].valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          this.toastr.success("Lotes salvos com sucesso!", "Sucesso!");
          //this.lotes.reset();
        },
        (error: any) => {
          this.toastr.error("Erro ao tentar salvar lotes.", "Erro");
          console.error(error);
        },
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotes: Lote[]) => {
        lotes.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },

      (error: any) => {
        this.toastr.error("Erro ao tentar carregar lotes.", "Erro");
        console.error(error);
      }

    ).add(() => this.spinner.hide());
  }

  public removerLote(template: TemplateRef<any>, indice: number): void{

    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success("Lote deletado com sucesso!", "Sucesso!");
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}.`, "Erro");
        console.error(error);
      },
      
    ).add(() => this.spinner.hide());
  }

  public retornaTituloLote(nome: string): string{
    return nome === null || nome === '' ? 'Nome do Lote' : nome;
  }

  public declineDeleteLote(): void{
    this.modalRef.hide();
  }

  public mudarValorData(value: Date, indice: number, campo: string): void{
    this.lotes.value[indice][campo] = value;
  }

  public onFileChange(ev: any): void{
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  public uploadImage(): void{
    this.spinner.show();
    this.eventService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success("Imagem atualizada com sucesso!", "Sucesso!");
      },
      (error: any) => {
        this.toastr.error("Erro ao tentar carregar imagem.", "Erro");
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any{
    return {'is-invalid': campoForm?.errors && campoForm?.touched};
  }




}
