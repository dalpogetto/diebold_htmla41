import { Component, ViewChild } from '@angular/core';
import { PoStepperComponent, PoStepperModule, PoWidgetModule, PoLoadingModule } from '@po-ui/ng-components';
import { PoWidgetBaseComponent } from '@po-ui/ng-components/lib/components/po-widget/po-widget-base.component';
import { CalculoEstabUsuarioComponent } from '../calculo-estab-usuario/calculo-estab-usuario.component';
import { ParamestabComponent } from '../../paramestab/paramestab.component';
import { CalculoExtrakitComponent } from '../calculo-extrakit/calculo-extrakit.component';
import { CalculoResumoComponent } from '../calculo-resumo/calculo-resumo.component';
import { CalculoParametrosComponent } from '../calculo-parametros/calculo-parametros.component';

@Component({
  selector: 'app-calculo-step',
  standalone: true,
  imports: [PoStepperModule, 
            PoWidgetModule, 
            PoLoadingModule, 
            CalculoEstabUsuarioComponent,
            CalculoParametrosComponent,
            CalculoExtrakitComponent,
            CalculoResumoComponent
           ],
  templateUrl: './calculo-step.component.html',
  styleUrl: './calculo-step.component.css'
})
export class CalculoStepComponent {

  //----- Loadings
  loadTela:boolean=false
  loadLogin:boolean=false
  loadExcel:boolean=false
  labelLoadTela:string = ''
  loadTecnico: string = ''
  labelContadores:string[]=['0','0','0','0','0', '0', '0']

  //-------- Labels Stepper
  lblStepProximo: string = 'Avançar';
  lblStepAnterior: string = 'Voltar';
  lblStepExecutar: string = 'Montar Resumo';

  //-------- Listas
  listaTransp!: any[]
  listaEntrega!: any[]


  @ViewChild('stepper', { static: true }) stepper: PoStepperComponent | undefined;

  //------- Stepper
  canActiveNextStep(passo: any) {
    return true;

  }



}
