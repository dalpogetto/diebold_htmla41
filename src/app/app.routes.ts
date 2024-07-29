import { Routes } from "@angular/router";

export const APP_ROUTES: Routes=[
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path:'home', loadComponent:()=> import('../app/components/home/home.component').then(c=>c.HomeComponent)},
    {path:'informe', loadComponent:()=> import('../app/components/informe/informe.component').then(c=>c.InformeComponent)},
    {path:'dashboard', loadComponent:()=> import('../app/components/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
    {path:'calculo', loadComponent:()=> import('../app/components/calculo/calculo.component').then(c=>c.CalculoComponent)},
    {path:'calculo-step', loadComponent:()=> import('../app/components/calculo/calculo-step/calculo-step.component').then(c=>c.CalculoStepComponent)},
    {path:'paramestab', loadComponent:()=> import('../app/components/paramestab/paramestab.component').then(c=>c.ParamestabComponent)},
    {path:'paramestab', loadComponent:()=> import('../app/components/paramestab/paramestab.component').then(c=>c.ParamestabComponent)},
    {path:'embalagem', loadComponent:()=> import('../app/components/embalagem/embalagem.component').then(c=>c.EmbalagemComponent)},
    {path:'reparos', loadComponent:()=> import('../app/components/reparos/reparos.component').then(c=>c.ReparosComponent)},
    {path:'monitor', loadComponent:()=> import('../app/components/monitor-processos/monitor-processos.component').then(c=>c.MonitorProcessosComponent)},
    {path:'resumofinal', loadComponent:()=> import('../app/components/resumo-final/resumo-final.component').then(c=>c.ResumoFinalComponent)},
    {path:'seletor', loadComponent:()=> import('../app/components/seletor/seletor.component').then(c=>c.SeletorComponent)},
];
