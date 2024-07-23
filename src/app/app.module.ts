import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalculoComponent } from './components/calculo/calculo.component';
import { HomeComponent } from './components/home/home.component';
import { InformeComponent } from './components/informe/informe.component';
import { ParamestabComponent } from './components/paramestab/paramestab.component';
import { EmbalagemComponent } from './components/embalagem/embalagem.component';
import { ReparosComponent } from './components/reparos/reparos.component';
import { SeletorComponent } from './components/seletor/seletor.component';
import { MonitorProcessosComponent } from './components/monitor-processos/monitor-processos.component';
import { ResumoFinalComponent } from './components/resumo-final/resumo-final.component';
import { BtnDownloadComponent } from './components/btn-download/btn-download.component';
import { CardComponent } from './components/card/card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CalculoComponent,
    HomeComponent,
    InformeComponent,
    ParamestabComponent,
    EmbalagemComponent,
    ReparosComponent,
    SeletorComponent,
    MonitorProcessosComponent,
    ResumoFinalComponent,
    BtnDownloadComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([])
  ],

 
  providers: [provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
