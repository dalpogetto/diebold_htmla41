import { Component, Signal, ViewChild, inject, signal } from '@angular/core';
import { PoButtonModule} from '@po-ui/ng-components';
import { LoginComponent } from "../../login/login.component";



@Component({
    selector: 'app-seletor',
    templateUrl: './seletor.component.html',
    styleUrls: ['./seletor.component.css'],
    standalone: true,
    imports: [PoButtonModule,LoginComponent]
})

export class SeletorComponent {
  abrir = signal(false)

  executar(){
    //alert('Botao executar')
    this.abrir.update(() => true)
  }

  onLogin(obj:any){
    console.log(obj)
  }


}
