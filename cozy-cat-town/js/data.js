export const DAY_SEC=240;
export const CROPS={
 wheat:{n:'Trigo',e:'🌾',t:12,sell:4,seed:2,xp:2,lv:1,c:0xe9c46a},
 carrot:{n:'Cenoura',e:'🥕',t:20,sell:6,seed:3,xp:3,lv:1,c:0xff9f55},
 tomato:{n:'Tomate',e:'🍅',t:30,sell:9,seed:4,xp:4,lv:1,c:0xff6b6b},
 corn:{n:'Milho',e:'🌽',t:40,sell:12,seed:6,xp:5,lv:2,c:0xffe066},
 strawberry:{n:'Morango',e:'🍓',t:55,sell:16,seed:8,xp:6,lv:2,c:0xff7aa2},
 pumpkin:{n:'Abóbora',e:'🎃',t:75,sell:22,seed:10,xp:8,lv:3,c:0xffa94d}};
export const RECIPES={
 carrotsoup:{n:'Sopa de Cenoura',e:'🥣',b:'kitchen',in:{carrot:2},t:20,sell:22,xp:6,lv:1},
 tomatosoup:{n:'Sopa de Tomate',e:'🍲',b:'kitchen',in:{tomato:2},t:25,sell:30,xp:8,lv:1},
 cornchowder:{n:'Creme de Milho',e:'🥘',b:'kitchen',in:{corn:2,carrot:1},t:40,sell:55,xp:12,lv:6},
 pumpkinsoup:{n:'Sopa de Abóbora',e:'🍜',b:'kitchen',in:{pumpkin:2},t:50,sell:70,xp:16,lv:3},
 bread:{n:'Pão Fofinho',e:'🍞',b:'bakery',in:{flour:1},t:15,sell:14,xp:4,lv:4},
 muffin:{n:'Muffin de Milho',e:'🧁',b:'bakery',in:{corn:1,wheat:1},t:25,sell:30,xp:8,lv:6},
 cake:{n:'Bolo de Morango',e:'🍰',b:'bakery',in:{strawberry:2,wheat:1},t:40,sell:55,xp:12,lv:2},
 pie:{n:'Torta de Abóbora',e:'🥧',b:'bakery',in:{pumpkin:1,wheat:2},t:50,sell:70,xp:16,lv:3}};
export const CATS={
 banana:{n:'Banana',m:'banana',skill:'farm',price:0,lv:1,tint:null},
 pearl:{n:'Pérola',m:'persian',skill:'kitchen',price:0,lv:1,tint:null},
 trio:{n:'Trio Fofão',m:'banana',skill:'bakery',price:0,lv:1,tint:0xffdca8},
 berry:{n:'Moranguinho',m:'banana',skill:'restaurant',price:0,lv:1,tint:0xffb0cf},
 cloud:{n:'Nuvem',m:'persian',skill:'farm',price:0,lv:1,tint:0xa8d8ff},
 sunny:{n:'Soleil',m:'banana',skill:'bakery',price:400,lv:4,tint:0xffe27a},
 mint:{n:'Menta',m:'persian',skill:'kitchen',price:800,lv:6,tint:0xb5f0cf},
 lilac:{n:'Lilás',m:'persian',skill:'restaurant',price:1500,lv:4,tint:0xd9c2ff}};
export const DECOR={
 bench:{n:'Banco',e:'🪑',price:60},lamp:{n:'Poste de Luz',e:'💡',price:40},
 flowerpot:{n:'Vaso de Flores',e:'🌷',price:25},fountain:{n:'Fonte',e:'⛲',price:200},
 sakura:{n:'Cerejeira',e:'🌸',price:90},mailbox:{n:'Caixa de Correio',e:'📮',price:35},
 picnic:{n:'Piquenique',e:'🧺',price:70},statue:{n:'Estátua de Gato',e:'🗿',price:150},
 parasol:{n:'Ombrelone',e:'⛱️',price:80},rainbow:{n:'Arco-íris',e:'🌈',price:120}};
