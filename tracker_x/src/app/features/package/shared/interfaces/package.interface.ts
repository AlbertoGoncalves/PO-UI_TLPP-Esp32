export interface Package {
  filial: string;
  code: string;
  status: string;
  name: string;
  tipo: string;
  tracker: string;
  shipment: string;
  data: string;

}

  // 001=PREPARACAO;002=CARREGADO;003=EXPEDIDO;004=CONCLUIDO;
  // tipo: oPackage.tipo === "1" ? 'NORMAL'
  // : oPackage.tipo === "2" ? 'FRAGIL'
  // : oPackage.tipo === "3" ? 'PEREGOSA'
  // : oPackage.tipo === "4" ? 'ALTO VALOR'
  // : oPackage.tipo = "NÃO MAPEADO",
  // status: oPackage.status === "001" ? 'NORMAL'
  // : oPackage.status === "002" ? 'FRAGIL'
  // : oPackage.status === "003" ? 'PEREGOSA'
  // : oPackage.status === "004" ? 'ALTO VALOR'
