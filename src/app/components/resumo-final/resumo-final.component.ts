import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoNotificationService, PoTableColumn, PoTableLiterals, PoLoadingModule, PoWidgetModule, PoButtonModule, PoTableModule } from '@po-ui/ng-components';
import { TotvsService } from '../../services/totvs-service.service';
import { TotvsService46 } from '../../services/totvs-service-46.service';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/usuario';
import { BtnDownloadComponent } from '../btn-download/btn-download.component';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-resumo-final',
    templateUrl: './resumo-final.component.html',
    styleUrl: './resumo-final.component.css',
    standalone: true,
    imports: [NgIf, PoLoadingModule, PoWidgetModule, PoButtonModule, PoTableModule, BtnDownloadComponent]
})
export class ResumoFinalComponent implements OnInit {
  private srvTotvs = inject(TotvsService)
  private srvTotvs46 = inject(TotvsService46)
  private srvDialog  = inject(PoDialogService)
  private srvNotification = inject(PoNotificationService)
  private router = inject(Router)

  arquivoInfoOS:string=''
  urlInfoOs:string=''
  urlSpool:string=''
  listaArquivos!:any[]
  colunasArquivos!: PoTableColumn[]
  nrProcess:string=''
  codEstabel:string=''
  loadTela:boolean=false

   //---Inicializar
   ngOnInit(): void {

    this.urlSpool = environment.totvs_spool
    this.colunasArquivos = this.srvTotvs46.obterColunasArquivos()

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - RESUMO CONFERÊNCIA DE OS'})

    //--- Login Unico
    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
        
       
        if (response === undefined){
          this.srvTotvs.EmitirParametros({estabInfo:''})
        }
        else{
          this.nrProcess = response.nrProcesso
          this.codEstabel = response.codEstabelecimento

          //Arquivo Gerado
          let params:any={nrProcess: response.nrProcesso, situacao:'L'}
          this.srvTotvs46.ObterArquivo(params).subscribe({
            next:(item:any)=>{
              if(item === null) return
              this.listaArquivos = item.items ?? null
            }
          })

      }}})
  }

  onGerarResumo(){
     this.srvDialog.confirm({
      title: 'ARQUIVO CONFERÊNCIA DE OS',
      message: "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> GERAR ARQUIVO ?</span></div>",
        confirm: () => {
          this.loadTela = true;
          let params:any={iExecucao:2, nrProcess:this.nrProcess}
          this.srvTotvs.ImprimirConfOS(params).subscribe({
            next:(response:any)=>{

              let params2:any={nrProcess: this.nrProcess, situacao:'L'}
              this.srvTotvs46.ObterArquivo(params2).subscribe({
                next:(item:any)=>{
                  if(item === null) return
                  this.listaArquivos = item.items ?? null
                }
              })

              this.loadTela = false;
              this.srvNotification.success('Gerado pedido de execução : ' + response.NumPedExec);
            },
            error: (e) => {
              this.loadTela = false;
            }})
        },
        cancel: () => {}
      });
  }

  onFinalizar(){
    this.srvDialog.confirm({
      title: `FINALIZAR PROCESSO: ${this.nrProcess}`,
      message: "<div class='dlg'><i class='bi bi-question-circle po-font-subtitle'></i><span class='po-font-text-large'> DESEJA FINALIZAR O PROCESSO ?</span></div>",
        confirm: () => {
          this.loadTela = true;
          
          let params:any={codEstabel:this.codEstabel, nrProcess:this.nrProcess}
          this.srvTotvs.EncerrarProcesso(params).subscribe({
            next:(response:any)=>{
              this.loadTela = false;
              this.router.navigate(['monitor'])
            },
            error: (e) => {
              this.loadTela = false;
            }})
        },
        cancel: () => {}
      });


  }
}
