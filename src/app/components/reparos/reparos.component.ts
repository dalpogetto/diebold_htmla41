import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { Usuario } from '../../interfaces/usuario';
import { TotvsService } from '../../services/totvs-service.service';

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
colunasReparos!:PoTableColumn[]
cJustificativa!:string
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
        
        if (response === undefined){
          this.LogarUsuario()
        }
        else{
          this.codEstabel = response.codEstabelecimento
          this.codUsuario = response.codUsuario
          this.nrProcess  = response.nrProcesso
       }
      }
    })

    this.colunasReparos = this.srvTotvs.obterColunasReparos()

    let params: any = { codEmitente: this.codUsuario, nrProcess: this.nrProcess }
    this.srvTotvs.ObterItensParaReparo(params).subscribe({
      next:(response:any)=>{
        this.loadTela=false
        if (response === undefined){
          return
        }
        this.listaReparos = response.items

      }})
 }

 onAbrirReparos(){

  this.srvDialog.confirm({
    title: "GERAÇÃO E IMPRESSÃO DE REPAROS",
    message: "Deseja gerar e imprimir os reparos ?",
    confirm: () => {
      this.loadTela = true
      let param:any

      //Caso a lista de reparos tenha sido excluida pelo usuario enviar um registro 
      //com item em branco, codigo do estabelecimento e numero do processo
      

      if (this.listaReparos.length === 0){
        param = {reparos:[{"it-codigo":"", "cod-estabel": this.codEstabel, "nr-process": this.nrProcess}]}
      }
      else{
        param = {reparos:this.listaReparos}
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
    },
    cancel: () => {}
  })
  
 }

 
 LogarUsuario() {
    this.router.navigate(['seletor'], {queryParams:{redirectTo:'reparos'}}) 
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

  let registro = {...this.itemSelecionado, registroModificado}
  this.gridReparos?.updateItem(this.itemSelecionado, registro)

  this.telaAlterar?.close()
 }

 onCancelar(){
   this.telaAlterar?.close()
 }
 
}

