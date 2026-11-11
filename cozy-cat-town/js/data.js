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
 bread:{n:'Pão',e:'🍞',b:'bakery',in:{flour:1},t:15,sell:14,xp:4,lv:4},
 muffin:{n:'Muffin de Milho',e:'🧁',b:'bakery',in:{corn:1,wheat:1},t:25,sell:30,xp:8,lv:6},
 cake:{n:'Bolo de Morango',e:'🍰',b:'bakery',in:{strawberry:2,wheat:1},t:40,sell:55,xp:12,lv:2},
 pie:{n:'Torta de Abóbora',e:'🥧',b:'bakery',in:{pumpkin:1,wheat:2},t:50,sell:70,xp:16,lv:3}};
export const CATS={
 banana:{n:'Banana',m:'banana',skill:'farm',price:0,lv:1,tint:null},
 pearl:{n:'Pérola',m:'persian',skill:'kitchen',price:0,lv:1,tint:null},
 berry:{n:'Moranguinho',m:'strawberryCat',skill:'restaurant',price:0,lv:1,tint:null},
 cloud:{n:'Nuvem',m:'persian',skill:'farm',price:0,lv:1,tint:0xa8d8ff},
 sunny:{n:'Soleil',m:'banana',skill:'bakery',price:400,lv:4,tint:0xffe27a},
 mint:{n:'Menta',m:'persian',skill:'kitchen',price:800,lv:6,tint:0xb5f0cf},
 lilac:{n:'Lilás',m:'persian',skill:'restaurant',price:1500,lv:4,tint:0xd9c2ff}};
export const DECOR={
 bench:{n:'Banco',e:'🪑',price:60,w:1.6,d:.8,desc:'Banco rosa com assento e encosto para descansar.'},
 lamp:{n:'Poste de Luz',e:'💡',price:40,w:.7,d:.7,desc:'Poste creme com uma luminária amarela.'},
 flowerpot:{n:'Vaso de Flores',e:'🌷',price:25,w:.9,d:.9,desc:'Vaso terracota com três flores coloridas.'},
 fountain:{n:'Fonte',e:'⛲',price:200,w:2.4,d:2.4,desc:'Fonte redonda com bacia de água azul.'},
 sakura:{n:'Cerejeira',e:'🌸',price:90,w:1.6,d:1.6,desc:'Árvore delicada coberta de flores rosadas.'},
 mailbox:{n:'Caixa de Correio',e:'📮',price:35,w:.7,d:.7,desc:'Caixa azul com bandeirinha vermelha.'},
 picnic:{n:'Piquenique',e:'🧺',price:70,w:1.8,d:1.8,desc:'Toalha xadrez com cestinha e lanchinhos.'},
 statue:{n:'Estátua de Gato',e:'🗿',price:150,w:.9,d:.9,desc:'Estátua branca.'},
 parasol:{n:'Ombrelone',e:'⛱️',price:80,w:2.2,d:2.2,desc:'Guarda-sol amarelo com mesinha lateral.'},
 rainbow:{n:'Arco-íris',e:'🌈',price:120,w:3.2,d:1.2,desc:'Arco colorido para decorar um caminho.'}};
