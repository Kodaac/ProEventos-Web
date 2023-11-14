import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environments';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent {
  modalRef?: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId: number = 0;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public exibirImagem: boolean = true;
  private _filtroLista: string = '';

  public get filtroLista(): string{
    return this._filtroLista;
  }

  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || 
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public mostrarImagem(imagemUrl: string): string{
    return (imagemUrl != '') ? `${environment.apiURL}resources/images/${imagemUrl}` : 'assets/img/semImagem.jpg';
  }

  public carregarEventos(): void{

    const observer = {
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos.', 'Erro!');
      },
      complete: () => this.spinner.hide()
    };

    this.eventoService.getEventos().subscribe(observer);
  }

  public detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => { 

        if(result.message == "Deletado"){
          console.log(result);
          this.toastr.success('O evento foi deletado com sucesso.', 'Deletado!');
          this.carregarEventos(); 
        }

      },
      error: (erro: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}.`, 'Erro!');
        console.error(erro);
      },
    }).add(() => {this.spinner.hide();})

  }
 
  decline(): void {
    this.modalRef?.hide();
  }
}
