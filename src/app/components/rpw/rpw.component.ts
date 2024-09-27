import { NgClass } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, input, Input, output, Output, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoModalModule } from '@po-ui/ng-components';
import { interval, Observable, Subscription } from 'rxjs';
import { TotvsService } from '../../services/totvs-service.service';
import { TotvsService46 } from '../../services/totvs-service-46.service';

@Component({
  selector: 'rpw-acomp',
  standalone: true,
  imports: [
    PoModalModule,
    NgClass
  ],
  templateUrl: './rpw.component.html',
  styleUrl: './rpw.component.css'
})
export class RpwComponent {

  //Servico Totvs para verificar o rpw
  private srvTotvs46 = inject(TotvsService46);

  //Signals variaveis
  numPedExec = input(0)
  tentativas = input(0)
  intervalo = input(0)
  execPedEvent = output<boolean>();

  //Tela Modal
  @ViewChild('timer', { static: true }) telaTimer:
    | PoModalComponent
    | undefined;
  

  //Variaveis locais
  sub!:Subscription
  labelTimer:string='Aguarde a liberação do arquivo...'
  labelTimerDetail:string=''
  labelPedExec:string=''
  telaTimerFoiFechada:boolean=false

  //contructor
  constructor(){
    effect(() => {
      
      if (this.numPedExec() === 1) {
        this.labelPedExec = 'Pedido Execução'
        this.labelTimer = 'Enviando dados para o RPW...'
        this.telaTimer?.open()
      }

      if (this.numPedExec() > 1) {
        this.sub = interval(this.intervalo()).subscribe(n => {
          // console.log(n) 
           this.labelPedExec = 'Pedido Execução:' + this.numPedExec() + ' (' + (n * 5).toString() + 's)'
           this.labelTimer = 'Aguarde a liberação do arquivo...  '

           //Controle de Numero de Tentativas
           if (n > this.tentativas()){
             this.sub.unsubscribe()
             this.telaTimer?.close()
           }

           //Chamar método para devolver a situacao do numero do pedido de execucao
           let param:any={numRPW:this.numPedExec()}
           this.srvTotvs46.piObterSituacaoRPW(param).subscribe({
             next: (response:any)=> {
               if (response.ok){
                 this.sub.unsubscribe()
                 this.labelPedExec = 'Pedido Execução: Executado com sucesso'
                 this.labelTimer = "Arquivo liberado !"
                 this.labelTimerDetail = "Utilize o Log de Arquivos para visualizar o arquivo gerado"
                 this.acaoCancelarTimer.label='Fechar'
                 this.execPedEvent.emit(true)
               }
             }
           })
       })
     }
    });
  }

  //Variavel do Modal
  acaoCancelarTimer: PoModalAction = {
    action: () => {
      this.fecharTimer()
      
    },
    label: 'Fechar',
  };

  //Encerrar o subscribe
  fecharTimer(){
    if(this.sub !== undefined){
       this.sub.unsubscribe()
    }
    this.telaTimer?.close()
    this.telaTimerFoiFechada=true
  }


}
