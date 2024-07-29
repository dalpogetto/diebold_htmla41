// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  versao:'1.0.000',
  totvs_url: 'https://totvsapptst.dieboldnixdorf.com.br:8143/api/integracao/aat/v1/apiesaa041',
  totvs46_url: 'https://totvsapptst.dieboldnixdorf.com.br:8143/api/integracao/aat/v1/apiesaa046',
  totvs_header:{
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa("super:prodiebold11"),
    'CompanyId': 1
  },
  
  totvs_spool: 'http://10.151.120.56/SPOOL/'
  
};


