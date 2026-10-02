// Coreano - contenido A1 (hangul + romanizacion revisada en 'reading')
export default {
  code: 'ko',
  vocab: {
    saludos: [
      ['안녕하세요', 'hola / buenos dias', 'interj', 'annyeonghaseyo', '안녕하세요, 잘 지내요?', 'Hola, como estas?'],
      ['안녕', 'hola / adios (informal)', 'interj', 'annyeong', '안녕, 내일 봐.', 'Adios, hasta manana.'],
      ['안녕히 가세요', 'adios (a quien se va)', 'expr', 'annyeonghi gaseyo', '안녕히 가세요.', 'Adios.'],
      ['감사합니다', 'gracias', 'expr', 'gamsahamnida', '정말 감사합니다.', 'Muchas gracias.'],
      ['주세요', 'deme / por favor', 'verbo', 'juseyo', '커피 주세요.', 'Un cafe, por favor.'],
      ['죄송합니다', 'perdon / lo siento', 'expr', 'joesonghamnida', '죄송합니다, 늦었어요.', 'Perdon, llego tarde.'],
      ['네', 'si', 'adv', 'ne', '네, 알겠어요.', 'Si, entiendo.'],
      ['아니요', 'no', 'adv', 'aniyo', '아니요, 괜찮아요.', 'No, gracias.'],
      ['제 이름은', 'mi nombre es', 'expr', 'je ireumeun', '제 이름은 아나예요.', 'Me llamo Ana.'],
      ['만나서 반갑습니다', 'encantado de conocerte', 'expr', 'mannaseo bangapseumnida', '만나서 반갑습니다.', 'Encantado de conocerte.'],
      ['잘 지내요', 'como estas / que tal', 'expr', 'jal jinaeyo', '요즘 잘 지내요?', 'Que tal ultimamente?'],
      ['실례합니다', 'disculpe', 'expr', 'sillyehamnida', '실례합니다.', 'Disculpe.'],
    ],
    numeros: [
      ['일', 'uno', 'num', 'il'], ['이', 'dos', 'num', 'i'], ['삼', 'tres', 'num', 'sam'],
      ['사', 'cuatro', 'num', 'sa'], ['오', 'cinco', 'num', 'o'], ['십', 'diez', 'num', 'sip'],
      ['이십', 'veinte', 'num', 'isip'], ['백', 'cien', 'num', 'baek'],
      ['시간', 'hora / tiempo', 'sust', 'sigan', '지금 몇 시예요?', 'Que hora es?'],
      ['오늘', 'hoy', 'sust', 'oneul', '오늘은 월요일이에요.', 'Hoy es lunes.'],
      ['내일', 'manana', 'sust', 'naeil', '내일 봐요!', 'Hasta manana!'],
      ['어제', 'ayer', 'sust', 'eoje', '어제 비가 왔어요.', 'Ayer llovio.'],
      ['주', 'la semana', 'sust', 'ju', '다음 주', 'la proxima semana'],
      ['날', 'el dia', 'sust', 'nal', '좋은 날이에요.', 'Es un buen dia.'],
    ],
    personas: [
      ['가족', 'la familia', 'sust', 'gajok', '우리 가족은 대가족이에요.', 'Mi familia es grande.'],
      ['어머니', 'la madre', 'sust', 'eomeoni'],
      ['아버지', 'el padre', 'sust', 'abeoji'],
      ['형', 'el hermano mayor (de un hombre)', 'sust', 'hyeong'],
      ['누나', 'la hermana mayor (de un hombre)', 'sust', 'nuna'],
      ['아이', 'el nino / la nina', 'sust', 'ai', '아이들이 놀아요.', 'Los ninos juegan.'],
      ['친구', 'el amigo / la amiga', 'sust', 'chingu', '제일 친한 친구예요.', 'Es mi mejor amigo.'],
      ['사람', 'la persona', 'sust', 'saram'],
      ['여자', 'la mujer', 'sust', 'yeoja'],
      ['남자', 'el hombre', 'sust', 'namja'],
      ['이름', 'el nombre', 'sust', 'ireum', '이름이 뭐예요?', 'Como te llamas?'],
      ['선생님', 'el profesor', 'sust', 'seonsaengnim'],
    ],
    comida: [
      ['물', 'el agua', 'sust', 'mul', '물 주세요.', 'Agua, por favor.'],
      ['빵', 'el pan', 'sust', 'ppang', '빵이 신선해요.', 'El pan esta fresco.'],
      ['치즈', 'el queso', 'sust', 'chijeu'],
      ['사과', 'la manzana', 'sust', 'sagwa'],
      ['커피', 'el cafe', 'sust', 'keopi', '커피 한 잔 주세요.', 'Un cafe, por favor.'],
      ['와인', 'el vino', 'sust', 'wain'],
      ['고기', 'la carne', 'sust', 'gogi', '고기를 안 먹어요.', 'No como carne.'],
      ['생선', 'el pescado', 'sust', 'saengseon'],
      ['먹다', 'comer', 'verbo', 'meokda', '과일을 먹어요.', 'Como fruta.'],
      ['마시다', 'beber', 'verbo', 'masida', '물을 마셔요.', 'Bebo agua.'],
      ['아침', 'el desayuno / la manana', 'sust', 'achim'],
      ['계산서', 'la cuenta', 'sust', 'gyesanseo', '계산서 주세요.', 'La cuenta, por favor.'],
    ],
    casa: [
      ['집', 'la casa', 'sust', 'jip', '작은 집에 살아요.', 'Vivo en una casa pequena.'],
      ['방', 'la habitacion', 'sust', 'bang'],
      ['부엌', 'la cocina', 'sust', 'bueok'],
      ['화장실', 'el bano', 'sust', 'hwajangsil'],
      ['문', 'la puerta', 'sust', 'mun', '문 좀 닫아 주세요.', 'Cierra la puerta, por favor.'],
      ['창문', 'la ventana', 'sust', 'changmun'],
      ['탁자', 'la mesa', 'sust', 'takja'],
      ['의자', 'la silla', 'sust', 'uija'],
      ['침대', 'la cama', 'sust', 'chimdae'],
      ['열쇠', 'la llave', 'sust', 'yeolsoe', '열쇠를 잃어버렸어요.', 'He perdido la llave.'],
      ['정원', 'el jardin', 'sust', 'jeongwon'],
    ],
    verbos1: [
      ['이다', 'ser', 'verbo', 'ida', '저는 학생이에요.', 'Soy estudiante.'],
      ['있다', 'haber / estar / tener', 'verbo', 'itda', '책이 있어요.', 'Hay un libro.'],
      ['없다', 'no haber / no tener', 'verbo', 'eopda', '시간이 없어요.', 'No tengo tiempo.'],
      ['가다', 'ir', 'verbo', 'gada', '회사에 가요.', 'Voy a la oficina.'],
      ['오다', 'venir', 'verbo', 'oda', '여기 오세요.', 'Ven aqui.'],
      ['하다', 'hacer', 'verbo', 'hada', '뭐 해요?', 'Que haces?'],
      ['보다', 'ver / mirar', 'verbo', 'boda', '바다를 봐요.', 'Veo el mar.'],
      ['말하다', 'hablar / decir', 'verbo', 'malhada', '한국어를 조금 해요.', 'Hablo un poco de coreano.'],
      ['원하다', 'querer', 'verbo', 'wonhada', '한국어를 배우고 싶어요.', 'Quiero aprender coreano.'],
      ['알다', 'saber / conocer', 'verbo', 'alda', '몰라요.', 'No lo se.'],
      ['주다', 'dar', 'verbo', 'juda', '이것 좀 주세요.', 'Deme esto, por favor.'],
      ['타다', 'coger / montar (transporte)', 'verbo', 'tada', '버스를 타요.', 'Cojo el autobus.'],
    ],
    ciudad: [
      ['도시', 'la ciudad', 'sust', 'dosi', '서울은 큰 도시예요.', 'Seul es una ciudad grande.'],
      ['길', 'la calle / el camino', 'sust', 'gil'],
      ['역', 'la estacion', 'sust', 'yeok', '역이 멀어요?', 'La estacion esta lejos?'],
      ['병원', 'el hospital', 'sust', 'byeongwon'],
      ['은행', 'el banco', 'sust', 'eunhaeng'],
      ['왼쪽', 'la izquierda', 'sust', 'oenjjok', '왼쪽으로 가세요.', 'Vaya a la izquierda.'],
      ['오른쪽', 'la derecha', 'sust', 'oreunjjok', '오른쪽에 있어요.', 'Esta a la derecha.'],
      ['직진', 'todo recto', 'sust', 'jikjin', '직진하세요.', 'Vaya todo recto.'],
      ['가깝다', 'estar cerca', 'adj', 'gakkapda', '아주 가까워요.', 'Esta muy cerca.'],
      ['멀다', 'estar lejos', 'adj', 'meolda', '여기서 멀어요?', 'Esta lejos de aqui?'],
      ['어디', 'donde', 'adv', 'eodi', '출구가 어디예요?', 'Donde esta la salida?'],
      ['지도', 'el mapa', 'sust', 'jido'],
    ],
    compras: [
      ['가게', 'la tienda', 'sust', 'gage', '가게가 문을 열었어요.', 'La tienda esta abierta.'],
      ['시장', 'el mercado', 'sust', 'sijang'],
      ['돈', 'el dinero', 'sust', 'don', '돈이 없어요.', 'No tengo dinero.'],
      ['가격', 'el precio', 'sust', 'gagyeok', '가격이 어떻게 돼요?', 'Cual es el precio?'],
      ['비싸다', 'ser caro', 'adj', 'bissada', '너무 비싸요.', 'Es demasiado caro.'],
      ['싸다', 'ser barato', 'adj', 'ssada'],
      ['사다', 'comprar', 'verbo', 'sada', '이 책을 사고 싶어요.', 'Quiero comprar este libro.'],
      ['내다', 'pagar', 'verbo', 'naeda', '카드로 낼 수 있어요?', 'Puedo pagar con tarjeta?'],
      ['얼마', 'cuanto', 'sust', 'eolma', '이거 얼마예요?', 'Cuanto cuesta esto?'],
      ['무료', 'gratis', 'sust', 'muryo'],
      ['열다', 'abrir', 'verbo', 'yeolda'],
      ['닫다', 'cerrar', 'verbo', 'datda'],
    ],
    trabajo: [
      ['일', 'el trabajo', 'sust', 'il', '제 일을 좋아해요.', 'Me gusta mi trabajo.'],
      ['사무실', 'la oficina', 'sust', 'samusil'],
      ['학교', 'la escuela', 'sust', 'hakgyo'],
      ['사장님', 'el jefe', 'sust', 'sajangnim'],
      ['동료', 'el colega', 'sust', 'dongnyo'],
      ['컴퓨터', 'el ordenador', 'sust', 'keompyuteo'],
      ['회의', 'la reunion', 'sust', 'hoeui', '열 시에 회의가 있어요.', 'Tengo una reunion a las diez.'],
      ['일하다', 'trabajar', 'verbo', 'ilhada', '은행에서 일해요.', 'Trabajo en un banco.'],
      ['공부하다', 'estudiar', 'verbo', 'gongbuhada', '법을 공부해요.', 'Estudio derecho.'],
      ['배우다', 'aprender', 'verbo', 'baeuda', '프랑스어를 배워요.', 'Aprendo frances.'],
      ['직업', 'la profesion', 'sust', 'jigeop'],
      ['바쁘다', 'estar ocupado', 'adj', 'bappeuda'],
    ],
    viajes: [
      ['여행', 'el viaje', 'sust', 'yeohaeng', '좋은 여행 되세요.', 'Buen viaje.'],
      ['공항', 'el aeropuerto', 'sust', 'gonghang'],
      ['비행기', 'el avion', 'sust', 'bihaenggi', '비행기가 열두 시에 떠나요.', 'El avion sale a las doce.'],
      ['기차', 'el tren', 'sust', 'gicha'],
      ['자동차', 'el coche', 'sust', 'jadongcha'],
      ['표', 'el billete', 'sust', 'pyo', '왕복표 주세요.', 'Un billete de ida y vuelta, por favor.'],
      ['호텔', 'el hotel', 'sust', 'hotel'],
      ['여행 가방', 'la maleta', 'sust', 'yeohaeng gabang'],
      ['여권', 'el pasaporte', 'sust', 'yeogwon'],
      ['떠나다', 'salir / partir', 'verbo', 'tteonada', '기차가 열두 시에 떠나요.', 'El tren sale a las doce.'],
      ['도착하다', 'llegar', 'verbo', 'dochakhada', '내일 도착해요.', 'Llegamos manana.'],
      ['예약하다', 'reservar', 'verbo', 'yeyakhada', '방을 예약하고 싶어요.', 'Quiero reservar una habitacion.'],
    ],
    salud: [
      ['건강', 'la salud', 'sust', 'geongang'],
      ['몸', 'el cuerpo', 'sust', 'mom'],
      ['머리', 'la cabeza / el pelo', 'sust', 'meori', '머리가 아파요.', 'Me duele la cabeza.'],
      ['손', 'la mano', 'sust', 'son'],
      ['발', 'el pie', 'sust', 'bal'],
      ['의사', 'el medico', 'sust', 'uisa', '의사한테 가야 해요.', 'Tengo que ir al medico.'],
      ['아프다', 'doler / estar enfermo', 'adj', 'apeuda', '아파요.', 'Estoy enfermo.'],
      ['약국', 'la farmacia', 'sust', 'yakguk'],
      ['약', 'la medicina', 'sust', 'yak'],
      ['느끼다', 'sentir', 'verbo', 'neukkida', '좀 나아졌어요.', 'Me siento mejor.'],
      ['통증', 'el dolor', 'sust', 'tongjeung'],
      ['피곤하다', 'estar cansado', 'adj', 'pigonhada'],
    ],
    tiempo_libre: [
      ['날씨', 'el tiempo (clima)', 'sust', 'nalssi', '날씨가 어때요?', 'Que tiempo hace?'],
      ['해', 'el sol', 'sust', 'hae', '해가 나요.', 'Hace sol.'],
      ['비', 'la lluvia', 'sust', 'bi', '비가 와요.', 'Llueve.'],
      ['바람', 'el viento', 'sust', 'baram'],
      ['눈', 'la nieve / el ojo', 'sust', 'nun'],
      ['나무', 'el arbol', 'sust', 'namu'],
      ['바다', 'el mar', 'sust', 'bada', '바다에 가요.', 'Vamos al mar.'],
      ['산', 'la montana', 'sust', 'san'],
      ['개', 'el perro', 'sust', 'gae'],
      ['고양이', 'el gato', 'sust', 'goyangi'],
      ['음악', 'la musica', 'sust', 'eumak', '음악을 들어요.', 'Escucho musica.'],
      ['놀다', 'jugar', 'verbo', 'nolda', '축구를 해요.', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'ko-hangul', title: 'El hangul: un alfabeto que se aprende en un dia', cefr: 'A1', body:
`El hangul tiene 24 letras basicas (14 consonantes + 10 vocales) que se agrupan en **silabas**:
- 한 = ㅎ(h) + ㅏ(a) + ㄴ(n) -> "han"
- 국 = ㄱ(g) + ㅜ(u) + ㄱ(k) -> "guk"
No es ideografico: es fonetico y muy regular. Aprenderlo es el mejor primer paso.` },
    { skill: 'verbos1', slug: 'ko-particulas', title: 'Particulas: 은/는, 이/가, 을/를', cefr: 'A1', body:
`El coreano marca la funcion con particulas detras del sustantivo (la forma cambia si acaba en vocal o consonante):
- **은/는** (tema): 저**는** 아나예요.
- **이/가** (sujeto): 물**이** 있어요.
- **을/를** (objeto): 커피**를** 마셔요.
El verbo va SIEMPRE al final.` },
    { skill: 'trabajo', slug: 'ko-cortesia', title: 'Niveles de cortesia: -요 y -ㅂ니다', cefr: 'A1', body:
`Los verbos cambian de terminacion segun la formalidad:
- **-아요/어요**: cortes y cotidiano -> 가**요**, 먹어**요**, 좋아**요**.
- **-(스)ㅂ니다**: formal (trabajo, presentaciones) -> 갑**니다**, 감사합**니다**.
El registro informal (반말) se reserva para amigos cercanos y familia.` },
  ],
  readings: [
    { skill: 'saludos', title: '새 동료', cefr: 'A1', body:
`"안녕하세요. 여기 처음이세요?"
"네, 제 이름은 민수예요. 마케팅 팀에서 일해요."
"만나서 반갑습니다, 민수 씨. 저는 지영이에요. 커피 드실래요?"
"네, 주세요. 부엌이 어디예요?"
"저기 오른쪽에 있어요. 회의는 열 시에 시작해요."
"감사합니다. 이따 봬요!"`,
      translation:
`"Hola. Es su primera vez aqui?"
"Si, me llamo Minsu. Trabajo en el equipo de marketing."
"Encantada, Minsu. Yo soy Jiyeong. Quiere un cafe?"
"Si, por favor. Donde esta la cocina?"
"Esta alli, a la derecha. La reunion empieza a las diez."
"Gracias. Hasta luego!"`,
      questions: [
        { q: 'Donde trabaja Minsu?', options: ['En marketing', 'En ventas', 'En finanzas'], answer: 0 },
        { q: 'Donde esta la cocina?', options: ['A la derecha', 'A la izquierda', 'Arriba'], answer: 0 },
        { q: 'A que hora empieza la reunion?', options: ['A las diez', 'A las nueve', 'A las once'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'compras', title: '가게에서', scenario: 'Compras algo en una tienda en Seul.', lines: [
      { speaker: '점원', target: '어서 오세요. 뭐 찾으세요?', source: 'Bienvenido. Que busca?' },
      { speaker: '손님', target: '이 책 얼마예요?', source: 'Cuanto cuesta este libro?' },
      { speaker: '점원', target: '만 오천 원이에요.', source: 'Quince mil wones.' },
      { speaker: '손님', target: '카드로 낼 수 있어요?', source: 'Puedo pagar con tarjeta?' },
      { speaker: '점원', target: '네, 물론이죠. 여기 있습니다.', source: 'Si, por supuesto. Aqui tiene.' },
      { speaker: '손님', target: '감사합니다. 좋은 하루 되세요!', source: 'Gracias. Buen dia!' },
    ] },
  ],
};
