// Japones - contenido A1 (kana/kanji basico + romaji en 'reading')
export default {
  code: 'ja',
  vocab: {
    saludos: [
      ['こんにちは', 'hola / buenas tardes', 'interj', 'konnichiwa', 'こんにちは、げんきですか。', 'Hola, como estas?'],
      ['おはようございます', 'buenos dias', 'expr', 'ohayō gozaimasu', 'おはようございます。', 'Buenos dias.'],
      ['こんばんは', 'buenas noches', 'interj', 'konbanwa', 'こんばんは。', 'Buenas noches.'],
      ['さようなら', 'adios', 'interj', 'sayōnara', 'さようなら、またあした。', 'Adios, hasta manana.'],
      ['ありがとうございます', 'gracias', 'expr', 'arigatō gozaimasu', 'どうもありがとうございます。', 'Muchas gracias.'],
      ['おねがいします', 'por favor', 'expr', 'onegai shimasu', 'コーヒーをおねがいします。', 'Un cafe, por favor.'],
      ['すみません', 'perdon / disculpe', 'expr', 'sumimasen', 'すみません、おくれました。', 'Perdon, llego tarde.'],
      ['はい', 'si', 'adv', 'hai', 'はい、わかります。', 'Si, entiendo.'],
      ['いいえ', 'no', 'adv', 'iie', 'いいえ、けっこうです。', 'No, gracias.'],
      ['わたしは', 'yo (soy)...', 'expr', 'watashi wa', 'わたしはアナです。', 'Yo soy Ana.'],
      ['はじめまして', 'encantado (primera vez)', 'expr', 'hajimemashite', 'はじめまして。', 'Encantado de conocerte.'],
      ['げんきですか', 'como estas', 'expr', 'genki desu ka', 'おげんきですか。', 'Como esta usted?'],
    ],
    numeros: [
      ['いち', 'uno', 'num', 'ichi'], ['に', 'dos', 'num', 'ni'], ['さん', 'tres', 'num', 'san'],
      ['よん', 'cuatro', 'num', 'yon'], ['ご', 'cinco', 'num', 'go'], ['じゅう', 'diez', 'num', 'jū'],
      ['にじゅう', 'veinte', 'num', 'nijū'], ['ひゃく', 'cien', 'num', 'hyaku'],
      ['じかん', 'hora / tiempo', 'sust', 'jikan', 'いま なんじ ですか。', 'Que hora es?'],
      ['きょう', 'hoy', 'sust', 'kyō', 'きょうは げつようび です。', 'Hoy es lunes.'],
      ['あした', 'manana', 'sust', 'ashita', 'また あした。', 'Hasta manana.'],
      ['きのう', 'ayer', 'sust', 'kinō', 'きのう あめ でした。', 'Ayer llovio.'],
      ['しゅう', 'la semana', 'sust', 'shū', 'らいしゅう', 'la proxima semana'],
      ['ひ', 'el dia', 'sust', 'hi', 'いい ひ ですね。', 'Que buen dia.'],
    ],
    personas: [
      ['かぞく', 'la familia', 'sust', 'kazoku', 'わたしの かぞくは おおきい です。', 'Mi familia es grande.'],
      ['おかあさん', 'la madre', 'sust', 'okāsan'],
      ['おとうさん', 'el padre', 'sust', 'otōsan'],
      ['おにいさん', 'el hermano mayor', 'sust', 'onīsan'],
      ['おねえさん', 'la hermana mayor', 'sust', 'onēsan'],
      ['こども', 'el nino / la nina', 'sust', 'kodomo', 'こどもが あそんで います。', 'Los ninos juegan.'],
      ['ともだち', 'el amigo / la amiga', 'sust', 'tomodachi', 'かれは わたしの ともだち です。', 'El es mi amigo.'],
      ['ひと', 'la persona', 'sust', 'hito'],
      ['おんなのひと', 'la mujer', 'sust', 'onna no hito'],
      ['おとこのひと', 'el hombre', 'sust', 'otoko no hito'],
      ['なまえ', 'el nombre', 'sust', 'namae', 'おなまえは なん ですか。', 'Como se llama?'],
      ['せんせい', 'el profesor / doctor', 'sust', 'sensei'],
    ],
    comida: [
      ['みず', 'el agua', 'sust', 'mizu', 'みずを ください。', 'Agua, por favor.'],
      ['パン', 'el pan', 'sust', 'pan'],
      ['チーズ', 'el queso', 'sust', 'chīzu'],
      ['りんご', 'la manzana', 'sust', 'ringo'],
      ['コーヒー', 'el cafe', 'sust', 'kōhī', 'コーヒーを おねがいします。', 'Un cafe, por favor.'],
      ['ワイン', 'el vino', 'sust', 'wain'],
      ['にく', 'la carne', 'sust', 'niku', 'にくを たべません。', 'No como carne.'],
      ['さかな', 'el pescado / el pez', 'sust', 'sakana'],
      ['たべる', 'comer', 'verbo', 'taberu', 'くだものを たべます。', 'Como fruta.'],
      ['のむ', 'beber', 'verbo', 'nomu', 'みずを のみます。', 'Bebo agua.'],
      ['あさごはん', 'el desayuno', 'sust', 'asagohan'],
      ['おかいけい', 'la cuenta', 'sust', 'o-kaikei', 'おかいけい おねがいします。', 'La cuenta, por favor.'],
    ],
    casa: [
      ['いえ', 'la casa', 'sust', 'ie', 'ちいさい いえに すんで います。', 'Vivo en una casa pequena.'],
      ['へや', 'la habitacion', 'sust', 'heya'],
      ['だいどころ', 'la cocina', 'sust', 'daidokoro'],
      ['おふろ', 'el bano', 'sust', 'o-furo'],
      ['ドア', 'la puerta', 'sust', 'doa', 'ドアを しめて ください。', 'Cierra la puerta, por favor.'],
      ['まど', 'la ventana', 'sust', 'mado'],
      ['テーブル', 'la mesa', 'sust', 'tēburu'],
      ['いす', 'la silla', 'sust', 'isu'],
      ['ベッド', 'la cama', 'sust', 'beddo'],
      ['かぎ', 'la llave', 'sust', 'kagi', 'かぎを なくしました。', 'He perdido la llave.'],
      ['にわ', 'el jardin', 'sust', 'niwa'],
    ],
    verbos1: [
      ['です', 'ser (copula)', 'verbo', 'desu', 'がくせい です。', 'Soy estudiante.'],
      ['ある', 'haber / estar (cosas)', 'verbo', 'aru', 'つくえの うえに ほんが あります。', 'Hay un libro sobre la mesa.'],
      ['いる', 'estar (seres vivos)', 'verbo', 'iru', 'ねこが います。', 'Hay un gato.'],
      ['いく', 'ir', 'verbo', 'iku', 'かいしゃに いきます。', 'Voy a la oficina.'],
      ['くる', 'venir', 'verbo', 'kuru', 'ここに きて ください。', 'Ven aqui, por favor.'],
      ['する', 'hacer', 'verbo', 'suru', 'なにを して いますか。', 'Que estas haciendo?'],
      ['みる', 'ver / mirar', 'verbo', 'miru', 'うみを みます。', 'Veo el mar.'],
      ['はなす', 'hablar', 'verbo', 'hanasu', 'にほんごを すこし はなします。', 'Hablo un poco de japones.'],
      ['とる', 'tomar / coger', 'verbo', 'toru', 'でんしゃに のります。', 'Cojo el tren.'],
      ['いう', 'decir', 'verbo', 'iu', 'なんと いいましたか。', 'Que has dicho?'],
      ['わかる', 'entender', 'verbo', 'wakaru', 'わかりません。', 'No entiendo.'],
      ['しる', 'saber / conocer', 'verbo', 'shiru', 'しりません。', 'No lo se.'],
    ],
    ciudad: [
      ['まち', 'la ciudad / el pueblo', 'sust', 'machi', 'とうきょうは おおきい まち です。', 'Tokio es una ciudad grande.'],
      ['みち', 'la calle / el camino', 'sust', 'michi'],
      ['えき', 'la estacion', 'sust', 'eki', 'えきは とおい ですか。', 'La estacion esta lejos?'],
      ['びょういん', 'el hospital', 'sust', 'byōin'],
      ['ぎんこう', 'el banco', 'sust', 'ginkō'],
      ['ひだり', 'izquierda', 'sust', 'hidari', 'ひだりに まがって ください。', 'Gire a la izquierda.'],
      ['みぎ', 'derecha', 'sust', 'migi', 'みぎに あります。', 'Esta a la derecha.'],
      ['まっすぐ', 'recto', 'adv', 'massugu', 'まっすぐ いって ください。', 'Vaya todo recto.'],
      ['ちかい', 'cerca', 'adj', 'chikai', 'とても ちかい です。', 'Esta muy cerca.'],
      ['とおい', 'lejos', 'adj', 'tōi', 'ここから とおい ですか。', 'Esta lejos de aqui?'],
      ['どこ', 'donde', 'adv', 'doko', 'でぐちは どこ ですか。', 'Donde esta la salida?'],
      ['ちず', 'el mapa', 'sust', 'chizu'],
    ],
    compras: [
      ['みせ', 'la tienda', 'sust', 'mise', 'みせは あいて います。', 'La tienda esta abierta.'],
      ['いちば', 'el mercado', 'sust', 'ichiba'],
      ['おかね', 'el dinero', 'sust', 'o-kane', 'おかねが ありません。', 'No tengo dinero.'],
      ['ねだん', 'el precio', 'sust', 'nedan', 'ねだんは いくら ですか。', 'Cual es el precio?'],
      ['たかい', 'caro / alto', 'adj', 'takai', 'たかすぎます。', 'Es demasiado caro.'],
      ['やすい', 'barato', 'adj', 'yasui'],
      ['かう', 'comprar', 'verbo', 'kau', 'この ほんを かいたい です。', 'Quiero comprar este libro.'],
      ['はらう', 'pagar', 'verbo', 'harau', 'カードで はらえますか。', 'Puedo pagar con tarjeta?'],
      ['いくら', 'cuanto', 'adv', 'ikura', 'これは いくら ですか。', 'Cuanto cuesta esto?'],
      ['むりょう', 'gratis', 'sust', 'muryō'],
      ['あいている', 'abierto', 'adj', 'aite iru'],
      ['しまっている', 'cerrado', 'adj', 'shimatte iru'],
    ],
    trabajo: [
      ['しごと', 'el trabajo', 'sust', 'shigoto', 'しごとが すき です。', 'Me gusta mi trabajo.'],
      ['かいしゃ', 'la empresa / oficina', 'sust', 'kaisha'],
      ['がっこう', 'la escuela', 'sust', 'gakkō'],
      ['じょうし', 'el jefe', 'sust', 'jōshi'],
      ['どうりょう', 'el colega', 'sust', 'dōryō'],
      ['パソコン', 'el ordenador', 'sust', 'pasokon'],
      ['かいぎ', 'la reunion', 'sust', 'kaigi', 'じゅうじに かいぎが あります。', 'Tengo una reunion a las diez.'],
      ['はたらく', 'trabajar', 'verbo', 'hataraku', 'ぎんこうで はたらいて います。', 'Trabajo en un banco.'],
      ['べんきょうする', 'estudiar', 'verbo', 'benkyō suru', 'にほんごを べんきょうします。', 'Estudio japones.'],
      ['ならう', 'aprender', 'verbo', 'narau', 'フランスごを ならって います。', 'Aprendo frances.'],
      ['しょくぎょう', 'la profesion', 'sust', 'shokugyō'],
      ['いそがしい', 'ocupado', 'adj', 'isogashii'],
    ],
    viajes: [
      ['りょこう', 'el viaje', 'sust', 'ryokō', 'よい ごりょこうを。', 'Buen viaje.'],
      ['くうこう', 'el aeropuerto', 'sust', 'kūkō'],
      ['ひこうき', 'el avion', 'sust', 'hikōki', 'ひこうきは じゅうにじに でます。', 'El avion sale a las doce.'],
      ['でんしゃ', 'el tren', 'sust', 'densha'],
      ['くるま', 'el coche', 'sust', 'kuruma'],
      ['きっぷ', 'el billete', 'sust', 'kippu', 'おうふくの きっぷを ください。', 'Un billete de ida y vuelta, por favor.'],
      ['ホテル', 'el hotel', 'sust', 'hoteru'],
      ['スーツケース', 'la maleta', 'sust', 'sūtsukēsu'],
      ['パスポート', 'el pasaporte', 'sust', 'pasupōto'],
      ['でる', 'salir', 'verbo', 'deru', 'でんしゃは じゅうにじに でます。', 'El tren sale a las doce.'],
      ['つく', 'llegar', 'verbo', 'tsuku', 'あした つきます。', 'Llegamos manana.'],
      ['よやくする', 'reservar', 'verbo', 'yoyaku suru', 'へやを よやくしたい です。', 'Quiero reservar una habitacion.'],
    ],
    salud: [
      ['けんこう', 'la salud', 'sust', 'kenkō'],
      ['からだ', 'el cuerpo', 'sust', 'karada'],
      ['あたま', 'la cabeza', 'sust', 'atama', 'あたまが いたい です。', 'Me duele la cabeza.'],
      ['て', 'la mano', 'sust', 'te'],
      ['あし', 'el pie / la pierna', 'sust', 'ashi'],
      ['いしゃ', 'el medico', 'sust', 'isha', 'いしゃに いかなければ なりません。', 'Tengo que ir al medico.'],
      ['びょうき', 'la enfermedad', 'sust', 'byōki', 'びょうき です。', 'Estoy enfermo.'],
      ['やっきょく', 'la farmacia', 'sust', 'yakkyoku'],
      ['くすり', 'la medicina', 'sust', 'kusuri'],
      ['かんじる', 'sentir', 'verbo', 'kanjiru', 'げんきに なりました。', 'Me siento mejor.'],
      ['いたい', 'doloroso', 'adj', 'itai'],
      ['つかれた', 'cansado', 'adj', 'tsukareta'],
    ],
    tiempo_libre: [
      ['てんき', 'el tiempo (clima)', 'sust', 'tenki', 'きょうの てんきは どう ですか。', 'Que tiempo hace hoy?'],
      ['たいよう', 'el sol', 'sust', 'taiyō', 'はれて います。', 'Hace sol.'],
      ['あめ', 'la lluvia', 'sust', 'ame', 'あめが ふって います。', 'Esta lloviendo.'],
      ['かぜ', 'el viento', 'sust', 'kaze'],
      ['ゆき', 'la nieve', 'sust', 'yuki'],
      ['き', 'el arbol', 'sust', 'ki'],
      ['うみ', 'el mar', 'sust', 'umi', 'うみに いきます。', 'Vamos al mar.'],
      ['やま', 'la montana', 'sust', 'yama'],
      ['いぬ', 'el perro', 'sust', 'inu'],
      ['ねこ', 'el gato', 'sust', 'neko'],
      ['おんがく', 'la musica', 'sust', 'ongaku', 'おんがくを ききます。', 'Escucho musica.'],
      ['あそぶ', 'jugar', 'verbo', 'asobu', 'サッカーを します。', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'ja-kana', title: 'Los tres sistemas de escritura', cefr: 'A1', body:
`El japones combina:
- **hiragana** (ひらがな): silabario para gramatica y palabras japonesas.
- **katakana** (カタカナ): silabario para prestamos extranjeros (コーヒー = kōhī, cafe).
- **kanji** (漢字): ideogramas de origen chino para raices de palabras.
Empieza dominando hiragana; el resto llega con la practica.` },
    { skill: 'verbos1', slug: 'ja-particulas', title: 'Las particulas は, を, に', cefr: 'A1', body:
`Cada elemento de la frase lleva una particula que marca su funcion:
- **は** (wa): el tema -> "わたし**は** アナ です".
- **を** (o): el complemento directo -> "みず**を** のみます".
- **に**: destino, hora, lugar -> "がっこう**に** いきます", "７じ**に**".
El verbo va SIEMPRE al final.` },
    { skill: 'trabajo', slug: 'ja-desu-masu', title: 'Cortesia: です y ます', cefr: 'A1', body:
`El estilo educado (para desconocidos, trabajo) usa:
- **です** tras sustantivos y adjetivos: "がくせい です", "たかい です".
- **〜ます** en los verbos: たべ**ます**, いき**ます**, し**ます**.
Negativo: では ありません / 〜ません. Pasado: でした / 〜ました.` },
  ],
  readings: [
    { skill: 'saludos', title: 'あたらしい どうりょう', cefr: 'A1', body:
`「こんにちは。ここは はじめて ですか。」
「はい。わたしは たなか です。マーケティングで はたらいて います。」
「はじめまして、たなかさん。わたしは さとう です。コーヒーは いかが ですか。」
「はい、おねがいします。だいどころは どこ ですか。」
「あそこ、みぎ です。かいぎは じゅうじに はじまります。」
「ありがとうございます。またあとで。」`,
      translation:
`"Hola. Es tu primera vez aqui?"
"Si. Yo soy Tanaka. Trabajo en marketing."
"Encantado, Tanaka. Yo soy Sato. Quieres un cafe?"
"Si, por favor. Donde esta la cocina?"
"Alli, a la derecha. La reunion empieza a las diez."
"Muchas gracias. Hasta luego."`,
      questions: [
        { q: 'Donde trabaja Tanaka?', options: ['En marketing', 'En ventas', 'En contabilidad'], answer: 0 },
        { q: 'Donde esta la cocina?', options: ['A la derecha', 'A la izquierda', 'Arriba'], answer: 0 },
        { q: 'A que hora empieza la reunion?', options: ['A las diez', 'A las nueve', 'A las once'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'comida', title: 'カフェで', scenario: 'Pides algo en una cafeteria en Tokio.', lines: [
      { speaker: 'てんいん', target: 'いらっしゃいませ。ごちゅうもんは。', source: 'Bienvenido. Que va a pedir?' },
      { speaker: 'きゃく', target: 'コーヒーを おねがいします。', source: 'Un cafe, por favor.' },
      { speaker: 'てんいん', target: 'ほかには。', source: 'Algo mas?' },
      { speaker: 'きゃく', target: 'いいえ、けっこうです。いくら ですか。', source: 'No, gracias. Cuanto es?' },
      { speaker: 'てんいん', target: 'よんひゃくえん です。', source: 'Cuatrocientos yenes.' },
      { speaker: 'きゃく', target: 'ありがとうございます。', source: 'Muchas gracias.' },
    ] },
  ],
};
