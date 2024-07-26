import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { Usuario } from '../../interfaces/usuario';
import { TotvsService } from '../../services/totvs-service.service';
import { Reparo } from '../../interfaces/reparo';

@Component({
  selector: 'app-reparos',
  templateUrl: './reparos.component.html',
  styleUrls: ['./reparos.component.css']
})
export class ReparosComponent {

  @ViewChild('telaAlterar', { static: true }) telaAlterar: | PoModalComponent | undefined;
  @ViewChild('gridReparos', { static: true }) gridReparos: | PoTableComponent | undefined;

//---Injection
private srvTotvs = inject(TotvsService);
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

  if (registroModificado["l-equivalente"])
     registroModificado["desc-item-equiv"] = this.cJustificativa

  this.telaAlterar?.close()

  //let registro = {...this.itemSelecionado, registroModificado}
  this.gridReparos?.updateItem(this.itemSelecionado, registroModificado)
 }

 onCancelar(){
   this.telaAlterar?.close()
 }


 removeAttrFromObject = <O extends object, A extends keyof O>(
  object: O, attr: A): Omit<O, A> => {
  const newObject = { ...object }

  if (attr in newObject) {
    delete newObject[attr]
  }

  return newObject
}
 
}

