import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent, PoLoadingModule, PoWidgetModule, PoButtonModule, PoTooltipModule, PoTableModule, PoFieldModule, PoModalModule } from '@po-ui/ng-components';
import { Usuario } from '../../interfaces/usuario';
import { TotvsService } from '../../services/totvs-service.service';
import { Reparo } from '../../interfaces/reparo';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TotvsService46 } from '../../services/totvs-service-46.service';

@Component({
    selector: 'app-reparos',
    templateUrl: './reparos.component.html',
    styleUrls: ['./reparos.component.css'],
    standalone: true,
    imports: [NgIf, PoLoadingModule, PoWidgetModule, PoButtonModule, PoTooltipModule, PoTableModule, PoFieldModule, FormsModule, PoModalModule]
})
export class ReparosComponent {

  @ViewChild('telaAlterar', { static: true }) telaAlterar: | PoModalComponent | undefined;
  @ViewChild('gridReparos', { static: true }) gridReparos: | PoTableComponent | undefined;

//---Injection
private srvTotvs = inject(TotvsService);
private srvTotvs46 = inject(TotvsService46);
private srvNotification = inject(PoNotificationService);
private srvDialog = inject(PoDialogService);
private router = inject(Router)

codEstabel: string = '';
codUsuario: string = '';
nrProcess:string='';
loadTela:boolean=false
lEQV:boolean=false
listaReparos!:any[]
listaTemp = new Array<any>
colunasReparos!:PoTableColumn[]
cJustificativa:string=''
itemSelecionado:any

readonly acaoSalvar: PoModalAction = {
  label: 'Salvar',
  action: () => { this.onSalvar() },
}


readonly acaoCancelar: PoModalAction = {
  label: 'Cancelar',
  action: () => { this.onCancelar() }
}

//--- Actions
readonly acoesGrid: PoTableAction[] = [
  {
    label: 'Editar',
    icon: 'bi bi-pencil-square',
    action: this.onEditar.bind(this),
  },
  {
    separator:true,
    label: 'Eliminar',
    icon: 'bi bi-trash',
    action: this.onDeletar.bind(this),
    type:'danger'
  }];

  lequiv:boolean=false
  itCodigoEquiv=''
  qtdEquiv=0
  numSerie=''
  lErroSerie:boolean=false

  tagEquiv(){}

  ngOnInit(): void {

    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - CRIAÇÃO DE REPAROS'});
    this.loadTela = true

    this.srvTotvs.ObterUsuario().subscribe({
      next:(response:Usuario)=>{
          this.codEstabel = response.codEstabelecimento
          this.codUsuario = response.codUsuario
          this.nrProcess  = response.nrProcesso
      }
    })

    this.colunasReparos = this.srvTotvs.obterColunasReparos()

    let params: any = { codEmitente: this.codUsuario, nrProcess: this.nrProcess }
    this.srvTotvs.ObterItensParaReparo(params).subscribe({
      next:(response:any)=>{
        this.loadTela=false
        console.log("info", response)
        if (response === undefined){
          return
        }
        this.listaReparos = response.items
      }})
 }

 chamarCriacao(){
    let param:any
    if (this.gridReparos?.items.length === 0){
      param = {reparos:[{"it-codigo":"", "cod-estabel": this.codEstabel, "nr-process": this.nrProcess}]}
    }
    else{
      param = {reparos:this.gridReparos?.items}
    }

    this.srvTotvs.AbrirReparo(param).subscribe({
      next: (response:any)=> {
        this.loadTela = false
        if (response.NumPedExec > 0)
            this.srvNotification.success('Gerado pedido de execução para criação e impressão de reparos: ' + response.NumPedExec)
          else
            this.srvNotification.success('Processo atualizado com sucesso !')

          this.router.navigate(['monitor'])
        }
    })
 }

