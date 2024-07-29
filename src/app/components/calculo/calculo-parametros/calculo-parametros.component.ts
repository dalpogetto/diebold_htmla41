import { Component, computed, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { TotvsService } from '../../../services/totvs-service.service';

@Component({
  selector: 'app-calculo-parametros',
  standalone: true,
  imports: [FormsModule, PoModule,],
  templateUrl: './calculo-parametros.component.html',
  styleUrl: './calculo-parametros.component.css'
})
export class CalculoParametrosComponent {

  //Injecao Dependencia
  private srvTotvs = inject(TotvsService);

  //Campos Tela
  codTransEnt: string = ''
  codTransSai: string = ''
  codEntrega: string = ''
  serieSaida: string=''
  serieEntra: string=''

  //Lista Combos
  listaTransp!: any[]
  listaEntrega!: any[]

    //----------------------------------------------------------------------------------- Inicializar
    ngOnInit(): void {

      this.codTransEnt = this.srvTotvs.codTransEnt()
      this.codTransSai = this.srvTotvs.codTransSai()
      this.codEntrega = this.srvTotvs.codEntrega()
      this.listaEntrega = this.srvTotvs.listaEntrega()
      this.listaTransp = this.srvTotvs.listaTransp()
      
    }




}
