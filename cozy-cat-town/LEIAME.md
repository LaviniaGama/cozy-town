# 🐱 Cozy Cat Town

Jogo 3D de navegador (Three.js) inspirado em Cats & Soup: Fluffy Town.

## Como jogar
1. Abra um terminal nesta pasta e rode um servidor local (necessário para módulos ES e modelos GLB):
   - Windows: `py -m http.server 8080`
   - macOS/Linux: `python3 -m http.server 8080`
2. Abra http://localhost:8080 no navegador. O jogo, o Three.js e os modelos são arquivos locais; não é necessária conexão com a internet.

## Controles
Botão esquerdo e arrastar = girar a câmera · Botão direito e arrastar = mover a câmera · Scroll = zoom · WASD = mover câmera suavemente · `Shift` + WASD = mover mais rápido · Setas esquerda/direita = girar câmera · Setas cima/baixo = zoom · Clique = interagir. Segure e arraste um gatinho com o botão esquerdo para reposicioná-lo; um clique simples apenas interage e os gatos continuam passeando. Gatinhos não podem ser soltos dentro de construções. Ative **Mover** na barra inferior e arraste com o botão esquerdo sobre a vila para selecionar vários itens; os itens selecionados ficam realçados em verde translúcido. Escolha mover, guardar ou vender. Para mover um grupo, selecione os itens, escolha **Mover selecionados**, arraste até o destino e confirme; `R` gira e `Esc` cancela. Durante a colocação de flores, árvores ornamentais e pisos, segure o botão esquerdo e arraste para posicionar várias peças: movimentos retos formam linhas e movimentos diagonais preenchem uma área em grade. A quantidade respeita o estoque e os espaços ocupados.

## Progresso e personalização
- A tela inicial oferece continuar, começar uma nova vila e abrir as configurações. O progresso é salvo automaticamente no navegador. **Novo jogo** substitui o save atual por uma vila inicial limpa. Nas opções, **Voltar para o menu principal** retorna à tela inicial salvando o progresso; **Sair do jogo** salva e tenta fechar a aba. Se o navegador bloquear o fechamento, uma mensagem orienta a fechá-la manualmente.
- A vila começa com três gatinhos de aparência diferente; novos gatos chegam ao serem adotados.
- A loja da fazenda oferece 49 plantações, pacotes de sementes e 30 árvores frutíferas; há 100 receitas para produzir e pesquisar.
- Construa 20 instalações novas, guarde ou venda construções e decorações, e mova ou gire construções, pisos e objetos. Os canteiros e seu progresso são preservados ao guardar uma horta.
- Decore com mais de 400 itens organizados por categoria e busca. Cada categoria recebeu 20 novas peças; há 50 formatos de flores, 20 árvores ornamentais adicionais e 50 cores para personalizar flores, árvores e outros enfeites.
- Cada item pode ser comprado no acabamento original ou personalizado: escolha a cor antes de comprar e ela acompanha o objeto quando colocado, guardado ou movido. Os itens que já começam na fazenda também estão disponíveis no catálogo. Árvores frutíferas aparecem somente na loja da fazenda.
- Novas vilas começam com construções e enfeites organizados em áreas separadas; canteiros de flores do cenário e árvores de borda seguem um arranjo regular.
- Ao abrir uma horta, as sementes aparecem separadas por grupos, como grãos, hortaliças e frutas.
- Os painéis se ajustam à tela; quando o conteúdo é longo, a rolagem fica dentro do próprio painel.
- A cada nível, novas missões e itens ficam disponíveis. O progresso é salvo automaticamente no navegador.
- Nas cozinhas e oficinas, informe quantas unidades de uma receita deseja preparar. A quantidade é limitada apenas pelos ingredientes disponíveis; a fila não tem limite de tamanho.
- Nas configurações, é possível pausar e acelerar o relógio, ocultar etiquetas, reduzir animações, alternar sombras e recentralizar a câmera.

## Estrutura
`js/data.js` conteúdo · `state.js` estado + LocalStorage · `systems.js` regras (fazenda, produção, clientes, missões) · `world.js` cena, luz, ciclo dia/noite · `assets.js` carrega os GLB e aplica toon shading · `buildings.js` prédios/decorações · `cats.js` gatos e clientes · `place.js` construir/arrastar · `ui.js` menus · `main.js` loop.

## Modelos
Em `js/assets.js`, o objeto `DEF` define tamanho (`h`/`w`) e giro (`ry`, em radianos) de cada GLB. Se algum modelo estiver olhando para o lado errado ao andar, ajuste `ry` (ex.: `Math.PI` ou `Math.PI/2`). A coleção usa `cute_cat_with_strawberries.glb` e `cat_money_10_dollars.glb`.
As texturas dos GLB são usadas originais, sem nenhuma redução.

O runtime Three.js 0.160.0 e os addons usados pelo jogo estão em `vendor/three/`, sob a licença MIT incluída nessa pasta.
