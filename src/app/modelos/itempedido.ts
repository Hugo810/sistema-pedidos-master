// item-pedido.model.ts

export interface ProdutoServico {
  codigo: number;
  nome: string;
  qtde: number; // ou outra propriedade que você precisa
  valor: number; // ou valorprod se for o que você pretende usar
}

export interface ItemPedido {
  produtoServico: ProdutoServico;
  qtdeItem: number;
 
}
