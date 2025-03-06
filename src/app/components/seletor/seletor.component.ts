import { ChangeDetectionStrategy, Component, ElementRef, Signal, ViewChild, inject, signal } from '@angular/core';
import { PoButtonModule, PoTableComponent, PoTableModule} from '@po-ui/ng-components';
import { LoginComponent } from "../../login/login.component";
import { CardComponent } from '../card/card.component';
import { PoTableBaseComponent } from '@po-ui/ng-components/lib/components/po-table/po-table-base.component';




@Component({
    selector: 'app-seletor',
    templateUrl: './seletor.component.html',
    styleUrls: ['./seletor.component.css'],
    standalone: true,
    imports: [PoButtonModule,CardComponent, PoTableModule]
})

export class SeletorComponent {
  cDescricao:string = "mouse"

  public lista=[{campo:true}, {campo:false}]

  constructor(private el: ElementRef) {
  }
  
Executar(event:any){
  console.log(event)
  
 
} 

selecionar(obj:any){
 // let marcador = (document.querySelector('td.po-table-column-selectable') as HTMLInputElement)
 // let check = marcador.firstChild?.firstChild
 let marcador = (document.querySelector('div.container-po-checkbox') as HTMLInputElement)
 marcador.setAttribute("checked", "false")
 
  
  console.log(marcador)
 
 

  

 // let elementos = document.querySelectorAll<HTMLElement>('td.po-table-column-selectable') 
 //   elementos.forEach(item => item.style.display = 'none')

    
   // console.log("raiz", (filtro))
   // console.log("pai", (filtro.childNodes[0]).('ng-reflect-checkbox-value', false))
}

naoSelecionar(obj:any){
  let marcador = (document.querySelector('td.po-table-column-selectable') as HTMLInputElement)
  console.log(marcador)

}


}