const EXTRA_DECOR=[
 ['floor_cream','Piso de pedra creme','🟨',8,'floor',0xf3e3bf,0xc9a778,1,1,'Lajota clara para caminhos aconchegantes.'],
 ['floor_rose','Piso rosado de coração','💗',12,'floor',0xf5c4d2,0xd887a6,1,1,'Lajota rosa com detalhe de coração.'],
 ['floor_lavender','Piso lavanda','🟪',12,'floor',0xd8c9f0,0xa48acb,1,1,'Pedra lilás com pequenos pontos brilhantes.'],
 ['floor_ocean','Piso azul-marinho','🟦',12,'floor',0xa8d8e8,0x5e9db5,1,1,'Lajota azul inspirada no mar.'],
 ['floor_wood','Piso de madeira','🪵',10,'floor',0xc58b5d,0x885735,1,1,'Tábuas quentinhas com veios de madeira.'],
 ['floor_moss','Piso de musgo','🌿',9,'floor',0x9fbd83,0x668552,1,1,'Pedra verde macia para um jardim natural.'],
 ['floor_cherry','Piso de cerejeira','🌸',14,'floor',0xf4c6ce,0xd9879b,1,1,'Lajota com pétalas de cerejeira.'],
 ['floor_starry','Piso estrelado','⭐',16,'floor',0x4f5988,0xffd675,1,1,'Pedra noturna com uma estrela dourada.'],
 ['floor_sand','Piso de areia','🏖️',8,'floor',0xe8c98d,0xb28a4f,1,1,'Bloco de areia dourada com conchinhas.'],
 ['floor_checker','Piso xadrez pastel','🔲',16,'floor',0xf6e8d1,0xc99bb4,1,1,'Lajota quadriculada em tons suaves.'],
 ['tree_rose','Árvore de copa redonda','🌳',110,'tree',0xff9fca,0xffd1e4,1.8,1.8,'Árvore de copa redonda em camadas, com tronco e folhas facetados.'],
 ['tree_lilac','Árvore de copa','🌳',115,'tree',0xb69be8,0xe1d2ff,1.8,1.8,'Árvore de copa em três níveis, com tronco e folhas facetados.'],
 ['tree_sky','Árvore de copa em níveis','🌳',115,'tree',0x70bfe8,0xbcecff,1.8,1.8,'Árvore com copa macia em três níveis, tronco e folhas facetados.'],
 ['tree_pine','Pinheiro','🌲',125,'pine',0x4e9a72,0xdaf0c5,1.8,1.8,'Pinheiro em camadas com tronco facetado e estrela no topo.'],
 ['tree_green','Árvore de copa arredondada','🌳',100,'tree',0x68b879,0xa8e5a0,1.8,1.8,'Árvore de copa arredondada e volumosa, com tronco facetado.'],
 ['tree_snow','Árvore de copa nevada','🌳',135,'tree',0xe8edf2,0x9ed6ec,1.8,1.8,'Árvore de copa em camadas com detalhes facetados de inverno.'],
 ['tree_orange','Árvore de copa de outono','🍊',120,'tree',0xf39a48,0xffd16e,1.8,1.8,'Árvore de copa em camadas com folhas facetadas de outono.'],
 ['pot_tall','Vaso alto terracota','🪴',38,'pot',0xc77755,0x78b879,.9,.9,'Vaso alto com borda grossa e folhas verdes.'],
 ['pot_round','Vaso redondo azul','🪴',34,'pot',0x78b8d5,0xf5c6d6,1,1,'Vaso bojudo azul com flores cor-de-rosa.'],
 ['pot_square','Vaso quadrado menta','🪴',36,'pot',0x8ac9aa,0xffe28a,1,1,'Cachepô quadrado menta com flores amarelas.'],
 ['pot_urn','Ânfora de jardim','🏺',48,'urn',0xb486c2,0xffc4dc,1,1,'Ânfora decorativa com alças e buquê.'],
 ['pot_mosaic','Vaso mosaico colorido','🪴',55,'pot',0x69aeb1,0xf1a9c5,1,1,'Vaso facetado com mosaico e flores.'],
 ['pot_moon','Vaso meia-lua','🌙',52,'pot',0x7776ae,0xffe28a,1,1,'Vaso em forma de lua com flor dourada.'],
 ['pot_berry','Vaso de morango','🍓',46,'pot',0xe87979,0xfff0cc,1,1,'Vaso decorado com frutos.'],
 ['pot_white','Vaso branco de porcelana','🏺',44,'urn',0xf3eee6,0x9dc9d1,.9,.9,'Porcelana creme com detalhes azulados.'],
 ['pot_giant','Vaso gigante de jardim','🪴',82,'pot',0xbf815f,0xc285d3,1.5,1.5,'Grande vaso com borda, terra e flores altas.'],
 ['lamp_moon','Poste de lua','🌙',72,'lamp',0x8679c2,0xffe28a,.7,.7,'Luminária de jardim com lua crescente.'],
 ['lamp_flower','Poste florido','🌼',68,'lamp',0xa4c986,0xffd56b,.7,.7,'Poste verde com luminária em forma de flor.'],
 ['lamp_lantern','Lanterna de madeira','🏮',75,'lantern',0x9b6749,0xffbb60,.8,.8,'Lanterna suspensa em suporte de madeira.'],
 ['lamp_mushroom','Luminária cogumelo','🍄',80,'mushroom',0xe87979,0xfff0b3,.9,.9,'Cogumelo luminoso de pintinhas creme.'],
 ['lamp_crystal','Cristal luminoso','💎',96,'crystal',0x77c8dc,0xcdf7ff,.8,.8,'Cristal facetado que ilumina à noite.'],
 ['bench_wood','Banco de madeira','🪑',48,'bench',0xc68a55,0xffd68a,1.6,.8,'Banco de ripas com pés robustos.'],
 ['bench_heart','Banco de coração','💞',64,'bench',0xf28dab,0xffd5e0,1.6,.8,'Banco rosa com encosto de coração.'],
 ['bench_mint','Banco menta','🪑',58,'bench',0x79bfa0,0xd5f0c4,1.6,.8,'Banco verde-menta com assento acolchoado.'],
 ['bench_stone','Banco de pedra','🪨',62,'bench',0xb1a8ad,0xe2d6c6,1.6,.8,'Banco de pedra clara com pés esculpidos.'],
 ['bench_swing','Balanço de jardim','🎠',98,'swing',0xc68a55,0xf2c3d7,1.8,1.2,'Balanço chibi com correntes e assento.'],
 ['topiary_cat','Topiaria','🐱',88,'topiary',0x68a96f,0xffd276,1.2,1.2,'Arbusto podado em formato.'],
 ['topiary_heart','Topiaria de coração','💚',78,'topiary',0x71b77b,0xff8caa,1.1,1.1,'Coração verde podado com laço rosa.'],
 ['topiary_bunny','Topiaria de coelhinho','🐰',84,'topiary',0x8fc77e,0xffd6e5,1.2,1.2,'Arbusto de coelhinho com orelhas altas.'],
 ['topiary_mushroom','Topiaria cogumelo','🍄',76,'mushroom',0xc97068,0xf5e2c6,1,1,'Cogumelo decorativo com pintas e base musgosa.'],
 ['birdbath','Bebedouro','🐦',74,'birdbath',0xb9c8d1,0x87c9d7,1.2,1.2,'Bacia elevada com água azul.'],
 ['garden_arch','Arco de flores','🌷',115,'arch',0x8cbf86,0xf5a9c5,2.4,.8,'Arco de entrada coberto de flores.'],
 ['mushroom_house','Casinha de cogumelo','🍄',130,'mushroom',0xd77b70,0xffedc4,1.6,1.6,'Casinha de cogumelo com porta redonda.'],
 ['birdhouse','Casinha de passarinho','🐤',68,'birdhouse',0xe2a85c,0x85c7d7,.8,.8,'Casinha de madeira com telhado colorido.'],
 ['garden_clock','Relógio de jardim','🕰️',82,'clock',0x8cae8c,0xffe28a,.8,.8,'Relógio redondo com ponteiros e suporte.'],
 ['garden_well','Poço de desejos','🪣',110,'well',0xb49b83,0x82c4d2,1.6,1.6,'Poço de pedra com telhadinho e balde.'],
 ['windmill','Catavento florido','🌼',58,'windmill',0xd49bb2,0xffdc7a,.8,.8,'Catavento colorido sobre um poste.'],
 ['picnic_table','Mesa de piquenique','🍰',88,'table',0xc88e62,0xf4d18c,1.8,1.4,'Mesa com toalha, bolinhos e banquetas.'],
 ['bird_nest','Ninho aconchegante','🪺',42,'nest',0x9c7049,0xf3d896,1,1,'Ninho de gravetos com ovos coloridos.'],
 ['flower_cart','Carrinho de flores','🌷',94,'cart',0xe29aa9,0x84b98b,1.6,1,'Carrinho de mão cheio de flores.'],
 ['water_lily','Lago de nenúfares','🪷',70,'pond',0x75b9cf,0xffb6cf,1.8,1.8,'Laguinho raso com folhas e flores flutuantes.'],
 ['fence_rose','Cerca florida','🌹',40,'fence',0xb98164,0xf59ab6,1.8,.4,'Trecho de cerca de madeira com rosas.'],
 ['cat_sign','Placa da vila','🪧',32,'sign',0x9a6a4d,0xf5d17c,.8,.5,'Placa pintada com patinhas e seta.'],
 ['star_fountain','Fonte de estrela','✨',150,'fountain',0xa6c9d5,0xf4d16e,1.8,1.8,'Fonte baixa com estrela e água azul.'],
 ['rainbow_arch','Arco-íris de jardim','🌈',125,'rainbow',0xf49ab4,0x8abfe0,2.4,.8,'Arco-íris pastel para a entrada do jardim.'],
 ['crystal_cluster','Pedras de cristal','💎',90,'crystal',0x8cbed6,0xd7b5ee,1.2,1.2,'Trio de cristais facetados de cores suaves.']
].map(([key,n,e,price,form,color,accent,w,d,desc])=>[key,{n,e,price,form,color,accent,w,d,desc}]);
Object.assign(DECOR,Object.fromEntries(EXTRA_DECOR));
const FLOOR_COLLECTION=[
 ['floor_cobble','Calçamento de pedras redondas','🪨','cobble',0xb9a797,0x897d75],
 ['floor_brick','Piso de tijolinhos rosados','🧱','brick',0xd88f84,0x9d645c],
 ['floor_mint','Lajota verde-menta','🟩','tile',0x9bd5bb,0x5ca789],
 ['floor_sky','Lajota azul-celeste','🟦','tile',0xa6d7ef,0x73abc8],
 ['floor_lilac','Lajota lilás','🟪','tile',0xc7b5e5,0x947bb7],
 ['floor_terracotta','Pedra terracota','🟫','cobble',0xc77d62,0x945640],
 ['floor_sun','Piso de girassóis','🌻','flower',0xf3dc91,0xd19c45],
 ['floor_leaf','Piso de folhas verdes','🍃','leaf',0xa6c88b,0x6a985d],
 ['floor_shell','Piso de conchinhas','🐚','shell',0xe8c5a5,0xc28b78],
 ['floor_cloud','Piso de nuvens','☁️','cloud',0xc9e6ef,0x94c4d4],
 ['floor_berry','Piso de morangos','🍓','fruit',0xf2bdc3,0xda7885],
 ['floor_moon','Piso de luas douradas','🌙','moon',0x727ba7,0xf2d276],
 ['floor_forest','Pedra da floresta','🌲','leaf',0x78966c,0x46654c],
 ['floor_marble','Mármore creme','🏛️','marble',0xe6ded1,0xb4a89e],
 ['floor_wave','Piso de ondas azuis','🌊','wave',0x91cfda,0x579eae],
 ['floor_honey','Piso de favos de mel','🍯','honey',0xf1c665,0xc9913f],
 ['floor_mosaic','Mosaico de jardim','🔶','mosaic',0xdba7c4,0x89bba2],
 ['floor_sakura','Piso de pétalas rosas','🌸','flower',0xf4d4df,0xe29ab4],
 ['floor_snow','Pedra de neve','❄️','snow',0xe3edf1,0xa9c8d8],
 ['floor_autumn','Piso de folhas de outono','🍂','leaf',0xd59a5f,0x9f684a]
];
for(const[id,n,e,shape,color,accent]of FLOOR_COLLECTION)DECOR[id]={n,e,price:11+(FLOOR_COLLECTION.findIndex(row=>row[0]===id)%5)*2,w:1,d:1,form:'floor',shape,color,accent,desc:`${n} com acabamento facetado para caminhos e pátios.`};
const NOVELTY_DECOR=[
 ['Bichinhos da Vila','🐾',[
  ['Jardineiro','🐱','cat',0xe8a88a,0xffd77d,'Figura de jardineiro com chapéu, jardineira e focinho pintado.'],
  ['Coelhinha florista','🐰','rabbit',0xf3d9d4,0xf49ab4,'Coelhinha com orelhas altas segurando uma flor facetada.'],
  ['Raposa do bosque','🦊','fox',0xe77e48,0xffe1ad,'Raposa laranja com cauda grande de ponta creme.'],
  ['Corujinha sábia','🦉','owl',0x9078ad,0xffdc83,'Coruja lilás com olhos grandes, asas e peninhas no topo.'],
  ['Ursinho mel','🧸','cat',0xb47d59,0xffd786,'Ursinho redondo com focinho claro e gravatinha de mel.'],
  ['Pinguim de cachecol','🐧','owl',0x66758d,0xf28da7,'Pinguim de barriga clara com cachecol coral.'],
  ['Saltitante','🐑','rabbit',0xe9e3d6,0xc6b4df,'Figura de ovelha com orelhas e patas curtas.'],
  ['Sapo príncipe','🐸','cat',0x78b879,0xffd76f,'Sapo verde coroado com olhos saltados e sorriso simpático.'],
  ['Raposa-das-neves','🦊','fox',0xe6edf2,0xa9d6ec,'Raposa branca com cauda azul-gelo e orelhas rosadas.'],
  ['Astronauta','🐈','owl',0x9ca9c8,0xffe28a,'Figura espacial com capacete redondo e visor dourado.']
 ]],
 ['Cantinho Encantado','✨',[
  ['Cogumelo casa rosa','🍄','mushroom',0xe77e91,0xfff0cc,'Casinha de cogumelo com porta redonda, janelinha e pintas.'],
  ['Cogumelo casa azul','🍄','mushroom',0x6da9d1,0xe4f6ff,'Casinha azul com telhado facetado e porta de madeira.'],
  ['Fada da campina','🧚','cat',0xb78bd4,0xf5c1dc,'Estatueta de fada com asas, vestido e varinha de estrela.'],
  ['Dragãozinho verde','🐉','fox',0x69aa78,0xffd277,'Dragão bebê com chifres, asas pequenas e cauda curvada.'],
  ['Cristal arco-íris','💎','fountain',0x8acde0,0xe6b8eb,'Pedestal com cristais coloridos de pontas facetadas.'],
  ['Portal de estrelas','🌟','lantern',0x7774b8,0xffe28a,'Portal mágico com arco lilás e estrelas douradas.'],
  ['Caldeirão de poções','🧪','fountain',0x48586f,0x71d2aa,'Caldeirão borbulhante sobre três pés e chama suave.'],
  ['Torre do relógio lunar','🌙','kiosk',0x7776ae,0xffe28a,'Mini torre com relógio redondo e lua no telhado.'],
  ['Fonte das fadas','🧚','fountain',0x8ac7c8,0xf5a9c5,'Fonte em três níveis com gotinhas e flor central.'],
  ['Baú do tesouro','🪙','kiosk',0xa8764f,0xffd064,'Baú aberto com moedas douradas e fecho grande.']
 ]],
 ['Praça da Vila','🏘️',[
  ['Quiosque de limonada','🍋','kiosk',0xf2d46f,0x8abf78,'Balcão listrado com toldo, jarra e placa de limonada.'],
  ['Carrinho de sorvete','🍦','kiosk',0xf49ab4,0x8bc9e8,'Carrinho pastel com toldinho, rodas e sorvetes coloridos.'],
  ['Banca de flores','💐','kiosk',0x9fbe81,0xf28fab,'Banca de madeira com cobertura e buquês à mostra.'],
  ['Correio','📮','mailbox',0x82b9d1,0xe87979,'Caixa de correio com bandeira levantada.'],
  ['Telefone vintage','☎️','mailbox',0xe4a864,0x9d7bd1,'Telefone público retrô com disco e cobertura arredondada.'],
  ['Placa Café do Gato','☕','kiosk',0x9b704d,0xffd6a1,'Plaquinha de café com xícara em relevo e suporte de madeira.'],
  ['Coreto de jardim','🎠','kiosk',0x8ab986,0xf5c0d0,'Coreto octogonal com colunas, telhado e bandeirolas.'],
  ['Poço de desejos azul','🪣','fountain',0x8eaaa9,0x85cbdf,'Poço de pedra azul com balde pendurado e água brilhante.'],
  ['Bebedouro','🐦','fountain',0xc7d1d1,0x8cd0dd,'Bacia de água sobre pedestal.'],
  ['Banco de praça coração','💗','cat',0xd88da1,0xffd9e1,'Banco acolchoado com encosto em formato de coração.']
 ]],
 ['Festa e Música','🎉',[
  ['Caixa de música','🎵','music',0xd89bb0,0xffd872,'Caixinha aberta com bailarina floral e detalhes dourados.'],
  ['Piano de jardim','🎹','music',0x6b566d,0xf4ead8,'Piano de cauda miniatura com teclas claras e banquinho.'],
  ['Tambor de festa','🥁','music',0xe67769,0xffdf8a,'Tambor colorido com aro e duas baquetas cruzadas.'],
  ['Rádio retrô','📻','music',0xc6875c,0x8ed0c0,'Rádio com antena, mostrador e botões redondos.'],
  ['Caixa de som flor','🔊','music',0x85b69c,0xf4a9c2,'Caixa de som verde com alto-falante em forma de flor.'],
  ['Balão de aniversário','🎈','lantern',0xf28fa5,0xffda73,'Trio de balões facetados presos a uma base decorativa.'],
  ['Bolo de comemoração','🎂','mushroom',0xf6d8d1,0xe88baa,'Bolo de três camadas com velinhas e morangos.'],
  ['Guirlanda de bandeiras','🎏','lantern',0x8dbb86,0xf38eaa,'Cordão de bandeirinhas coloridas entre dois postes.'],
  ['Carrossel de jardim','🎠','music',0x8fb8d0,0xf1c96e,'Mini carrossel com cavalinho, haste e cobertura listrada.'],
  ['Coreto musical','🎼','music',0xa887b9,0xffdb82,'Pequeno palco com notas musicais e cortina festiva.']
 ]],
 ['Coleção de Patinhas','🐾',[
  ['Gato guardião','🐈','cat',0x777c9a,0xffd27a,'Estátua de gato sentado em pedestal com medalhão.'],
  ['Coelho guardião','🐇','rabbit',0xe6d6c6,0xa6cde0,'Coelho em pé com orelhas longas e laço no pescoço.'],
  ['Raposa guardiã','🦊','fox',0xc57552,0xffdcb0,'Raposa sentada com cauda enrolada e peito creme.'],
  ['Coruja guardiã','🦉','owl',0x8c7c9a,0xffdf83,'Coruja sobre um toco com asas e olhos dourados.'],
  ['Da lua','🌙','cat',0xaaa3ce,0xffe79a,'Figura sentada abraçando uma lua crescente.'],
  ['Da sorte','🐱','cat',0xf1d17c,0xf28fa5,'Figura com patinha erguida e coleira.'],
  ['Raposa das flores','🌷','fox',0xe89b71,0xf3a9c4,'Raposa com grinalda de flores e cauda pontilhada.'],
  ['Coelho da cenoura','🥕','rabbit',0xe2d6c5,0xf29a57,'Coelhinho segurando uma cenoura grande com folhas.'],
  ['Coruja viajante','🧭','owl',0x9c806b,0x8cc4d5,'Coruja com mini mochila e bússola dourada.'],
  ['Pescador','🐟','cat',0x8d9fb5,0x74c9e6,'Figura com chapéu de pescador e peixe azul.']
 ]]
];
let noveltyIndex=0;
for(const[group,groupIcon,items]of NOVELTY_DECOR)for(const[n,e,shape,color,accent,desc]of items){
 const id=`novelty_${String(++noveltyIndex).padStart(2,'0')}`;
 DECOR[id]={n,e,price:72+(noveltyIndex%7)*13,w:shape==='kiosk'?1.7:1.3,d:shape==='kiosk'?1.4:1.2,form:'novelty',shape,color,accent,group,groupIcon,desc};
}
const GARDEN_COLLECTION=[
 ['canteiro_tulipas','Canteiro de tulipas','🌷','flowerbed',0xc58a72,0xf18baa],
 ['canteiro_margaridas','Canteiro de margaridas','🌼','flowerbed',0xb88b6d,0xffdc68],
 ['canteiro_lavandas','Canteiro de lavandas','🪻','flowerbed',0xa887a2,0xa78ad0],
 ['canteiro_rosas','Canteiro de rosas','🌹','flowerbed',0xb07c68,0xe96e8e],
 ['canteiro_girassois','Canteiro de girassóis','🌻','flowerbed',0xc89b62,0xf2ca52],
 ['canteiro_lirios','Canteiro de lírios','💮','flowerbed',0xb99c80,0xf4dbea],
 ['canteiro_camomilas','Canteiro de camomilas','🌼','flowerbed',0xc39c73,0xfff0ce],
 ['canteiro_orquideas','Canteiro de orquídeas','🌺','flowerbed',0xb17a83,0xc681ca],
 ['canteiro_cravos','Canteiro de cravos','🌸','flowerbed',0xb78a78,0xe987a0],
 ['canteiro_azaleias','Canteiro de azaleias','🌺','flowerbed',0xb58a72,0xf48fa6],
 ['jardim_pedras','Conjunto de pedras de rio','🪨','stones',0xaaa19b,0xd0c7ba],
 ['jardim_seixos','Trilha de seixos','⚪','stones',0xb9aaa0,0xe1d6c9],
 ['jardim_geodos','Geodos coloridos','💎','crystal',0x8cbdd0,0xc7a3df],
 ['jardim_gramado','Monte de grama ornamental','🌿','grass',0x6b9c68,0xa5cc7c],
 ['jardim_bambu','Touceira de bambu','🎋','grass',0x78a76c,0xc0d783],
 ['jardim_toco','Toco com cogumelos','🍄','stump',0x94684c,0xd97976],
 ['jardim_folhas','Monte de folhas de outono','🍂','leaves',0xc07d53,0xe5ae63],
 ['jardim_nenufar','Lago de nenúfares redondo','🪷','pond',0x69adc0,0xe89cbb],
 ['jardim_lago_pedras','Lago de pedras azuladas','💧','pond',0x6da5b5,0xaad7d8],
 ['jardim_fonte_blossom','Fonte de flores','⛲','fountain',0xa4c5c0,0xe88eae],
 ['jardim_ponte','Ponte de madeira florida','🌉','bridge',0xb98159,0xe994ad],
 ['jardim_portao','Portãozinho de jardim','🚪','arch',0x8da975,0xd68ba5],
 ['jardim_arco_hera','Arco coberto de hera','🌿','arch',0x789b70,0xb1cf81],
 ['jardim_cerca','Cerca branca de jardim','🪵','fence',0xe5dfd1,0xa7c98a],
 ['jardim_cerca_morango','Cerca de moranguinhos','🍓','fence',0xb98164,0xe96f7c],
 ['jardim_folhagem','Vaso de samambaia','🌿','planter',0x9c745a,0x76a96a],
 ['jardim_costela','Costela-de-adão ornamental','🍃','planter',0x8caa78,0x51805b],
 ['jardim_cacto','Cacto de jardim com flor','🌵','planter',0xc28e67,0x75aa66],
 ['jardim_bonsai','Bonsai em vaso de pedra','🌳','bonsai',0x947b68,0x78a76d],
 ['jardim_bonsai_flor','Bonsai florido','🌸','bonsai',0xa48378,0xe99ab5],
 ['jardim_topiaria_espiral','Topiaria espiral','🌳','topiary',0x9d7657,0x65a878],
 ['jardim_topiaria_estrela','Topiaria de estrela','⭐','topiary',0xb39864,0x84b979],
 ['jardim_topiaria_nuvem','Topiaria de nuvem','☁️','topiary',0xa58c75,0x92be80],
 ['jardim_moinho','Moinho de vento de jardim','🌬️','windmill',0x9b8068,0xe8a0b7],
 ['jardim_cata_vento','Cata-vento de margarida','🌼','windmill',0x9e8d6a,0xffd75e],
 ['jardim_banho','Banheira de passarinhos','🐦','birdbath',0xb3c6c5,0x78bfce],
 ['jardim_ninho','Ninho no galho','🪺','nest',0x916746,0xf1d697],
 ['jardim_casa_abelhas','Hotel para abelhas','🐝','bughotel',0xb68857,0xe2b86e],
 ['jardim_casa_borboletas','Abrigo de borboletas','🦋','bughotel',0x9b7ba6,0xc9a3df],
 ['jardim_flor_caixa','Caixa de flores da varanda','🪴','planter',0x9e735b,0xec99b2],
 ['jardim_regador','Regador decorativo','🚿','watering',0x84aeb6,0xe8bd68],
 ['jardim_bota','Bota plantadeira','👢','planter',0xb77b64,0x8fbd78],
 ['jardim_carrinho','Carrinho de mão com mudas','🛒','cart',0xb77866,0x81b777],
 ['jardim_cesta','Cesta de colheita','🧺','basket',0xb68b60,0xe6be72],
 ['jardim_frutas','Cesta de frutas coloridas','🍎','basket',0xb68b60,0xe36f65],
 ['jardim_solar','Relógio de sol','☀️','sundial',0xc2a66c,0xf1d07a],
 ['jardim_placa','Placa Jardim Feliz','🪧','sign',0x987452,0xf1c96e],
 ['jardim_placa_flores','Placa de flores silvestres','🌼','sign',0x93724f,0xf1a5bd],
 ['jardim_lanterna','Lanterna entre flores','🏮','lantern',0x8d705d,0xffcb70],
 ['jardim_banco','Banco sob trepadeira','🪑','bench',0xa87a57,0x8cb77c]
];
for(const[id,n,e,shape,color,accent]of GARDEN_COLLECTION)DECOR[id]={n,e,price:45+(GARDEN_COLLECTION.findIndex(row=>row[0]===id)%8)*9,w:shape==='pond'||shape==='arch'||shape==='bridge'?1.8:1.2,d:shape==='pond'||shape==='bridge'?1.5:1.1,form:'gardenExtra',shape,color,accent,group:'garden',desc:`${n} com detalhes de jardim, folhas e formas facetadas.`};
export const FLOWER_COLORS=[
 ['Rosa pétala',0xf48fb1],['Rosa chiclete',0xff5c9a],['Rosa bebê',0xffc1d5],['Rosa antigo',0xc76c83],['Rosa coral',0xff7f76],
 ['Vermelho cereja',0xe53955],['Vermelho rubi',0xb71c43],['Vermelho tomate',0xf4513b],['Laranja pêssego',0xffa45b],['Laranja tangerina',0xf47721],
 ['Amarelo sol',0xffd84d],['Amarelo manteiga',0xffed9b],['Amarelo dourado',0xe4aa22],['Amarelo limão',0xd3df44],['Verde menta',0x71d2aa],
 ['Verde folha',0x57a85b],['Verde sálvia',0x9bad79],['Verde água',0x46c6b7],['Azul céu',0x74c9f3],['Azul piscina',0x28a9d0],
 ['Azul royal',0x4169d8],['Azul marinho',0x394b91],['Lilás suave',0xb99be8],['Lilás lavanda',0x9d7bd1],['Roxo violeta',0x7846b8],
 ['Roxo ameixa',0x663477],['Branco neve',0xf7f5eb],['Branco pérola',0xe8e5d7],['Creme baunilha',0xffe8b5],['Pêssego suave',0xffc2a1],
 ['Salmão',0xf28378],['Magenta',0xd8499a],['Fúcsia',0xe631a0],['Bordô',0x83364f],['Marrom cacau',0x9b694c],
 ['Cinza lavanda',0xaca4bb],['Prata',0xc4d1d7],['Turquesa',0x31b7a4],['Verde maçã',0x9ccf46],['Verde floresta',0x39734b],
 ['Dourado',0xd1a938],['Champanhe',0xe8d4a0],['Azul gelo',0xb7e6f4],['Azul ardósia',0x657d9c],['Roxo uva',0x75439a],
 ['Orquídea',0xda82d1],['Amora',0x9a426f],['Melancia',0xf45c72],['Caramelo',0xc98b57],['Arco-íris',0x8c65c6]
].map(([n,color],i)=>({id:`flower_color_${String(i+1).padStart(2,'0')}`,n,color}));
const DECOR_EDITIONS=[
 'Aurora','Orvalho','Piquenique','Sakura','Baunilha','Amora','Estrelinhas','Jardim Secreto','Chuva de Verão','Pôr do Sol',
 'Nuvem de Algodão','Mel Dourado','Bosque Mágico','Concha do Mar','Chá da Tarde','Lua de Prata','Primavera','Berries','Céu Azul','Folhas de Outono'
];
const categoryOf=d=>d.group||({flower:'flowers',floor:'floors',tree:'trees',pine:'trees',pot:'pots',urn:'pots',lamp:'lights',lantern:'lights',crystal:'lights',bench:'seating',swing:'seating'})[d.form]||'garden';
const EDITION_CATEGORIES=['floors','pots','lights','seating','garden','Bichinhos da Vila','Cantinho Encantado','Praça da Vila','Festa e Música','Coleção de Patinhas'];
for(const category of EDITION_CATEGORIES){
 const templates=Object.entries(DECOR).filter(([,d])=>category==='garden'?d.form==='gardenExtra':d.form!=='fruitTree'&&d.form!=='flower'&&categoryOf(d)===category);
 if(!templates.length)continue;
 for(let i=0;i<20;i++){
  const[key,base]=templates[i%templates.length],swatch=FLOWER_COLORS[(i*7+templates.length*3)%FLOWER_COLORS.length];
  const id=`edition_${category.toLowerCase().replace(/[^a-z0-9]+/g,'_')}_${i+1}`;
  DECOR[id]={...base,n:`${base.n} · ${DECOR_EDITIONS[i]}`,e:base.e,price:Math.max(12,Math.round((base.price||35)*1.12)),color:swatch.color,accent:FLOWER_COLORS[(i*11+8)%FLOWER_COLORS.length].color,desc:`${base.n} com acabamento ${DECOR_EDITIONS[i].toLowerCase()}, relevo facetado e detalhes cuidadosamente coloridos.`};
 }
}
const FLOWER_SHAPES=[
 ['daisy','Margarida','🌼'],['tulip','Tulipa','🌷'],['rose','Rosa','🌹'],['sunflower','Girassol','🌻'],['lily','Lírio','💮'],
 ['lavender','Lavanda','🪻'],['poppy','Papoula','🌺'],['cosmos','Cosmos','🌸'],['bell','Campânula','🔔'],['iris','Íris','🪷']
];
const FLOWER_VARIANTS=[
 ['Rosa',0xf48fb1],['Amarela',0xffd84d],['Branca',0xf7f5eb],['Lilás',0xb99be8],['Vermelha',0xe53955]
];
FLOWER_SHAPES.forEach(([shape,name,e],shapeIndex)=>FLOWER_VARIANTS.forEach(([colorName,petalColor],colorIndex)=>{
 const id=`flower_${shape}_${colorIndex+1}`;
 DECOR[id]={n:`${name} ${colorName.toLowerCase()}`,e,price:24+shapeIndex*2+colorIndex*3,w:.72,d:.72,form:'flower',shape,petalColor,accent:FLOWER_COLORS[(shapeIndex*5+colorIndex+10)%FLOWER_COLORS.length].color,desc:`${name} ${colorName.toLowerCase()} com haste verde, folhas e pétalas facetadas.`};
}));
export const EXTRA_FLOWER_TYPES=[
 ['anemone','Anêmona','🌺'],['astilbe','Astilbe','🌸'],['begonia','Begônia','🌺'],['camellia','Camélia','🌹'],['carnation','Cravo','🌸'],
 ['chrysanthemum','Crisântemo','🌼'],['dahlia','Dália','🌺'],['foxglove','Dedaleira','🪻'],['freesia','Frésia','🌷'],['geranium','Gerânio','🌺'],
 ['hibiscus','Hibisco','🌺'],['hyacinth','Jacinto','🪻'],['jasmine','Jasmim','🌼'],['marigold','Cravo-de-defunto','🌼'],['orchid','Orquídea','🌸'],
 ['peony','Peônia','🌸'],['petunia','Petúnia','🌺'],['snapdragon','Boca-de-leão','🌷'],['zinnia','Zínia','🌼'],['bluebell','Campainha-azul','🔔']
];
for(const[shape,name,e]of EXTRA_FLOWER_TYPES){
 const id=`flower_${shape}_1`;
 DECOR[id]={n:name,e,price:30,w:.72,d:.72,form:'flower',shape,petalColor:0xf48fb1,accent:0xffd66b,desc:`${name} de jardim com pétalas facetadas e folhas verdes.`};
}
const MORE_FLOWERS=[
 ['aster','Áster','🌼'],['baby_breath','Mosquitinho','🤍'],['buttercup','Ranúnculo','🌼'],['crocus','Açafrão','🌷'],['edelweiss','Edelweiss','❄️'],
 ['gardenia','Gardênia','🌼'],['gladiolus','Gladíolo','🌺'],['lotus','Lótus','🪷'],['magnolia','Magnólia','🌸'],['morning_glory','Glória-da-manhã','🪻'],
 ['plumeria','Pluméria','🌺'],['primrose','Prímula','🌼'],['ranunculus','Ranúnculo-dobrado','🌸'],['sweet_pea','Ervilha-de-cheiro','🌸'],['trillium','Trílio','🌷'],
 ['verbena','Verbena','🌺'],['wisteria','Glicínia','🪻'],['yarrow','Milefólio','🌼'],['water_lily','Vitória-régia','🪷'],['queen_anne','Flor-de-cenoura','🤍']
];
for(const[shape,name,e]of MORE_FLOWERS){
 const id=`flower_${shape}_1`;
 DECOR[id]={n:name,e,price:32,w:.72,d:.72,form:'flower',shape,petalColor:0xf48fb1,accent:0xffd66b,desc:`${name} ornamental com pétalas em camadas, centro dourado e folhas verdes.`};
}
const TREE_VARIANTS=[
 ['Árvore florida','🌸','blossom',0xf5f0e2,0xffd6e2],['Cerejeira Lilás','🌸','blossom',0xb99be8,0xf2d6ff],['Árvore Azul Glacial','🌳','round',0x72bfe5,0xd3f4ff],
 ['Árvore Coral','🌳','round',0xf18182,0xffc7aa],['Árvore Dourada','🌳','round',0xe8b84f,0xffe6a3],['Pinheiro Nevado','🌲','pine',0x477f68,0xf4f5ea],
 ['Pinheiro Roxo','🌲','pine',0x74619d,0xcab9e8],['Pinheiro Azul','🌲','pine',0x397d9b,0x9fe0ef],['Árvore de Outono','🍁','round',0xd97843,0xf2bd6d],
 ['Árvore de Folhas de Cobre','🍂','round',0xb77c52,0xe5b570],['Árvore de Folhas Menta','🍃','round',0x73b99b,0xc3ebbe],['Árvore de Folhas Vinho','🍁','round',0x874c69,0xd884a1],
 ['Árvore Verde-Limão','🌳','round',0x84b743,0xc5dd68],['Árvore Turquesa','🌳','round',0x3da9a0,0x92ded0],['Árvore Prateada','🌳','cloud',0x9caab5,0xe0e8e8],
 ['Árvore Chorona','🌳','willow',0x76a976,0xc1dfa0],['Árvore Colunar','🌲','column',0x57966d,0xb8db8c],
 ['Árvore de Nuvem','☁️','cloud',0x8dbd9a,0xf4f0e4],['Árvore de Cristal','💎','crystal',0x5792b4,0xa9d9ed],['Árvore Rosa-Chá','🌸','blossom',0xd885a4,0xffd4dd]
];
for(let i=0;i<TREE_VARIANTS.length;i++){
 const[name,e,style,color,accent]=TREE_VARIANTS[i],id=`tree_variety_${i+1}`;
 DECOR[id]={n:name,e,price:108+i%6*7,w:1.8,d:1.8,form:'tree',shape:style,treeStyle:style,color,accent,desc:`${name} ornamental, copa ${style==='pine'?'em camadas de pinheiro':style==='willow'?'pendente e graciosa':style==='column'?'alta e esguia':'volumosa em níveis'}, tronco facetado e folhagem detalhada.`};
}
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
 housing:{n:'Centro de moradias',e:'🏘️',w:5,d:4,price:0,lv:3,desc:'Receba convites para hóspedes da vila.'},
 wardrobe:{n:'Guarda-roupa dos gatos',e:'👒',w:3,d:3,price:250,lv:4,desc:'Crie acessórios para os gatinhos.'},
 resthouse:{n:'Torre de descanso',e:'🛏️',w:4,d:4,price:500,lv:5,desc:'Prepare vales de descanso para a vila.'},
 packing:{n:'Oficina de sacolas',e:'🛍️',w:4,d:3,price:600,lv:5,desc:'Transforme farinha em embalagens para as entregas.'},
 dairy:{n:'Fazenda de leite',e:'🥛',w:5,d:4,price:800,lv:6,desc:'Recolha leite fresco produzido pelas vaquinhas.'},
 observatory:{n:'Observatório',e:'🔭',w:4,d:4,price:1000,lv:6,desc:'Observe o céu e recolha fragmentos estelares.'},
 fishery:{n:'Área de pesca',e:'🎣',w:5,d:4,price:1200,lv:7,desc:'Pague por uma pescaria de espécie aleatória.'},
 nightmarket:{n:'Mercado noturno',e:'🏮',w:5,d:4,price:1500,lv:7,desc:'Recolha fichas especiais do mercado noturno.'},
 flowergarden:{n:'Jardim de flores',e:'🌷',w:5,d:4,price:800,lv:7,desc:'Colha buquês campestres para vender.'},
 toolshop:{n:'Loja de ferramentas',e:'🧰',w:4,d:4,price:1700,lv:8,desc:'Produza caixas para embalar mercadorias.'},
 archive:{n:'Estante mágica',e:'📚',w:4,d:3,price:2200,lv:19,desc:'Recolha páginas ilustradas para sua coleção.'}
});
export const MISSIONS=[
 {id:'m1',t:'Colher 10 plantações',k:'harvest',n:10,r:60},
 {id:'m2',t:'Cozinhar 5 pratos',k:'cook',n:5,r:80},
 {id:'m3',t:'Servir 5 clientes',k:'serve',n:5,r:100},
 {id:'m4',t:'Fazer carinho em 5',k:'pet',n:5,r:50},
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
 {lv:13,n:'Passe',e:'🎟️',d:'Trilha de missões e recompensas.'},
 {lv:16,n:'Eventos especiais',e:'🎉',d:'Atividades sazonais para a comunidade.'},
 {lv:19,n:'Estante mágica',e:'📚',d:'Organize coleções de gatos e acessórios.'},
 {lv:20,n:'Cidade em expansão',e:'🏙️',d:'Novas áreas, produção e decoração.'},
 {lv:30,n:'Mestre da vila',e:'🌟',d:'Mais espaço para construções e especializações.'},
 {lv:40,n:'Grande coleção',e:'💎',d:'Continue evoluindo gatos e instalações.'},
 {lv:50,n:'Cidade lendária',e:'👑',d:'Aproveite todos os sistemas e complete sua coleção.'}
];
export const STORY=[
 {id:'welcome',t:'Sua propriedade',d:'Você recebeu uma propriedade tranquila e três visitantes vieram conhecer o lugar.',goal:'Abra a jornada para começar.',stat:null},
 {id:'plant',t:'Plante trigo',d:'Toque na horta, escolha trigo e plante uma semente.',goal:'Plante trigo uma vez.',stat:'wheatPlanted',n:1},
 {id:'harvest',t:'Faça a primeira colheita',d:'Espere o trigo crescer e toque no canteiro pronto.',goal:'Colha trigo uma vez.',stat:'wheatHarvest',n:1},
 {id:'bake',t:'Prepare uma mercadoria',d:'Transforme trigo em farinha e use a farinha para assar pão.',goal:'Produza pão uma vez.',stat:'breadMade',n:1},
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

const EXTRA_CROPS=[
 ['beterraba','Beterraba','🫜',0xa94575],['batata','Batata','🥔',0xc7a779],['cebola','Cebola','🧅',0xb18aaf],
 ['alface','Alface','🥬',0x69bd72],['repolho','Repolho','🥬',0x7eaa76],['pepino','Pepino','🥒',0x4f9d65],
 ['pimentao','Pimentão','🫑',0xd94e55],['berinjela','Berinjela','🍆',0x76569a],['brocolis','Brócolis','🥦',0x4c985d],
 ['couveflor','Couve-flor','🥦',0xe8dfc7],['ervilha','Ervilha','🫛',0x82bd65],['vagem','Vagem','🫘',0x4b9e62],
 ['rabanete','Rabanete','🌱',0xe16c7a],['alho','Alho','🧄',0xe4dbc5],['batatadoce','Batata-doce','🍠',0xc47b54],
 ['melao','Melão','🍈',0xb5ca71],['melancia','Melancia','🍉',0x5cae74],['mirtilo','Mirtilo','🫐',0x596ca9],
 ['framboesa','Framboesa','🍇',0xd95778],['amora','Amora','🫐',0x654b89],['uva','Uva','🍇',0x815baf],
 ['limao','Limão','🍋',0xe2d34f],['laranja','Laranja','🍊',0xf49b42],['maca','Maçã','🍎',0xd65758],
 ['pera','Pera','🍐',0xa3bf58],['pessego','Pêssego','🍑',0xf0a18a],['cereja','Cereja','🍒',0xc34b60],
 ['ameixa','Ameixa','🫐',0x76517d],['coco','Coco','🥥',0x967154],['abacaxi','Abacaxi','🍍',0xc99d46]
];
EXTRA_CROPS.forEach(([id,n,e,c],i)=>{CROPS[id]={n,e,t:28+i*2,sell:8+i*2,seed:4+i, xp:3+Math.floor(i/4),lv:2+Math.floor(i/3),c}});
[
 ['banana','Banana','🍌',0xe8c446],['manga','Manga','🥭',0xf19b45],['kiwi','Kiwi','🥝',0x8e7048],
 ['mamao','Mamão','🧡',0xec874d],['roma','Romã','❤️',0xc23a4c],['damasco','Damasco','🍑',0xefaa70],
 ['limaotaiti','Limão-taiti','🍈',0x93bd46],['maracuja','Maracujá','💜',0x8752a8],
 ['goiaba','Goiaba','🍈',0xa8c755],['abacate','Abacate','🥑',0x719348],['pitaia','Pitaia','🌺',0xe25374],
 ['carambola','Carambola','⭐',0xdfbf47],['lichia','Lichia','🔴',0xc84856]
].forEach(([id,n,e,c],i)=>{CROPS[id]={n,e,t:55+i*3,sell:20+i*2,seed:10+i,xp:7+Math.floor(i/3),lv:7+Math.floor(i/3),c}});

const EXTRA_FOOD_NAMES=[
 ['Bolo de Cenoura','🍰'],['Pão de Beterraba','🍞'],['Torta de Batata','🥧'],['Sopa Cremosa de Cebola','🧅'],
 ['Salada Crocante','🥗'],['Rolinhos de Repolho','🥬'],['Picles Doces','🥒'],['Pimentões Recheados','🫑'],
 ['Lasanha de Berinjela','🍝'],['Gratinado de Brócolis','🥦'],['Creme de Couve-flor','🥣'],['Risoto de Ervilhas','🍚'],
 ['Vagem na Manteiga','🫛'],['Pãozinho de Alho','🥖'],['Nhoque de Batata-doce','🍠'],['Sorvete de Melão','🍨'],
 ['Suco de Melancia','🍉'],['Torta de Mirtilo','🫐'],['Geleia de Framboesa','🍯'],['Doce de Amora','🍇'],
 ['Suco de Uva','🧃'],['Tartelete de Limão','🍋'],['Bolo de Laranja','🍊'],['Maçã Caramelada','🍎'],
 ['Torta de Pera','🥧'],['Pêssego em Calda','🍑'],['Compota de Cereja','🍒'],['Bolo de Ameixa','🍰'],
 ['Biscoito de Coco','🥥'],['Doce de Abacaxi','🍍'],['Sopa Arco-íris','🌈'],['Espetinho da Horta','🍢'],
 ['Panqueca Verde','🥞'],['Pastel de Legumes','🥟'],['Quiche da Vovó','🥧'],['Sanduíche do Pomar','🥪'],
 ['Salada de Verão','🥗'],['Tigela de Frutas','🍓'],['Muffin do Jardim','🧁'],['Pão de Ervas','🍞'],
 ['Bolinho Dourado','🍡'],['Creme da Fazenda','🥣'],['Ensopado do Bosque','🍲'],['Torta Campestre','🥧'],
 ['Espaguete Colorido','🍝'],['Bruschetta de Tomate','🍅'],['Pudim de Abóbora','🍮'],['Croquete Crocante','🥔'],
 ['Curry Aconchegante','🍛'],['Sopa da Lua','🍜'],['Risoto do Pomar','🍚'],['Rocambole de Morango','🍓'],
 ['Bolo Nuvem','🎂'],['Biscoito Estrelinha','🍪'],['Pão de Mel','🍯'],['Waffle de Frutas','🧇'],
 ['Torrada Francesa','🍞'],['Mingau de Milho','🥣'],['Empadinha de Ervilha','🥧'],['Taco da Horta','🌮'],
 ['Pizza Fofinha','🍕'],['Wrap Primavera','🌯'],['Bolinho de Arroz','🍙'],['Creme de Cogumelo','🍄'],
 ['Suflê de Queijo','🧀'],['Macarrão da Vila','🍝'],['Salada de Inverno','🥬'],['Sopa de Raízes','🥕'],
 ['Bolo Girassol','🌻'],['Torta de Framboesa','🍰'],['Geleia de Maçã','🍯'],['Picolé Tropical','🍧'],
 ['Pão Trançado','🥖'],['Pão de Abóbora','🎃'],['Panini de Legumes','🥪'],['Cestinha de Salada','🥗'],
 ['Brigadeiro de Amora','🍬'],['Doce de Pêssego','🍑'],['Bolo de Cereja','🍒'],['Biscoito de Limão','🍋'],
 ['Tarte de Uva','🍇'],['Creme de Batata','🥔'],['Panqueca de Cenoura','🥞'],['Pastel de Milho','🌽'],
 ['Torta de Legumes','🥧']
];
const cropKeys=Object.keys(CROPS);
EXTRA_FOOD_NAMES.forEach(([n,e],i)=>{
 const first=cropKeys[(i*7+1)%cropKeys.length],second=cropKeys[(i*11+5)%cropKeys.length];
 const inputs={[first]:1};if(first!==second)inputs[second]=1;
 const lv=Math.max(CROPS[first].lv,CROPS[second].lv,2+Math.floor(i/4));
 const id='dish_'+String(i+1).padStart(2,'0');
 RECIPES[id]={n,e,b:i%3===0?'bakery':'kitchen',in:inputs,t:22+i%7*4,sell:22+i*3,xp:5+Math.floor(i/5),lv};
});

const FRUIT_TREE_ROWS=[
 ['maca','Macieira','🍎',0xc95757,0x6da85f],['pera','Pereira','🍐',0x97b956,0x72ad68],
 ['pessego','Pessegueiro','🍑',0xec9e83,0x69a85f],['cereja','Cerejeira frutífera','🍒',0xb93e60,0x6aa35d],
 ['ameixa','Ameixeira','🫐',0x76517d,0x699d61],['laranja','Laranjeira','🍊',0xf08b32,0x4f9660],
 ['limao','Limoeiro','🍋',0xd5cf39,0x5a9e53],['uva','Parreira de uvas','🍇',0x7652ad,0x679456],
 ['mirtilo','Arbusto de mirtilo','🫐',0x5368a6,0x568b5d],['framboesa','Framboeseira','🍇',0xd44770,0x57965b],
 ['amora','Amoreira','🫐',0x573d77,0x5d9958],['coco','Coqueiro','🥥',0x957151,0x54a47b],
 ['abacaxi','Abacaxizeiro','🍍',0xc6a13c,0x6e9b55],['melao','Meloeiro','🍈',0xb2c86b,0x5a9d57],
 ['melancia','Melancieira','🍉',0x54a968,0x5c9957],['strawberry','Morangueiro','🍓',0xe24b71,0x569b54],
 ['banana','Bananeira','🍌',0xe8c446,0x6a9c53],['tomato','Tomateiro','🍅',0xe14f43,0x639e58],
 ['goiaba','Pé de goiaba','🍐',0xdf9f72,0x579a68],['manga','Pé de manga','🥭',0xf19b45,0x619c5c],
 ['kiwi','Pé de kiwi','🥝',0x8e7048,0x4e9964],['mamao','Pé de mamão','🧡',0xec874d,0x68a464],
 ['roma','Pé de romã','❤️',0xc23a4c,0x559d5e],['damasco','Pé de damasco','🍑',0xefaa70,0x71a958],
 ['limaotaiti','Limoeiro-taiti','🍈',0x93bd46,0x51965b],['maracuja','Pé de maracujá','💜',0x8752a8,0x669758],
 ['abacate','Abacateiro','🥑',0x719348,0x6b9d59],['pitaia','Pé de pitaia','🌺',0xe25374,0x549765],
 ['carambola','Caramboleira','⭐',0xdfbf47,0x6da35d],['lichia','Pé de lichia','🔴',0xc84856,0x669451]
];
export const FRUIT_TREES={};
FRUIT_TREE_ROWS.forEach(([fruit,n,e,fruitColor,leafColor],i)=>{
 const id='fruit_tree_'+String(i+1).padStart(2,'0');
 const produce=CROPS[fruit]?.n||fruit;
 const data={n,e,price:160+i*12,w:1.9,d:1.9,form:'fruitTree',fruit,fruitColor,leafColor,grow:45000+i*2500,yield:2+Math.floor(i/10),lv:3+Math.floor(i/3),desc:`${n}: copa arredondada, tronco e frutos visíveis. Colhe ${2+Math.floor(i/10)} ${produce.toLowerCase()} a cada ${Math.ceil((45000+i*2500)/60000)} min.`};
 DECOR[id]=data;FRUIT_TREES[id]=data;
});

const EXTRA_BUILDINGS=[
 ['barn','Celeiro','🐑',4,5,4,700,'Recolha produtos dos animais da fazenda.','barn'],
 ['silo','Silo de Grãos','🌾',5,3,3,850,'Recolha sacos de grãos para vender.','silo'],
 ['sheep_pen','Aprisco das Ovelhas','🐑',5,5,4,900,'Um cercado aconchegante para ovelhas fofinhas.','pen'],
 ['cow_barn','Estábulo das Vaquinhas','🐮',6,5,5,1200,'Recolha leite fresco das vaquinhas.','barn'],
 ['chicken_coop','Galinheiro das Estrelinhas','🐔',5,4,4,800,'Recolha ovos caipiras das galinhas.','pen'],
 ['duck_pond','Lago dos Patinhos','🦆',6,5,4,1050,'Recolha plumas macias dos patinhos.','pond'],
 ['bee_garden','Jardim das Abelhas','🐝',7,4,4,1100,'Recolha mel produzido pelas colmeias.','garden'],
 ['goat_stable','Cabana das Cabras','🐐',7,5,4,1250,'Recolha leite fresco das cabrinhas.','barn'],
 ['rabbit_hutch','Casa dos Coelhos','🐰',6,4,3,920,'Recolha pelagens macias dos coelhos.','pen'],
 ['orchard','Pomareiro Comunitário','🍎',5,5,5,950,'Recolha cestas de frutas do pomar.','garden'],
 ['greenhouse','Estufa de Cristal','🌿',8,6,4,1800,'Cultive e recolha maços de ervas.','glass'],
 ['flower_shop','Floricultura Catavento','💐',7,4,4,1300,'Monte e recolha buquês campestres.','shop'],
 ['cheese_house','Queijaria','🧀',9,5,4,2200,'Produza e recolha queijos artesanais.','shop'],
 ['grain_mill','Moinho do Trigo','🌬️',8,5,5,1900,'Triture e recolha sacos de farinha.','mill'],
 ['jam_house','Fábrica de Geleias','🍯',8,4,4,1750,'Prepare e recolha geleias artesanais.','shop'],
 ['fish_pond','Viveiro dos Peixinhos','🐟',7,5,4,1500,'Compre 20 espécies de peixes para sua coleção.','pond'],
 ['windmill','Moinho de Vento','🌾',10,5,5,2800,'Produza sacos de farinha com as pás do moinho.','mill'],
 ['tailor_house','Ateliê dos Gatinhos','🧵',9,4,4,2100,'Costure e recolha roupinhas para os gatos.','shop'],
 ['cat_library','Biblioteca','📚',10,5,4,2500,'Recolha livros de histórias felinas.','shop'],
 ['cat_hotel','Hotel','🛎️',11,6,5,3200,'Receba hóspedes e recolha gorjetas.','hotel']
];
EXTRA_BUILDINGS.forEach(([id,n,e,lv,w,d,price,desc,style])=>{BUILD[id]={n,e,lv,w,d,price,desc,style}});
export const GOODS={
 milk:{n:'Leite fresco',e:'🥛',sell:12,xp:5},
 cheese:{n:'Queijo',e:'🧀',sell:44,xp:14},
 farm_eggs:{n:'Ovos caipiras',e:'🥚',sell:18,xp:5},
 wool:{n:'Lã macia',e:'🧶',sell:24,xp:6},
 duck_down:{n:'Plumas de pato',e:'🪶',sell:20,xp:5},
 honey:{n:'Mel silvestre',e:'🍯',sell:30,xp:8},
 goat_milk:{n:'Leite de cabra',e:'🥛',sell:26,xp:7},
 rabbit_fur:{n:'Pelagem de coelho',e:'🐇',sell:22,xp:6},
 grain_sack:{n:'Saco de grãos',e:'🌾',sell:28,xp:7},
 fruit_crate:{n:'Cesta de frutas',e:'🧺',sell:36,xp:8},
 herb_bundle:{n:'Maço de ervas',e:'🌿',sell:32,xp:8},
 flower_bouquet:{n:'Buquê campestre',e:'💐',sell:34,xp:8},
 flour_sack:{n:'Saco de farinha',e:'🌾',sell:30,xp:7},
 berry_jam:{n:'Geleia artesanal',e:'🍯',sell:42,xp:10},
 guest_pass:{n:'Convite de hóspede',e:'🎟️',sell:25,xp:6},
 cat_accessory:{n:'Acessório de gatinho',e:'👒',sell:38,xp:8},
 rest_token:{n:'Vale-descanso',e:'🛏️',sell:20,xp:5},
 star_fragment:{n:'Fragmento estelar',e:'🌟',sell:55,xp:12},
 night_token:{n:'Ficha do mercado noturno',e:'🏮',sell:32,xp:8},
 archive_page:{n:'Página ilustrada',e:'📜',sell:28,xp:7},
 outfit:{n:'Roupa de gatinho',e:'🧵',sell:46,xp:10},
 cat_book:{n:'Livro de histórias felinas',e:'📚',sell:40,xp:9},
 hotel_tip:{n:'Gorjeta do hotel',e:'🪙',sell:50,xp:10}
};
export const BUILDING_PRODUCERS={
 barn:{item:'farm_eggs',interval:35,amount:2},
 silo:{item:'grain_sack',interval:40,amount:1},
 sheep_pen:{item:'wool',interval:40,amount:1},
 cow_barn:{item:'milk',interval:35,amount:2},
 chicken_coop:{item:'farm_eggs',interval:30,amount:2},
 duck_pond:{item:'duck_down',interval:35,amount:2},
 bee_garden:{item:'honey',interval:35,amount:1},
 goat_stable:{item:'goat_milk',interval:38,amount:1},
 rabbit_hutch:{item:'rabbit_fur',interval:35,amount:1},
 orchard:{item:'fruit_crate',interval:45,amount:1},
 greenhouse:{item:'herb_bundle',interval:35,amount:1},
 flower_shop:{item:'flower_bouquet',interval:40,amount:1},
 cheese_house:{item:'cheese',interval:45,amount:1},
 grain_mill:{item:'flour_sack',interval:40,amount:1},
 jam_house:{item:'berry_jam',interval:45,amount:1},
 windmill:{item:'flour_sack',interval:35,amount:2},
 housing:{item:'guest_pass',interval:50,amount:1},
 wardrobe:{item:'cat_accessory',interval:45,amount:1},
 resthouse:{item:'rest_token',interval:40,amount:1},
 dairy:{item:'milk',interval:30,amount:2},
 observatory:{item:'star_fragment',interval:55,amount:1},
 nightmarket:{item:'night_token',interval:45,amount:1},
 flowergarden:{item:'flower_bouquet',interval:35,amount:1},
 archive:{item:'archive_page',interval:45,amount:1},
 cat_hotel:{item:'hotel_tip',interval:50,amount:1},
 cat_library:{item:'cat_book',interval:45,amount:1},
 tailor_house:{item:'outfit',interval:45,amount:1}
};
export const FISH=[
 ['sardinha','Sardinha','🐟',1,35],['tilapia','Tilápia','🐠',1,40],['carpa','Carpa','🐟',2,45],
 ['lambari','Lambari','🐟',2,50],['bagre','Bagre','🐟',3,55],['truta','Truta','🐟',3,60],
 ['robalo','Robalo','🐠',4,70],['dourado','Dourado','🐟',4,75],['atum','Atum','🐟',5,85],
 ['peixe_palhaco','Peixe-palhaço','🐠',5,90],['baiacu','Baiacu','🐡',6,100],['enguia','Enguia','🐍',6,110],
 ['lula','Lula','🦑',7,125],['polvo','Polvo','🐙',7,140],['cavalo_marinho','Cavalo-marinho','🐠',8,160],
 ['peixe_lua','Peixe-lua','🐟',8,180],['peixe_espada','Peixe-espada','🐠',9,210],['arraia','Arraia','🐟',9,240],
 ['celacanto','Celacanto','🐟',10,300],['peixe_arco_iris','Peixe-arco-íris','🌈',11,400]
].map(([id,n,e,lv,sell])=>{GOODS[id]={n,e,lv,sell,cost:sell*2,xp:Math.ceil(sell/8)};return{id,n,e,lv,sell,cost:sell*2}});
export const LEVEL_MISSIONS=Array.from({length:50},(_,i)=>{const lv=i+1;return{id:'level_'+lv,t:`Alcance o nível ${lv}`,k:'lv',n:lv,r:40+lv*18,unlock:lv}});
export const activeMissions=lv=>[...MISSIONS,...LEVEL_MISSIONS.filter(m=>m.unlock<=lv)];
