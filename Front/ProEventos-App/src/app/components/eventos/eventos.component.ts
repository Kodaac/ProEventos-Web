import { Component, TemplateRef } from '@angular/core';
import { EventoService } from '../../_services/evento.service';
import { Evento } from '../../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent {

  ngOnInit(): void{
    
  }

}