export const BUILD={
 farm:{n:'Horta',e:'🌱',w:6,d:4,price:400,lv:3},
 kitchen:{n:'Cozinha de Sopa',e:'🍲',w:4,d:4,price:300,lv:2},
 bakery:{n:'Padaria',e:'🥐',w:4,d:4,price:300,lv:4},
 restaurant:{n:'Restaurante',e:'🍽️',w:5,d:4,price:900,lv:4}};
Object.assign(CROPS,{corn:{n:'Milho',e:'🌽',t:40,sell:12,seed:6,xp:5,lv:6,c:0xffe066}});
Object.assign(RECIPES,{
 flour:{n:'Farinha',e:'🌾',b:'bakery',in:{wheat:2},t:18,sell:10,xp:4,lv:4},
 baguette:{n:'Baguete',e:'🥖',b:'bakery',in:{flour:2},t:28,sell:26,xp:8,lv:4},
 paperbag:{n:'Sacola de papel',e:'🛍️',b:'packing',in:{flour:1},t:20,sell:18,xp:6,lv:5},
 milk:{n:'Leite fresco',e:'🥛',b:'dairy',in:{},t:25,sell:12,xp:5,lv:6},
 cornbread:{n:'Pão de milho',e:'🍞',b:'bakery',in:{corn:1,flour:1},t:35,sell:32,xp:10,lv:8},
 cardboard:{n:'Caixa de papelão',e:'📦',b:'toolshop',in:{wheat:3},t:30,sell:24,xp:8,lv:8},
 cheese:{n:'Queijo',e:'🧀',b:'dairy',in:{milk:2},t:45,sell:44,xp:14,lv:9}
});
Object.assign(BUILD,{
 housing:{n:'Centro de moradias',e:'🏘️',w:5,d:4,price:0,lv:3,desc:'Gerencie as próximas moradias da vila.'},
 wardrobe:{n:'Guarda-roupa dos gatos',e:'👒',w:3,d:3,price:250,lv:4,desc:'Um cantinho para cuidar do visual dos gatinhos.'},
 resthouse:{n:'Torre de descanso',e:'🛏️',w:4,d:4,price:500,lv:5,desc:'Um lugar aconchegante para os gatos descansarem.'},
 packing:{n:'Oficina de sacolas',e:'🛍️',w:4,d:3,price:600,lv:5,desc:'Transforme farinha em embalagens para as entregas.'},
 dairy:{n:'Fazenda de leite',e:'🥛',w:5,d:4,price:800,lv:6,desc:'Produza leite fresco e queijo.'},
 observatory:{n:'Observatório',e:'🔭',w:4,d:4,price:1000,lv:6,desc:'Observe o céu e atraia novos gatos para a vila.'},
 fishery:{n:'Área de pesca',e:'🎣',w:5,d:4,price:1200,lv:7,desc:'Um novo espaço de lazer junto à água.'},
 nightmarket:{n:'Mercado noturno',e:'🏮',w:5,d:4,price:1500,lv:7,desc:'Uma feirinha iluminada para a vila.'},
 flowergarden:{n:'Jardim de flores',e:'🌷',w:5,d:4,price:800,lv:7,desc:'Cultive um jardim colorido para os gatinhos.'},
 toolshop:{n:'Loja de ferramentas',e:'🧰',w:4,d:4,price:1700,lv:8,desc:'Produza caixas para embalar mercadorias.'},
 archive:{n:'Estante mágica',e:'📚',w:4,d:3,price:2200,lv:19,desc:'Guarde lembranças e coleções da cidade.'}
});
export const MISSIONS=[
 {id:'m1',t:'Colher 10 plantações',k:'harvest',n:10,r:60},
 {id:'m2',t:'Cozinhar 5 pratos',k:'cook',n:5,r:80},
 {id:'m3',t:'Servir 5 clientes',k:'serve',n:5,r:100},
 {id:'m4',t:'Fazer carinho em 5 gatinhos',k:'pet',n:5,r:50},
 {id:'m5',t:'Alcançar o nível 3',k:'lv',n:3,r:120},
 {id:'m6',t:'Construir 1 prédio',k:'build',n:1,r:150},
 {id:'m7',t:'Colocar 3 decorações',k:'place',n:3,r:90}];
