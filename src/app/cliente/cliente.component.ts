import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../Services/cliente.service';
import { Cliente } from '../modelos/cliente'; // Importando a interface Cliente

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'] // Incluindo arquivo de estilo
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = []; // Alterado para o tipo correto
  cliente: Cliente = { codigo: 0, nome: '' }; // Objeto cliente
  buscanome:any;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data) => (this.clientes = data),
      (error) => console.error('Erro ao carregar clientes:', error)
    );
  }

  buscarClientePorCodigo(): void {
    const codigo = this.cliente.codigo;
    this.clienteService.getClientes().subscribe(
      (data) => (this.clientes = data),
      (error) => console.error('Erro ao buscar cliente:', error)
    );
  }
  buscarClientes(): void {
   
    this.clienteService.buscarPorNome(this.buscanome).subscribe((data: Cliente[]) => {
      this.clientes = data;
    }, error => {
      console.error('Erro ao buscar clientes:', error);
    });
  }

  adicionarCliente(): void {
    this.clienteService.adicionarCliente(this.cliente).subscribe(
      () => {
        this.carregarClientes();
        this.resetarCliente(); // Resetando o formulário
      },
      (error) => console.error('Erro ao adicionar cliente:', error)
    );
  }

  atualizarCliente(): void {
    const codigo = this.cliente.codigo;
    this.clienteService.atualizarCliente(codigo, this.cliente).subscribe(
      () => {
        this.carregarClientes();
        this.resetarCliente();
      },
      (error) => console.error('Erro ao atualizar cliente:', error)
    );
  }

  excluirCliente(codigo: number): void {
    this.clienteService.excluirCliente(codigo).subscribe(
      () => this.carregarClientes(),
      (error) => console.error('Erro ao excluir cliente:', error)
    );
  }

  selecionarCliente(cliente: Cliente): void {
    this.cliente = { ...cliente }; // Preenche o formulário com os dados do cliente selecionado
  }

  resetarCliente(): void {
    this.cliente = { codigo: 0, nome: '' };
  }
}
