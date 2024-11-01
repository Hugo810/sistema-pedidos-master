import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cliente } from '../modelos/cliente';
import { GoogleCalendarService } from './GoogleCalendarService';

export interface ProdutoServico {
  codigo: number;
  nome: string;
  qtde: number;
  valor: number;
}

export interface ItemPedido {
  codigo: number;
  produtoServico: ProdutoServico;
  qtdeItem: number;
}

export interface Pedido {
  codigo: number;
  valorTotal: number;
  dataServico: string;
  descricao: string;
  cliente: Cliente;
  lista: ItemPedido[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private Url = 'http://localhost:8081/pedidos';

  constructor(
    private http: HttpClient,
    private googleCalendarService: GoogleCalendarService
  ) {}

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.Url).pipe(catchError(this.handleError));
  }

  adicionarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.Url, pedido).pipe(catchError(this.handleError));
  }

  buscarClientesPorNome(nome: string): Observable<Cliente[]> {
    const url = `${this.Url}/clientes/nome/${nome}`;
    return this.http.get<Cliente[]>(url).pipe(catchError(this.handleError));
  }

  buscarProdutoPorNome(nome: string): Observable<ProdutoServico[]> {
    const url = `${this.Url}/produtos/nome/${nome}`;
    return this.http.get<ProdutoServico[]>(url).pipe(catchError(this.handleError));
  }

  criarEvento(pedido: Pedido): Observable<any> {
    const event = {
      summary: pedido.descricao,
      start: {
        dateTime: pedido.dataServico,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(new Date(pedido.dataServico).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
    };

    const accessToken = this.googleCalendarService.getAccessToken();

    if (!accessToken) {
      console.error('Token de acesso não encontrado.');
      return throwError(() => new Error('Não foi possível autenticar com o Google Calendar.'));
    }

    return this.http.post(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, event, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro:', error);
    return throwError(() => new Error('Erro ao executar operação.'));
  }
}
