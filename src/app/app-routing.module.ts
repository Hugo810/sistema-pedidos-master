import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component'; // Certifique-se de que o caminho está correto
import { PedidoComponent } from './pedido/pedido.component'; // Certifique-se de que o caminho está correto
import { ProdutoComponent } from './produto/produto.component'; // Certifique-se de que o caminho está correto
import { InicioComponent } from './inicio/inicio.component'; // Adicione o componente 'Inicio'

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Redireciona para /inicio ao acessar a raiz
  { path: 'inicio', component: InicioComponent }, // Rota para 'inicio'
  { path: 'cliente', component: ClienteComponent }, // Rota para cliente
  { path: 'pedido', component: PedidoComponent }, // Rota para pedido
  { path: 'produto', component: ProdutoComponent }, // Rota para produto
  { path: '**', redirectTo: 'inicio' } // Rota coringa para rotas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