 onAbrirReparos(){
  this.srvDialog.confirm({
    title: "GERAÇÃO E IMPRESSÃO DE REPAROS",
    message: "Deseja gerar e imprimir os reparos ?",
    confirm: () => {


       //Associar a justificativa aos reparos
       this.gridReparos?.items.forEach((item:Reparo)=>{ item["desc-item-equiv"]= this.cJustificativa })
        

        //Antes de Validar - Regra Excecao de Equivalencia
        let lExcecao = true
        this.gridReparos?.items.forEach((item:Reparo) =>{
          if(!item['l-equivalente'])
            lExcecao=false
          else if(item['l-equivalente'] && item['it-codigo'].substring(0,6) === item['it-codigo-equiv'].substring(0,6) && item['it-codigo'].substring(0,2) === "98")
            lExcecao=false
        })

        //Enviar a lista de reparos e justificativa
        let params:any={itemsReparo:this.gridReparos?.items}

        if (lExcecao === true){
          this.srvDialog.confirm({
            title: 'EQUIVALENCIA POR EXCEÇÃO',
            message: 'Confirma equivalencia por excecao do item?',
            confirm: () => { 
              this.loadTela = true
              this.srvTotvs.ValidarItensReparo(params).subscribe({
                next: (response:any) =>{
                  if(response.ok !== undefined)
                    this.chamarCriacao()
                },
                error:(e)=> {this.loadTela = false}
              })
            },
            cancel: () => {this.loadTela = false },
          });
        }
        else {
          this.loadTela = true
          this.srvTotvs.ValidarItensReparo(params).subscribe({
            next: (response:any) =>{
              if(response.ok !== undefined)
                this.chamarCriacao()
            },
            error:(e)=>{this.loadTela = false}
          })
        }
      },
        cancel: () => {this.loadTela = false}
      })
 }

 onDeletar(obj:any){
  
  this.srvDialog.confirm({
    title: 'CONFIRMAÇÃO',
    message: 'Confirma exclusão do Reparo?',
    literals: { cancel: 'Não', confirm: 'Sim' },
    confirm: () => { this.gridReparos?.removeItem(obj)},
    cancel: () => {},
  });
  
 }
 onDeletarTodos(){
  this.srvDialog.confirm({
    title: 'CONFIRMAÇÃO',
    message: 'Confirma exclusão do Reparo?',
    literals: { cancel: 'Não', confirm: 'Sim' },
    confirm: () => { 
        this.gridReparos?.items.forEach(item => this.gridReparos?.removeItem(item))
    },
    cancel: () => {},
  });
 }

 onEditar(obj:any){
  this.itemSelecionado = obj
  this.itCodigoEquiv = this.itemSelecionado["it-codigo-equiv"]
  this.qtdEquiv = this.itemSelecionado["qt-equiv"]
  this.numSerie = this.itemSelecionado["num-serie-it"]
  this.telaAlterar?.open()
 }

 onSalvar(){
  let registroModificado = this.itemSelecionado
  let itemNaoFormatado = this.itCodigoEquiv
  let itemFormatado=''
  if (itemNaoFormatado !== ''){
     itemFormatado = itemNaoFormatado!.substring(0,2) + '.' +
                     itemNaoFormatado!.substring(2,5) + '.' +
                     itemNaoFormatado!.substring(5,10) + '-' +
                     itemNaoFormatado!.substring(10)
  }

  registroModificado["it-codigo-equiv"] = itemFormatado
  registroModificado["qt-equiv"] =  this.qtdEquiv
  registroModificado["l-equivalente"] = itemFormatado !== ''
  registroModificado["num-serie-it"] = this.numSerie

  if (registroModificado["l-equivalente"])
     registroModificado["desc-item-equiv"] = this.cJustificativa

  this.telaAlterar?.close()

  //let registro = {...this.itemSelecionado, registroModificado}
  if (this.lErroSerie)
    registroModificado["num-serie-it"] = '0'
  this.gridReparos?.updateItem(this.itemSelecionado, registroModificado)
 }

 onCancelar(){
   this.telaAlterar?.close()
 }

 //Montar o objeto para salvar informacoes do item da os
 onLeaveNumSerie(){
  let params: any = { itCodigo: this.itemSelecionado["it-codigo"], numSerieItem: this.numSerie }
  if(this.numSerie === '0' || this.numSerie==='') return
  this.lErroSerie=false

  this.srvTotvs46.ValidarSerie(params).subscribe({
    next: (response: any) => {
      //console.log("serieFormatada", response.serieFormatada)
      
    },
    error:(e)=>{ 
         let registroModificado=this.itemSelecionado
         this.numSerie='0';
         registroModificado["num-serie-it"] = '0'
         this.gridReparos?.updateItem(this.itemSelecionado, registroModificado)}
  });
}


 
 
}

