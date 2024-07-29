import { Component, inject } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { TotvsService } from '../../../services/totvs-service.service';

import {
  PoComboComponent,
  PoDividerComponent,
  PoDividerModule,
  PoModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { PoComboBaseComponent } from '@po-ui/ng-components/lib/components/po-field/po-combo/po-combo-base.component';
import { delay } from 'rxjs';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-calculo-estab-usuario',
  standalone: true,
  imports: [FormsModule, PoModule, PoDividerModule],
  templateUrl: './calculo-estab-usuario.component.html',
  styleUrl: './calculo-estab-usuario.component.css',
})
export class CalculoEstabUsuarioComponent {
  private srvTotvs = inject(TotvsService);
  private srvNotification = inject (PoNotificationService)

  //--------- Variaveis Combobox
  codEstabelecimento: string = '';
  codTecnico: string = '';
  placeHolderEstabelecimento!: string;
  loadTecnico: string = '';

  //------- Listas
  listaEstabelecimentos!: any[];
  listaTecnicos!: any[];

  //----------------------------------------------------------------------------------- Inicializar
  ngOnInit(): void {

    //--- Titulo Tela
    this.srvTotvs.EmitirParametros({tituloTela: 'HTMLA41 - PARÂMETROS DE CÁLCULO'})

    //--- Tempo padrao notificacao
    this.srvNotification.setDefaultDuration(3000)

    //--- Carregar combo de estabelecimentos
    this.placeHolderEstabelecimento = 'Aguarde, carregando lista...'
    this.srvTotvs.ObterEstabelecimentos().subscribe({
      next: (response: any) => {
          this.listaEstabelecimentos = (response as any[]).sort(this.srvTotvs.ordenarCampos(['label']))
          this.placeHolderEstabelecimento = 'Selecione um estabelecimento'
      },
      error: (e) => {return}
    })
  }


  //------------------------------------------------------------ Change Estabelecimentos - Popular técnicos
  public onEstabChange(obj: string) {
    if (obj === undefined) return;

    //Popular o Combo do Emitente
    this.listaTecnicos = [];
    this.codTecnico = '';
    this.listaTecnicos.length = 0;
    this.loadTecnico = `Populando técnicos do estab ${obj} ...`;

    this.srvTotvs.ObterEmitentesDoEstabelecimento(obj).subscribe({
      next: (response: any) => {
        delay(200);

        this.listaTecnicos = response;
        this.loadTecnico = 'Selecione o técnico';
      },
    });
  }

  //------------------------------------------------------------- Change Tecnicos - Popular Endereco Entrega
  public onTecnicoChange(obj: string) {
    if (obj === undefined) return;

    //Setar Usuario Ambiente
    this.srvTotvs.SetarUsuarioAmbiente({codEstabelecimento:this.codEstabelecimento, codUsuario: this.codTecnico, nrProcesso:''})

    //Parametros estabelecimento e tecnico
    let params: any = {
      codEstabel: this.codEstabelecimento,
      codTecnico: this.codTecnico,
    };
    //Popular combos entrega
    this.srvTotvs.ObterEntrega(params).subscribe({
      next: (response: any) => {
         this.srvTotvs.PopularListaEntrega(response)
      },
      //error: (e) => this.srvNotification.error("Ocorreu um erro na requisição " ),
    });
  }
}
