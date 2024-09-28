import { Component, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoModalModule, PoFieldModule, PoIconModule, PoButtonModule, PoTableModule, PoWidgetModule, PoWidgetComponent, PoI18nService, PoI18nModule } from '@po-ui/ng-components';
import { TotvsService } from '../../services/totvs-service.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, NgIf } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { PoI18nConfig } from '@po-ui/ng-components';
import { RpwComponent } from "../rpw/rpw.component";


const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true
  },
  contexts: {
    general: {
    },
  }
};


@Component({
    selector: 'app-seletor',
    templateUrl: './seletor.component.html',
    styleUrls: ['./seletor.component.css'],
    standalone: true,
    imports: [NgIf,
    PoFieldModule,
    FormsModule,
    PoIconModule,
    FormsModule,
    PoButtonModule,
    PoTableModule,
    PoWidgetModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    DecimalPipe,
    NgxMaskPipe, RpwComponent]
})
export class SeletorComponent {

public srvTotvs = inject(TotvsService)
private srvNotification = inject(PoNotificationService);
private route = inject(ActivatedRoute)
private router = inject(Router)


@ViewChild('loginModal', { static: true }) loginModal: | PoModalComponent | undefined;

numPedExec=signal(0)

  //ListasCombo
listaEstabelecimentos!: any[];
listaTecnicos!: any[];
codEstabel: string = '';
codUsuario: string = '';
usuarioLogado: boolean = false;
loadTecnico: string = '';
placeHolderEstabelecimento: string = '';
loadTela: boolean = false;
redirectTo!:string
mostrarLabel:boolean=false

acaoLogin: PoModalAction = {
  action: () => {this.onLogarUsuario();},
  label: 'Selecionar',
};

acaoCancelar: PoModalAction={
  action:()=> {this.router.navigate(['home'])},
  label: 'Cancelar '
}

private formBuilder = inject(FormBuilder);

//Formulario
public form = this.formBuilder.group({
  'Inclusao': [''],
  
});

colunas:any[]=[
        { property: 'descricao', label: "Descricao"},
        { property: 'campo', label: 'Valor', type: 'number', format:'1.3-3'}]
lista:any[]=[{campo:150.50, descricao:'teste'}, {campo:32.35, descricao:'teste'}, {campo:1601.351, descricao:'teste'}]

mostrarEvento(obj:any){
  
}

ngOnInit(): void {
  this.form.controls['Inclusao'].patchValue('só no sapatinho')
  PoI18nModule.config(i18nConfig)

  setTimeout(
    ()=> { this.numPedExec.update(()=> 1 )},1000)

  setTimeout(
    ()=> { this.numPedExec.update(()=> 1641307 )},1000)
  

  /*

this.mostrarLabel=false
this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') as string;

this.srvTotvs.EmitirParametros({ tituloTela: 'HTMLA41 - SELETOR DE ESTABELECIMENTO E USUÁRIO', estabInfo:''});

//Abrir Login
this.loginModal?.open()

//--- Carregar combo de estabelecimentos
this.placeHolderEstabelecimento = 'Aguarde, carregando lista...';
this.srvTotvs.ObterEstabelecimentos().subscribe({
  next: (response: any) => {
    this.listaEstabelecimentos = (response as any[]).sort(
      this.srvTotvs.ordenarCampos(['label']));
    
    this.placeHolderEstabelecimento = 'Selecione um estabelecimento';
  },
  error: (e) => {
    this.srvNotification.error('Ocorreu um erro na requisição');
    return;
  },
});
*/
}

onLogarUsuario() {
  if (this.codEstabel === '' || this.codUsuario === '') {
    this.srvNotification.error('Seleção inválida, verifique !');
    return;
  }

  this.mostrarLabel=true

  //Fechar a tela de login
  this.loginModal?.close();
  this.loadTela = true;

  //Setar usuario como logado
  this.usuarioLogado = true;

  
  //Parametros da Nota
  let paramsTec: any = {codEstabel: this.codEstabel, codTecnico: this.codUsuario};

  //Chamar Método
  this.srvTotvs.ObterNrProcesso(paramsTec).subscribe({
    next: (response: any) => {
      //Atualizar Informacoes Tela
      let estab = this.listaEstabelecimentos.find((o) => o.value === this.codEstabel);
      let tec = this.listaTecnicos.find((o) => o.value === this.codUsuario);
      this.srvTotvs.EmitirParametros({estabInfo: estab.label, tecInfo: tec.label, processoInfo:response.nrProcesso, processoSituacao: response.situacaoProcesso})
      
      //Setar Estabelecimento e Usuario utilizado no calculo
      this.srvTotvs.SetarUsuario(this.codEstabel, this.codUsuario, response.nrProcesso)
      this.router.navigate([this.redirectTo])
      this.loadTela=false
    },
    error: (e) => {
      this.srvNotification.error('Ocorreu um erro na requisição');
      return;
    },
  });
}

public onEstabChange(obj: string) {
  if (obj === undefined) return;

  //Popular o Combo do Emitente
  this.listaTecnicos = [];
  this.codUsuario = '';
  this.loadTecnico = `Populando técnicos estab: ${obj} ...`

  //Chamar servico
  this.srvTotvs.ObterEmitentesDoEstabelecimento(obj).subscribe({
    next: (response: any) => {
      this.listaTecnicos = response;
      this.loadTecnico = 'Selecione o técnico'
    },
    error: (e) =>
      this.srvNotification.error('Ocorreu um erro na requisição '),
  });
}


}
