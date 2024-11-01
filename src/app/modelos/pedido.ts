// pedido.model.ts
import { ItemPedido } from "../Services/pedido.service";
import { Cliente } from "./cliente";
import { ProdutoServico } from "./produtoservico";


export interface Pedido {
  codigo: number; // Alterado para number
  cliente: Cliente;
  lista: ItemPedido[];
  valorTotal: number;
  dataServico: string; // A data é uma string no JSON
  produto:string;
  descricao:string;
}
