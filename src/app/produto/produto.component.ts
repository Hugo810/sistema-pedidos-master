import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../Services/produto.service';
import { ProdutoServico } from '../modelos/produtoservico';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
})
export class ProdutoComponent implements OnInit {
  produtos: ProdutoServico[] = [];
  nomeBusca: string = ''; // Alterado para string
  novoProduto: ProdutoServico = {
    codigo: 0,
    nome: '',
    qtde: 0,
    valor: 0,
  };

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  // Obter a lista de produtos
  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe((data) => {
      this.produtos = data;
    });
  }

  // Adicionar um novo produto
  adicionarProduto(): void {
    this.produtoService.adicionarProduto(this.novoProduto).subscribe((produtoAdicionado) => {
      this.produtos.push(produtoAdicionado); // Adiciona o produto à lista local
      this.resetarNovoProduto();
    });
  }

  // Atualizar um produto existente
  atualizarProduto(): void {
    this.produtoService.atualizarProduto(String(this.novoProduto.codigo), this.novoProduto).subscribe(() => {
      this.carregarProdutos(); // Recarrega a lista de produtos
      this.resetarNovoProduto();
    });
  }

  // Buscar um produto pelo código
  buscarProduto(codigo: number): void {
    this.produtoService.getProduto(String(codigo)).subscribe((produto) => {
      this.novoProduto = produto; // Preenche o formulário com os dados do produto encontrado
    }, error => {
      console.error('Erro ao buscar produto:', error);
    });
  }

  // Método para buscar produtos pelo nome
  buscarProdutos(): void {
    this.produtoService.buscarPorNome(this.nomeBusca).subscribe((produtos) => {
      this.produtos = produtos;
    }, error => {
      console.error('Erro ao buscar produtos:', error);
    });
  }

  // Excluir um produto
  excluirProduto(codigo: number): void {
    if (confirm('Você tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluirProduto(String(codigo)).subscribe(() => {
        this.carregarProdutos(); // Recarrega a lista de produtos após a exclusão
      }, error => {
        console.error('Erro ao excluir produto:', error);
      });
    }
  }

  // Resetar o formulário de produto
  resetarNovoProduto(): void {
    this.novoProduto = {
      codigo: 0,
      nome: '',
      qtde: 0,
      valor: 0,
    };
  }
}