MISSIONS.push({id:'m8',t:'Fazer a primeira entrega',k:'delivery',n:1,r:120});
export const MILESTONES=[
 {lv:3,n:'Centro de moradias',e:'🏘️',d:'Restaure o centro, abra novos campos e conheça as entregas do pelicano.'},
 {lv:4,n:'Padaria e guarda-roupa',e:'🥐',d:'Farinha, baguete e personalização dos gatos.'},
 {lv:5,n:'Descanso e embalagens',e:'🛏️',d:'Torre de descanso para gatos e oficina de sacolas.'},
 {lv:6,n:'Observatório e laticínio',e:'🔭',d:'Conheça novos gatos, plante milho e produza leite.'},
 {lv:7,n:'Novas áreas',e:'🎣',d:'Pesca, mercado noturno e jardim de flores.'},
 {lv:8,n:'Ferramentas e pão de milho',e:'🧰',d:'Loja de ferramentas, caixas e nova receita.'},
 {lv:9,n:'Queijo e entregas',e:'🧀',d:'Amplie sua produção e receba pedidos maiores.'},
 {lv:10,n:'Presença diária',e:'🎁',d:'Recompensas por voltar à cidade.'},
 {lv:13,n:'Passe fofinho',e:'🎟️',d:'Trilha de missões e recompensas.'},
 {lv:16,n:'Eventos especiais',e:'🎉',d:'Atividades sazonais para a comunidade.'},
 {lv:19,n:'Estante mágica',e:'📚',d:'Organize coleções de gatos e acessórios.'},
 {lv:20,n:'Cidade em expansão',e:'🏙️',d:'Novas áreas, produção e decoração.'},
 {lv:30,n:'Mestre da vila',e:'🌟',d:'Mais espaço para construções e especializações.'},
 {lv:40,n:'Grande coleção',e:'💎',d:'Continue evoluindo gatos e instalações.'},
 {lv:50,n:'Cidade lendária',e:'👑',d:'Aproveite todos os sistemas e complete sua coleção.'}
];
export const STORY=[
 {id:'welcome',t:'Sua pequena propriedade',d:'Você recebeu uma propriedade tranquila e quatro gatinhos vieram conhecer o lugar.',goal:'Abra a jornada para começar.',stat:null},
 {id:'plant',t:'Plante trigo',d:'Toque na horta, escolha trigo e plante uma semente.',goal:'Plante trigo uma vez.',stat:'wheatPlanted',n:1},
 {id:'harvest',t:'Faça a primeira colheita',d:'Espere o trigo crescer e toque no canteiro pronto.',goal:'Colha trigo uma vez.',stat:'wheatHarvest',n:1},
 {id:'bake',t:'Prepare uma mercadoria',d:'Transforme trigo em farinha e use a farinha para assar pão fofinho.',goal:'Produza pão uma vez.',stat:'breadMade',n:1},
 {id:'delivery',t:'Conheça o pelicano',d:'Leve os produtos pedidos ao pelicano e receba moedas e experiência.',goal:'Complete uma entrega.',stat:'delivery',n:1},
 {id:'done',t:'A vila está crescendo!',d:'Plante, fabrique mercadorias e conclua pedidos para continuar avançando.',goal:'Jornada inicial concluída.',stat:null}
];
export const PASS_TASKS=[
 {id:'p_harvest',t:'Colha 30 plantações',stat:'harvest',n:30,coins:180,xp:35},
 {id:'p_cook',t:'Fabrique 20 mercadorias',stat:'cook',n:20,coins:220,xp:45},
 {id:'p_delivery',t:'Complete 5 entregas',stat:'delivery',n:5,coins:300,xp:60},
 {id:'p_pet',t:'Faça carinho em 25 gatos',stat:'pet',n:25,coins:160,xp:30}
];
export const ACH=[
 {id:'a1',t:'Fazendeiro: colher 100',k:'harvest',n:100,r:400},
 {id:'a2',t:'Chef: cozinhar 50',k:'cook',n:50,r:500},
 {id:'a3',t:'Anfitrião: servir 40',k:'serve',n:40,r:600},
 {id:'a4',t:'Colecionador: 8 gatos',k:'cats',n:8,r:800},
 {id:'a5',t:'Milionário: ganhar 5000 🪙',k:'earn',n:5000,r:700},
 {id:'a6',t:'Nível 8',k:'lv',n:8,r:1000}];
