// Ruso - contenido A1/A2 (lemma en cirilico + transliteracion)
export default {
  code: 'ru',
  vocab: {
    saludos: [
      ['привет', 'hola (informal)', 'interj', 'privét', 'Привет, как дела?', 'Hola, que tal?'],
      ['здравствуйте', 'hola / buenos dias (formal)', 'interj', 'zdrávstvuyte', 'Здравствуйте, рад вас видеть.', 'Buenos dias, me alegro de verle.'],
      ['добрый вечер', 'buenas tardes / noches', 'expr', 'dóbryy vécher', 'Добрый вечер, добро пожаловать.', 'Buenas noches, bienvenido.'],
      ['до свидания', 'adios', 'expr', 'do svidániya', 'До свидания, до завтра.', 'Adios, hasta manana.'],
      ['спасибо', 'gracias', 'interj', 'spasíbo', 'Большое спасибо.', 'Muchas gracias.'],
      ['пожалуйста', 'por favor / de nada', 'interj', 'pozháluysta', 'Кофе, пожалуйста.', 'Un cafe, por favor.'],
      ['извините', 'perdon / disculpe', 'verbo', 'izviníte', 'Извините, я опоздал.', 'Perdon, llego tarde.'],
      ['да', 'si', 'adv', 'da', 'Да, я понимаю.', 'Si, entiendo.'],
      ['нет', 'no', 'adv', 'net', 'Нет, спасибо.', 'No, gracias.'],
      ['меня зовут', 'me llamo', 'expr', 'menyá zovút', 'Меня зовут Анна.', 'Me llamo Anna.'],
      ['очень приятно', 'encantado', 'expr', 'óchen priyátno', 'Очень приятно познакомиться.', 'Encantado de conocerte.'],
      ['как дела', 'que tal', 'expr', 'kak delá', 'Привет! Как дела?', 'Hola! Que tal?'],
    ],
    numeros: [
      ['один', 'uno', 'num', 'odín'], ['два', 'dos', 'num', 'dva'], ['три', 'tres', 'num', 'tri'],
      ['четыре', 'cuatro', 'num', 'chetýre'], ['пять', 'cinco', 'num', 'pyat'], ['десять', 'diez', 'num', 'désyat'],
      ['двадцать', 'veinte', 'num', 'dvátsat'], ['сто', 'cien', 'num', 'sto'],
      ['час', 'la hora', 'sust', 'chas', 'Сколько сейчас времени?', 'Que hora es?', 'm'],
      ['сегодня', 'hoy', 'adv', 'sevódnya', 'Сегодня понедельник.', 'Hoy es lunes.'],
      ['завтра', 'manana', 'adv', 'záftra', 'До завтра!', 'Hasta manana!'],
      ['вчера', 'ayer', 'adv', 'vcherá', 'Вчера шёл дождь.', 'Ayer llovio.'],
      ['неделя', 'la semana', 'sust', 'nedélya', 'на следующей неделе', 'la proxima semana', 'f'],
      ['день', 'el dia', 'sust', 'den', 'Хорошего дня!', 'Buen dia!', 'm'],
    ],
    personas: [
      ['семья', 'la familia', 'sust', 'semyá', 'Моя семья большая.', 'Mi familia es grande.', 'f'],
      ['мать', 'la madre', 'sust', 'mat', '', '', 'f'],
      ['отец', 'el padre', 'sust', 'otéts', '', '', 'm'],
      ['брат', 'el hermano', 'sust', 'brat', 'У меня есть брат.', 'Tengo un hermano.', 'm'],
      ['сестра', 'la hermana', 'sust', 'sestrá', '', '', 'f'],
      ['ребёнок', 'el nino / la nina', 'sust', 'rebyónok', 'Дети играют.', 'Los ninos juegan.', 'm'],
      ['друг', 'el amigo', 'sust', 'druk', 'Он мой лучший друг.', 'Es mi mejor amigo.', 'm'],
      ['женщина', 'la mujer', 'sust', 'zhénshchina', '', '', 'f'],
      ['мужчина', 'el hombre', 'sust', 'mushchína', '', '', 'm'],
      ['имя', 'el nombre', 'sust', 'ímya', 'Как вас зовут?', 'Como se llama?', 'n'],
      ['молодой', 'joven', 'adj', 'molodóy'],
      ['старый', 'viejo', 'adj', 'stáryy'],
    ],
    comida: [
      ['вода', 'el agua', 'sust', 'vodá', 'Я бы хотел воду.', 'Quisiera agua.', 'f'],
      ['хлеб', 'el pan', 'sust', 'khlep', 'Хлеб свежий.', 'El pan esta fresco.', 'm'],
      ['сыр', 'el queso', 'sust', 'syr', '', '', 'm'],
      ['яблоко', 'la manzana', 'sust', 'yábloko', '', '', 'n'],
      ['кофе', 'el cafe', 'sust', 'kófe', 'Кофе с молоком, пожалуйста.', 'Un cafe con leche, por favor.', 'm'],
      ['вино', 'el vino', 'sust', 'vinó', '', '', 'n'],
      ['мясо', 'la carne', 'sust', 'myáso', 'Я не ем мясо.', 'No como carne.', 'n'],
      ['рыба', 'el pescado / el pez', 'sust', 'rýba', '', '', 'f'],
      ['есть', 'comer', 'verbo', 'yest', 'Я люблю есть фрукты.', 'Me gusta comer fruta.'],
      ['пить', 'beber', 'verbo', 'pit', 'Надо пить воду.', 'Hay que beber agua.'],
      ['завтрак', 'el desayuno', 'sust', 'záftrak', '', '', 'm'],
      ['счёт', 'la cuenta', 'sust', 'schyot', 'Счёт, пожалуйста.', 'La cuenta, por favor.', 'm'],
    ],
    casa: [
      ['дом', 'la casa', 'sust', 'dom', 'Я живу в маленьком доме.', 'Vivo en una casa pequena.', 'm'],
      ['комната', 'la habitacion', 'sust', 'kómnata', '', '', 'f'],
      ['кухня', 'la cocina', 'sust', 'kúkhnya', '', '', 'f'],
      ['ванная', 'el bano', 'sust', 'vánnaya', '', '', 'f'],
      ['дверь', 'la puerta', 'sust', 'dver', 'Закрой дверь, пожалуйста.', 'Cierra la puerta, por favor.', 'f'],
      ['окно', 'la ventana', 'sust', 'oknó', '', '', 'n'],
      ['стол', 'la mesa', 'sust', 'stol', '', '', 'm'],
      ['стул', 'la silla', 'sust', 'stul', '', '', 'm'],
      ['кровать', 'la cama', 'sust', 'krovát', '', '', 'f'],
      ['ключ', 'la llave', 'sust', 'klyuch', 'Я потерял ключи.', 'He perdido las llaves.', 'm'],
      ['сад', 'el jardin', 'sust', 'sat', '', '', 'm'],
    ],
    verbos1: [
      ['быть', 'ser / estar', 'verbo', 'byt', 'Я хочу быть здесь.', 'Quiero estar aqui.'],
      ['у меня есть', 'tengo (tener)', 'expr', 'u menyá yest', 'У меня есть двое детей.', 'Tengo dos hijos.'],
      ['идти', 'ir (a pie)', 'verbo', 'idtí', 'Я иду на работу.', 'Voy al trabajo.'],
      ['делать', 'hacer', 'verbo', 'délat', 'Что ты делаешь?', 'Que haces?'],
      ['хотеть', 'querer', 'verbo', 'khotét', 'Я хочу учить русский.', 'Quiero aprender ruso.'],
      ['мочь', 'poder', 'verbo', 'moch', 'Ты можешь мне помочь?', 'Puedes ayudarme?'],
      ['знать', 'saber / conocer', 'verbo', 'znat', 'Я не знаю.', 'No lo se.'],
      ['приходить', 'venir', 'verbo', 'prikhodít', 'Иди сюда!', 'Ven aqui!'],
      ['видеть', 'ver', 'verbo', 'vídet', 'Я вижу море.', 'Veo el mar.'],
      ['говорить', 'hablar / decir', 'verbo', 'govorít', 'Я немного говорю по-русски.', 'Hablo un poco de ruso.'],
      ['брать', 'tomar / coger', 'verbo', 'brat', 'Я беру автобус.', 'Cojo el autobus.'],
      ['сказать', 'decir', 'verbo', 'skazát', 'Что ты сказал?', 'Que has dicho?'],
    ],
    ciudad: [
      ['город', 'la ciudad', 'sust', 'górod', 'Москва — большой город.', 'Moscu es una ciudad grande.', 'm'],
      ['улица', 'la calle', 'sust', 'úlitsa', '', '', 'f'],
      ['вокзал', 'la estacion de tren', 'sust', 'vokzál', 'Вокзал далеко?', 'La estacion esta lejos?', 'm'],
      ['больница', 'el hospital', 'sust', 'bolnítsa', '', '', 'f'],
      ['банк', 'el banco', 'sust', 'bank', '', '', 'm'],
      ['налево', 'a la izquierda', 'adv', 'nalévo', 'Поверните налево.', 'Gire a la izquierda.'],
      ['направо', 'a la derecha', 'adv', 'naprávo', 'Это направо.', 'Esta a la derecha.'],
      ['прямо', 'todo recto', 'adv', 'pryámo', 'Идите прямо.', 'Vaya todo recto.'],
      ['близко', 'cerca', 'adv', 'blízko', 'Это очень близко.', 'Esta muy cerca.'],
      ['далеко', 'lejos', 'adv', 'dalekó', 'Это далеко отсюда?', 'Esta lejos de aqui?'],
      ['где', 'donde', 'adv', 'gde', 'Где выход?', 'Donde esta la salida?'],
      ['карта', 'el mapa', 'sust', 'kárta', '', '', 'f'],
    ],
    compras: [
      ['магазин', 'la tienda', 'sust', 'magazín', 'Магазин открыт.', 'La tienda esta abierta.', 'm'],
      ['рынок', 'el mercado', 'sust', 'rýnok', '', '', 'm'],
      ['деньги', 'el dinero', 'sust', 'déngi', 'У меня нет денег.', 'No tengo dinero.'],
      ['цена', 'el precio', 'sust', 'tsená', 'Какая цена?', 'Cual es el precio?', 'f'],
      ['дорогой', 'caro', 'adj', 'dorogóy', 'Это слишком дорого.', 'Es demasiado caro.'],
      ['дешёвый', 'barato', 'adj', 'deshyóvyy'],
      ['покупать', 'comprar', 'verbo', 'pokupát', 'Я хочу купить эту книгу.', 'Quiero comprar este libro.'],
      ['платить', 'pagar', 'verbo', 'platít', 'Можно заплатить картой?', 'Puedo pagar con tarjeta?'],
      ['сколько', 'cuanto', 'adv', 'skólko', 'Сколько это стоит?', 'Cuanto cuesta?'],
      ['бесплатно', 'gratis', 'adv', 'besplátno'],
      ['открыто', 'abierto', 'adj', 'otkrýto'],
      ['закрыто', 'cerrado', 'adj', 'zakrýto'],
    ],
    trabajo: [
      ['работа', 'el trabajo', 'sust', 'rabóta', 'Мне нравится моя работа.', 'Me gusta mi trabajo.', 'f'],
      ['офис', 'la oficina', 'sust', 'ófis', '', '', 'm'],
      ['школа', 'la escuela', 'sust', 'shkóla', '', '', 'f'],
      ['начальник', 'el jefe', 'sust', 'nachálnik', '', '', 'm'],
      ['коллега', 'el companero de trabajo', 'sust', 'kolléga', '', '', 'm'],
      ['компьютер', 'el ordenador', 'sust', 'kompyúter', '', '', 'm'],
      ['встреча', 'la reunion', 'sust', 'vstrécha', 'У меня встреча в десять.', 'Tengo una reunion a las diez.', 'f'],
      ['работать', 'trabajar', 'verbo', 'rabótat', 'Я работаю в банке.', 'Trabajo en un banco.'],
      ['учиться', 'estudiar', 'verbo', 'uchítsya', 'Я учусь на юриста.', 'Estudio derecho.'],
      ['изучать', 'aprender / estudiar (algo)', 'verbo', 'izuchát', 'Я изучаю французский.', 'Aprendo frances.'],
      ['профессия', 'la profesion', 'sust', 'proféssiya', '', '', 'f'],
      ['занят', 'ocupado', 'adj', 'zányat'],
    ],
    viajes: [
      ['путешествие', 'el viaje', 'sust', 'puteshéstviye', 'Счастливого пути!', 'Buen viaje!', 'n'],
      ['аэропорт', 'el aeropuerto', 'sust', 'aeropórt', '', '', 'm'],
      ['самолёт', 'el avion', 'sust', 'samolyót', 'Самолёт вылетает в двенадцать.', 'El avion sale a las doce.', 'm'],
      ['поезд', 'el tren', 'sust', 'póyezd', '', '', 'm'],
      ['машина', 'el coche', 'sust', 'mashína', '', '', 'f'],
      ['билет', 'el billete', 'sust', 'bilét', 'Билет туда и обратно, пожалуйста.', 'Un billete de ida y vuelta, por favor.', 'm'],
      ['гостиница', 'el hotel', 'sust', 'gostínitsa', '', '', 'f'],
      ['чемодан', 'la maleta', 'sust', 'chemodán', '', '', 'm'],
      ['паспорт', 'el pasaporte', 'sust', 'pásport', '', '', 'm'],
      ['уезжать', 'irse / marcharse', 'verbo', 'uyezzhát', 'Поезд уходит в двенадцать.', 'El tren sale a las doce.'],
      ['приезжать', 'llegar', 'verbo', 'priyezzhát', 'Мы приезжаем завтра.', 'Llegamos manana.'],
      ['забронировать', 'reservar', 'verbo', 'zabronírovat', 'Я хочу забронировать номер.', 'Quiero reservar una habitacion.'],
    ],
    salud: [
      ['здоровье', 'la salud', 'sust', 'zdoróvye', 'За здоровье!', 'A la salud!', 'n'],
      ['тело', 'el cuerpo', 'sust', 'télo', '', '', 'n'],
      ['голова', 'la cabeza', 'sust', 'golová', 'У меня болит голова.', 'Me duele la cabeza.', 'f'],
      ['рука', 'la mano / el brazo', 'sust', 'ruká', '', '', 'f'],
      ['нога', 'la pierna / el pie', 'sust', 'nogá', '', '', 'f'],
      ['врач', 'el medico', 'sust', 'vrach', 'Мне нужно к врачу.', 'Tengo que ir al medico.', 'm'],
      ['больной', 'enfermo', 'adj', 'bolnóy', 'Я болен.', 'Estoy enfermo.'],
      ['аптека', 'la farmacia', 'sust', 'aptéka', '', '', 'f'],
      ['лекарство', 'el medicamento', 'sust', 'lekárstvo', '', '', 'n'],
      ['чувствовать себя', 'sentirse', 'verbo', 'chúvstvovat sebyá', 'Я чувствую себя лучше.', 'Me siento mejor.'],
      ['боль', 'el dolor', 'sust', 'bol', '', '', 'f'],
      ['усталый', 'cansado', 'adj', 'ustályy'],
    ],
    tiempo_libre: [
      ['погода', 'el tiempo (clima)', 'sust', 'pogóda', 'Какая погода?', 'Que tiempo hace?', 'f'],
      ['солнце', 'el sol', 'sust', 'sóntse', 'Светит солнце.', 'Hace sol.', 'n'],
      ['дождь', 'la lluvia', 'sust', 'dozhd', 'Идёт дождь.', 'Llueve.', 'm'],
      ['ветер', 'el viento', 'sust', 'véter', '', '', 'm'],
      ['снег', 'la nieve', 'sust', 'sneg', '', '', 'm'],
      ['дерево', 'el arbol', 'sust', 'dérevo', '', '', 'n'],
      ['море', 'el mar', 'sust', 'móre', 'Мы едем на море.', 'Vamos al mar.', 'n'],
      ['гора', 'la montana', 'sust', 'gorá', '', '', 'f'],
      ['собака', 'el perro', 'sust', 'sobáka', '', '', 'f'],
      ['кошка', 'el gato', 'sust', 'kóshka', '', '', 'f'],
      ['музыка', 'la musica', 'sust', 'múzyka', 'Я слушаю музыку.', 'Escucho musica.', 'f'],
      ['играть', 'jugar / tocar', 'verbo', 'igrát', 'Я играю в футбол.', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'ru-alfavit', title: 'El alfabeto cirilico', cefr: 'A1', body:
`33 letras. Algunas engananan al ojo latino:
- **В** = v | **Н** = n | **Р** = r | **С** = s | **У** = u | **Х** = j espanola
- **Б** = b | **Г** = g | **Д** = d | **З** = z | **И** = i | **П** = p | **Ф** = f
- **Ж** = "y" francesa | **Ш** = sh | **Щ** = sh larga | **Ч** = ch | **Ц** = ts
- **Я** = ya | **Е** = ye | **Ё** = yo | **Ю** = yu | **Й** = i corta
Las vocales atonas se reducen: "о" atona suena como "a".` },
    { skill: 'verbos1', slug: 'ru-byt', title: 'El presente de "ser" no se dice', cefr: 'A1', body:
`En presente, el ruso **omite el verbo "ser/estar"** (быть):
- "Я студент." = (Yo) soy estudiante.
- "Это кофе." = Esto es cafe.
Tampoco hay articulos. El verbo быть si aparece en pasado (был/была) y futuro (буду).` },
    { skill: 'trabajo', slug: 'ru-padezhi', title: 'Los casos (introduccion)', cefr: 'A2', body:
`El ruso tiene **6 casos**. Los primeros que necesitas:
- **Именительный** (nominativo): el sujeto -> "Это книга".
- **Винительный** (acusativo): el complemento directo -> "Я читаю книг**у**".
- **Предложный** (prepositivo): tras в/на (lugar) -> "в Москв**е**".
Las terminaciones cambian segun el genero. Se aprenden por patrones de uso.` },
  ],
  readings: [
    { skill: 'saludos', title: 'Новый коллега', cefr: 'A1', body:
`— Привет, ты здесь новенький?
— Да, меня зовут Иван. Я работаю в отделе маркетинга.
— Очень приятно, Иван. Я Мария. Хочешь кофе?
— Да, спасибо. Где кухня?
— Там, направо. Встреча начинается в десять.
— Отлично, спасибо. До скорого!`,
      translation:
`— Hola, eres nuevo aqui?
— Si, me llamo Ivan. Trabajo en el departamento de marketing.
— Encantada, Ivan. Yo soy Maria. Quieres cafe?
— Si, gracias. Donde esta la cocina?
— Alli, a la derecha. La reunion empieza a las diez.
— Genial, gracias. Hasta pronto!`,
      questions: [
        { q: 'В каком отделе работает Иван?', options: ['Маркетинг', 'Продажи', 'Бухгалтерия'], answer: 0 },
        { q: 'Где кухня?', options: ['Направо', 'Налево', 'Наверху'], answer: 0 },
        { q: 'Во сколько начинается встреча?', options: ['В десять', 'В девять', 'В одиннадцать'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'comida', title: 'В кафе', scenario: 'Pides algo en un cafe de San Petersburgo.', lines: [
      { speaker: 'Официант', target: 'Здравствуйте! Что будете заказывать?', source: 'Buenos dias! Que va a pedir?' },
      { speaker: 'Гость', target: 'Кофе и бутерброд, пожалуйста.', source: 'Un cafe y un sandwich, por favor.' },
      { speaker: 'Официант', target: 'Что-нибудь ещё?', source: 'Algo mas?' },
      { speaker: 'Гость', target: 'Нет, спасибо. Сколько с меня?', source: 'No, gracias. Cuanto es?' },
      { speaker: 'Официант', target: 'Триста пятьдесят рублей.', source: 'Trescientos cincuenta rublos.' },
      { speaker: 'Гость', target: 'Вот, пожалуйста. Спасибо!', source: 'Aqui tiene. Gracias!' },
    ] },
  ],
};
