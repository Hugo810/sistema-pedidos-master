import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoServico } from '../modelos/produtoservico';



@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private apiUrl = 'http://localhost:8081/produtos'; // Altere para a URL da sua API

  constructor(private http: HttpClient) {}

  // Obter a lista de produtos
  getProdutos(): Observable<ProdutoServico[]> {
    return this.http.get<ProdutoServico[]>(this.apiUrl);
  }




// produto.service.ts
buscarPorNome(nome: string): Observable<ProdutoServico[]> {
  // Corrigindo a URL para usar parâmetros de consulta
  return this.http.get<ProdutoServico[]>(`${this.apiUrl}/buscarPorNome?nome=${nome}`);
}







  // Adicionar um novo produto
  adicionarProduto(produto: ProdutoServico): Observable<ProdutoServico> {
    return this.http.post<ProdutoServico>(this.apiUrl, produto);
  }

  // Atualizar um produto existente
  atualizarProduto(codigo: string, produto: ProdutoServico): Observable<ProdutoServico> {
    return this.http.put<ProdutoServico>(`${this.apiUrl}/${codigo}`, produto);
  }

  // Excluir um produto pelo código
  excluirProduto(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`);
  }

  // Obter um produto pelo código
  getProduto(codigo: string): Observable<ProdutoServico> {
    return this.http.get<ProdutoServico>(`${this.apiUrl}/${codigo}`);
  }
}
