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
    imports: [PoButtonModule,LoginComponent, CardComponent, PoTableModule]
})

export class SeletorComponent {
  cDescricao:string = "mouse"

  constructor(private el: ElementRef) {
  }
  
Executar(event:any){
  console.log(event)
  
 
} 
}



