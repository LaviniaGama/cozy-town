# 🐱 Cozy Cat Town

Jogo 3D de navegador (Three.js) inspirado em Cats & Soup: Fluffy Town.

## Como jogar
1. Abra um terminal nesta pasta e rode um servidor local (necessário para carregar módulos e modelos GLB):
   - `python3 -m http.server 8080`  (ou dê dois cliques em `iniciar.bat` / rode `./iniciar.sh`)
2. Abra http://localhost:8080 no navegador (precisa de internet: o Three.js é carregado do CDN jsDelivr).

## Controles
Arrastar = girar câmera · Scroll = zoom · Clique = interagir · Arrastar decorações = mover · R = girar objeto · Esc = cancelar.

## Estrutura
`js/data.js` conteúdo · `state.js` estado + LocalStorage · `systems.js` regras (fazenda, produção, clientes, missões) · `world.js` cena, luz, ciclo dia/noite · `assets.js` carrega os GLB e aplica toon shading · `buildings.js` prédios/decorações · `cats.js` gatos e clientes · `place.js` construir/arrastar · `ui.js` menus · `main.js` loop.

## Ajustes dos seus modelos
Em `js/assets.js`, o objeto `DEF` define tamanho (`h`/`w`) e giro (`ry`, em radianos) de cada GLB. Se algum modelo estiver olhando para o lado errado ao andar, ajuste `ry` (ex.: `Math.PI` ou `Math.PI/2`).
As texturas dos GLB são usadas originais, sem nenhuma redução.
