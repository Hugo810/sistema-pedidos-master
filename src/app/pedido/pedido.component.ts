import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { PedidoService, Pedido, ItemPedido } from '../Services/pedido.service';
import { Cliente } from '../modelos/cliente';
import { ProdutoServico } from '../modelos/itempedido';
import { GoogleCalendarService } from './../Services/GoogleCalendarService';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
})
export class PedidoComponent implements OnInit {
  produtoControl = new FormControl();
  clienteControl = new FormControl();
  pedidos: Pedido[] = [];
  pedido: Pedido = this.novoPedido();
  novoItem: ItemPedido = this.novoItemPedido();
  clientesFiltrados!: Observable<Cliente[]>;
  produtosFiltrados!: Observable<ProdutoServico[]>;

  constructor(
    private pedidoService: PedidoService,
    private googleCalendarService: GoogleCalendarService
  ) {}

  ngOnInit(): void {
    // Carregar a biblioteca do Google antes de autenticar
    this.googleCalendarService.loadGsiLibrary()
      .then(() => this.googleCalendarService.authenticate())
      .then(() => {
        console.log('Usuário autenticado com sucesso.');
        this.carregarPedidos();
        this.configurarAutocompleteClientes();
        this.configurarAutocompleteProdutos();
      })
      .catch((error: any) => { // Especificando o tipo do erro como 'any'
        console.error('Erro durante a inicialização:', error);
      });
  }


  novoPedido(): Pedido {
    return {
      codigo: 0,
      valorTotal: 0,
      dataServico: '',
      descricao: '',
      cliente: { codigo: 0, nome: '' },
      lista: [],
    };
  }

  novoItemPedido(): ItemPedido {
    return {
      codigo: 0,
      produtoServico: { codigo: 0, nome: '', qtde: 0, valor: 0 },
      qtdeItem: 1,
    };
  }

  carregarPedidos(): void {
    this.pedidoService.listarPedidos().subscribe(
      (data) => (this.pedidos = data),
      (error) => console.error('Erro ao carregar pedidos:', error)
    );
  }

  configurarAutocompleteClientes(): void {
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      switchMap((nome) =>
        typeof nome === 'string' && nome.length > 0
          ? this.pedidoService.buscarClientesPorNome(nome)
          : of([])
      )
    );
  }

  configurarAutocompleteProdutos(): void {
    this.produtosFiltrados = this.produtoControl.valueChanges.pipe(
      startWith(''),
      switchMap((nome) =>
        typeof nome === 'string' && nome.length > 0
          ? this.pedidoService.buscarProdutoPorNome(nome)
          : of([])
      )
    );
  }

  selecionarCliente(cliente: Cliente): void {
    this.pedido.cliente = cliente;
    this.clienteControl.setValue(cliente.nome);
  }

  selecionarProduto(produto: ProdutoServico): void {
    this.novoItem.produtoServico = produto;
    this.produtoControl.setValue(produto.nome);
  }

  async adicionarPedido(): Promise<void> {
    if (!this.pedido.cliente.codigo) {
      alert('Por favor, selecione um cliente antes de adicionar o pedido.');
      return;
    }

    try {
      const novoPedido = await this.pedidoService.adicionarPedido(this.pedido).toPromise();

      if (novoPedido) {
        console.log('Pedido adicionado com sucesso:', novoPedido);

        this.pedido = this.novoPedido();
        this.carregarPedidos();

        await this.googleCalendarService.addEvent({
          summary: 'Novo Pedido: ' + novoPedido.codigo,
          start: { dateTime: new Date().toISOString(), timeZone: 'America/Sao_Paulo' },
          end: { dateTime: new Date(new Date().getTime() + 3600000).toISOString(), timeZone: 'America/Sao_Paulo' }
        });

        console.log('Evento criado no Google Calendar com sucesso!');
      } else {
        console.error('Falha ao obter o novo pedido.');
      }
    } catch (error) {
      console.error('Erro ao adicionar pedido ou criar evento:', error);
    }
  }

  adicionarItem(): void {
    const { produtoServico, qtdeItem } = this.novoItem;

    if (!produtoServico.codigo) {
      alert('Produto não encontrado ou inválido.');
      return;
    }

    const itemExistente = this.pedido.lista.find(
      (item) => item.produtoServico.codigo === produtoServico.codigo
    );

    if (itemExistente) {
      itemExistente.qtdeItem += qtdeItem;
    } else {
      this.pedido.lista.push({ ...this.novoItem });
    }

    this.calcularValorTotal();
    this.novoItem = this.novoItemPedido();
  }

  calcularValorTotal(): void {
    this.pedido.valorTotal = this.pedido.lista.reduce(
      (total, item) => total + item.produtoServico.valor * item.qtdeItem,
      0
    );
  }

  private validarProduto(produto: ProdutoServico): boolean {
    return (
      produto &&
      typeof produto.codigo === 'number' &&
      typeof produto.nome === 'string' &&
      typeof produto.qtde === 'number' &&
      typeof produto.valor === 'number'
    );
  }
}
