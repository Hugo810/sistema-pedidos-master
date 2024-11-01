import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelos/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8081/clientes';

  constructor(private http: HttpClient) {}

  /**
   * Obtém todos os clientes.
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * Obtém um cliente pelo código.
   * @param codigo Código do cliente
   */
  buscarCliente(codigo: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${codigo}`);
  }

  buscarPorNome(nome: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscarPorNome/${nome}`);
  }

  /**
   * Adiciona um novo cliente.
   * @param cliente Objeto cliente
   */
  adicionarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * Atualiza as informações de um cliente.
   * @param codigo Código do cliente a ser atualizado
   * @param cliente Objeto cliente atualizado
   */
  atualizarCliente(codigo: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${codigo}`, cliente);
  }

  /**
   * Exclui um cliente pelo código.
   * @param codigo Código do cliente a ser excluído
   */
  excluirCliente(codigo: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${codigo}`);
  }
}
