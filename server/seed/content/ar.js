// Arabe (estandar moderno) - contenido A1. Escritura de derecha a izquierda.
// lemma en arabe + transliteracion en 'reading'.
export default {
  code: 'ar',
  vocab: {
    saludos: [
      ['مرحبا', 'hola', 'interj', 'marhaban', 'مرحبا، كيف حالك؟', 'Hola, como estas?'],
      ['صباح الخير', 'buenos dias', 'expr', 'sabah al-khayr', 'صباح الخير.', 'Buenos dias.'],
      ['مساء الخير', 'buenas tardes', 'expr', 'masa al-khayr', 'مساء الخير.', 'Buenas tardes.'],
      ['مع السلامة', 'adios', 'expr', 'maa as-salama', 'مع السلامة، إلى اللقاء.', 'Adios, hasta la vista.'],
      ['شكرا', 'gracias', 'interj', 'shukran', 'شكرا جزيلا.', 'Muchas gracias.'],
      ['من فضلك', 'por favor', 'expr', 'min fadlik', 'قهوة من فضلك.', 'Un cafe, por favor.'],
      ['آسف', 'perdon / lo siento', 'adj', 'aasif', 'آسف، تأخرت.', 'Perdon, llego tarde.'],
      ['نعم', 'si', 'adv', 'naam', 'نعم، أفهم.', 'Si, entiendo.'],
      ['لا', 'no', 'adv', 'la', 'لا، شكرا.', 'No, gracias.'],
      ['اسمي', 'mi nombre es', 'expr', 'ismi', 'اسمي آنا.', 'Me llamo Ana.'],
      ['تشرفنا', 'encantado', 'expr', 'tasharrafna', 'تشرفنا بلقائك.', 'Encantado de conocerte.'],
      ['كيف حالك', 'como estas', 'expr', 'kayfa haluk', 'مرحبا، كيف حالك اليوم؟', 'Hola, como estas hoy?'],
    ],
    numeros: [
      ['واحد', 'uno', 'num', 'wahid'], ['اثنان', 'dos', 'num', 'ithnan'], ['ثلاثة', 'tres', 'num', 'thalatha'],
      ['أربعة', 'cuatro', 'num', 'arbaa'], ['خمسة', 'cinco', 'num', 'khamsa'], ['عشرة', 'diez', 'num', 'ashara'],
      ['عشرون', 'veinte', 'num', 'ishrun'], ['مئة', 'cien', 'num', 'mia'],
      ['الوقت', 'el tiempo', 'sust', 'al-waqt', 'كم الساعة؟', 'Que hora es?', 'm'],
      ['اليوم', 'hoy', 'adv', 'al-yawm', 'اليوم هو الإثنين.', 'Hoy es lunes.'],
      ['غدا', 'manana', 'adv', 'ghadan', 'إلى الغد!', 'Hasta manana!'],
      ['أمس', 'ayer', 'adv', 'ams', 'أمس أمطرت.', 'Ayer llovio.'],
      ['الأسبوع', 'la semana', 'sust', 'al-usbu', 'الأسبوع القادم', 'la proxima semana', 'm'],
      ['يوم', 'el dia', 'sust', 'yawm', 'يوما سعيدا!', 'Buen dia!', 'm'],
    ],
    personas: [
      ['عائلة', 'la familia', 'sust', 'aaila', 'عائلتي كبيرة.', 'Mi familia es grande.', 'f'],
      ['أم', 'la madre', 'sust', 'umm', '', '', 'f'],
      ['أب', 'el padre', 'sust', 'ab', '', '', 'm'],
      ['أخ', 'el hermano', 'sust', 'akh', 'لدي أخ.', 'Tengo un hermano.', 'm'],
      ['أخت', 'la hermana', 'sust', 'ukht', '', '', 'f'],
      ['طفل', 'el nino', 'sust', 'tifl', 'الأطفال يلعبون.', 'Los ninos juegan.', 'm'],
      ['صديق', 'el amigo', 'sust', 'sadiq', 'هو أفضل صديق لي.', 'Es mi mejor amigo.', 'm'],
      ['امرأة', 'la mujer', 'sust', 'imraa', '', '', 'f'],
      ['رجل', 'el hombre', 'sust', 'rajul', '', '', 'm'],
      ['اسم', 'el nombre', 'sust', 'ism', 'ما اسمك؟', 'Como te llamas?', 'm'],
      ['شاب', 'joven', 'adj', 'shabb'],
      ['كبير', 'grande / mayor', 'adj', 'kabir'],
    ],
    comida: [
      ['ماء', 'el agua', 'sust', 'maa', 'أريد ماء من فضلك.', 'Quiero agua, por favor.', 'm'],
      ['خبز', 'el pan', 'sust', 'khubz', 'الخبز طازج.', 'El pan esta fresco.', 'm'],
      ['جبن', 'el queso', 'sust', 'jubn', '', '', 'm'],
      ['تفاحة', 'la manzana', 'sust', 'tuffaha', '', '', 'f'],
      ['قهوة', 'el cafe', 'sust', 'qahwa', 'قهوة بالحليب من فضلك.', 'Un cafe con leche, por favor.', 'f'],
      ['نبيذ', 'el vino', 'sust', 'nabidh', '', '', 'm'],
      ['لحم', 'la carne', 'sust', 'lahm', 'لا آكل اللحم.', 'No como carne.', 'm'],
      ['سمك', 'el pescado', 'sust', 'samak', '', '', 'm'],
      ['يأكل', 'comer', 'verbo', 'yakul', 'أحب أن آكل الفواكه.', 'Me gusta comer fruta.'],
      ['يشرب', 'beber', 'verbo', 'yashrab', 'يجب أن تشرب الماء.', 'Hay que beber agua.'],
      ['فطور', 'el desayuno', 'sust', 'futur', '', '', 'm'],
      ['الحساب', 'la cuenta', 'sust', 'al-hisab', 'الحساب من فضلك.', 'La cuenta, por favor.', 'm'],
    ],
    casa: [
      ['بيت', 'la casa', 'sust', 'bayt', 'أسكن في بيت صغير.', 'Vivo en una casa pequena.', 'm'],
      ['غرفة', 'la habitacion', 'sust', 'ghurfa', '', '', 'f'],
      ['مطبخ', 'la cocina', 'sust', 'matbakh', '', '', 'm'],
      ['حمام', 'el bano', 'sust', 'hammam', '', '', 'm'],
      ['باب', 'la puerta', 'sust', 'bab', 'أغلق الباب من فضلك.', 'Cierra la puerta, por favor.', 'm'],
      ['نافذة', 'la ventana', 'sust', 'nafidha', '', '', 'f'],
      ['طاولة', 'la mesa', 'sust', 'tawila', '', '', 'f'],
      ['كرسي', 'la silla', 'sust', 'kursi', '', '', 'm'],
      ['سرير', 'la cama', 'sust', 'sarir', '', '', 'm'],
      ['مفتاح', 'la llave', 'sust', 'miftah', 'فقدت مفاتيحي.', 'He perdido las llaves.', 'm'],
      ['حديقة', 'el jardin', 'sust', 'hadiqa', '', '', 'f'],
    ],
    verbos1: [
      ['يكون', 'ser / estar', 'verbo', 'yakun', 'أريد أن أكون هنا.', 'Quiero estar aqui.'],
      ['عندي', 'tengo (tener)', 'expr', 'indi', 'عندي طفلان.', 'Tengo dos hijos.'],
      ['يذهب', 'ir', 'verbo', 'yadhhab', 'أذهب إلى العمل.', 'Voy al trabajo.'],
      ['يفعل', 'hacer', 'verbo', 'yafal', 'ماذا تفعل؟', 'Que haces?'],
      ['يريد', 'querer', 'verbo', 'yurid', 'أريد أن أتعلم العربية.', 'Quiero aprender arabe.'],
      ['يستطيع', 'poder', 'verbo', 'yastati', 'هل تستطيع مساعدتي؟', 'Puedes ayudarme?'],
      ['يعرف', 'saber / conocer', 'verbo', 'yarif', 'لا أعرف.', 'No lo se.'],
      ['يأتي', 'venir', 'verbo', 'yati', 'تعال هنا!', 'Ven aqui!'],
      ['يرى', 'ver', 'verbo', 'yara', 'أرى البحر.', 'Veo el mar.'],
      ['يتكلم', 'hablar', 'verbo', 'yatakallam', 'أتكلم العربية قليلا.', 'Hablo un poco de arabe.'],
      ['يأخذ', 'tomar / coger', 'verbo', 'yakhudh', 'آخذ الحافلة.', 'Cojo el autobus.'],
      ['يقول', 'decir', 'verbo', 'yaqul', 'ماذا تقول؟', 'Que dices?'],
    ],
    ciudad: [
      ['مدينة', 'la ciudad', 'sust', 'madina', 'القاهرة مدينة كبيرة.', 'El Cairo es una ciudad grande.', 'f'],
      ['شارع', 'la calle', 'sust', 'shari', '', '', 'm'],
      ['محطة', 'la estacion', 'sust', 'mahatta', 'هل المحطة بعيدة؟', 'La estacion esta lejos?', 'f'],
      ['مستشفى', 'el hospital', 'sust', 'mustashfa', '', '', 'm'],
      ['بنك', 'el banco', 'sust', 'bank', '', '', 'm'],
      ['يسار', 'la izquierda', 'sust', 'yasar', 'اتجه إلى اليسار.', 'Gire a la izquierda.', 'm'],
      ['يمين', 'la derecha', 'sust', 'yamin', 'إنه على اليمين.', 'Esta a la derecha.', 'm'],
      ['مستقيم', 'recto', 'adj', 'mustaqim', 'سر مستقيما.', 'Vaya todo recto.'],
      ['قريب', 'cerca', 'adj', 'qarib', 'إنه قريب جدا.', 'Esta muy cerca.'],
      ['بعيد', 'lejos', 'adj', 'baid', 'هل هو بعيد من هنا؟', 'Esta lejos de aqui?'],
      ['أين', 'donde', 'adv', 'ayna', 'أين المخرج؟', 'Donde esta la salida?'],
      ['خريطة', 'el mapa', 'sust', 'kharita', '', '', 'f'],
    ],
    compras: [
      ['متجر', 'la tienda', 'sust', 'matjar', 'المتجر مفتوح.', 'La tienda esta abierta.', 'm'],
      ['سوق', 'el mercado', 'sust', 'suq', '', '', 'm'],
      ['نقود', 'el dinero', 'sust', 'nuqud', 'ليس لدي نقود.', 'No tengo dinero.', 'f'],
      ['سعر', 'el precio', 'sust', 'sir', 'ما هو السعر؟', 'Cual es el precio?', 'm'],
      ['غالي', 'caro', 'adj', 'ghali', 'إنه غالي جدا.', 'Es demasiado caro.'],
      ['رخيص', 'barato', 'adj', 'rakhis'],
      ['يشتري', 'comprar', 'verbo', 'yashtari', 'أريد أن أشتري هذا الكتاب.', 'Quiero comprar este libro.'],
      ['يدفع', 'pagar', 'verbo', 'yadfa', 'هل يمكنني الدفع بالبطاقة؟', 'Puedo pagar con tarjeta?'],
      ['كم', 'cuanto', 'adv', 'kam', 'كم يكلف هذا؟', 'Cuanto cuesta esto?'],
      ['مجاني', 'gratis', 'adj', 'majjani'],
      ['مفتوح', 'abierto', 'adj', 'maftuh'],
      ['مغلق', 'cerrado', 'adj', 'mughlaq'],
    ],
    trabajo: [
      ['عمل', 'el trabajo', 'sust', 'amal', 'أحب عملي.', 'Me gusta mi trabajo.', 'm'],
      ['مكتب', 'la oficina', 'sust', 'maktab', '', '', 'm'],
      ['مدرسة', 'la escuela', 'sust', 'madrasa', '', '', 'f'],
      ['مدير', 'el jefe', 'sust', 'mudir', '', '', 'm'],
      ['زميل', 'el colega', 'sust', 'zamil', '', '', 'm'],
      ['حاسوب', 'el ordenador', 'sust', 'hasub', '', '', 'm'],
      ['اجتماع', 'la reunion', 'sust', 'ijtima', 'لدي اجتماع في الساعة العاشرة.', 'Tengo una reunion a las diez.', 'm'],
      ['يعمل', 'trabajar', 'verbo', 'yamal', 'أعمل في بنك.', 'Trabajo en un banco.'],
      ['يدرس', 'estudiar', 'verbo', 'yadrus', 'أدرس القانون.', 'Estudio derecho.'],
      ['يتعلم', 'aprender', 'verbo', 'yataallam', 'أتعلم الفرنسية.', 'Aprendo frances.'],
      ['مهنة', 'la profesion', 'sust', 'mihna', '', '', 'f'],
      ['مشغول', 'ocupado', 'adj', 'mashghul'],
    ],
    viajes: [
      ['سفر', 'el viaje', 'sust', 'safar', 'رحلة سعيدة!', 'Buen viaje!', 'm'],
      ['مطار', 'el aeropuerto', 'sust', 'matar', '', '', 'm'],
      ['طائرة', 'el avion', 'sust', 'taira', 'الطائرة تغادر الساعة الثانية عشرة.', 'El avion sale a las doce.', 'f'],
      ['قطار', 'el tren', 'sust', 'qitar', '', '', 'm'],
      ['سيارة', 'el coche', 'sust', 'sayyara', '', '', 'f'],
      ['تذكرة', 'el billete', 'sust', 'tadhkara', 'تذكرة ذهاب وإياب من فضلك.', 'Un billete de ida y vuelta, por favor.', 'f'],
      ['فندق', 'el hotel', 'sust', 'funduq', '', '', 'm'],
      ['حقيبة', 'la maleta', 'sust', 'haqiba', '', '', 'f'],
      ['جواز سفر', 'el pasaporte', 'sust', 'jawaz safar', '', '', 'm'],
      ['يغادر', 'salir / partir', 'verbo', 'yughadir', 'القطار يغادر الساعة الثانية عشرة.', 'El tren sale a las doce.'],
      ['يصل', 'llegar', 'verbo', 'yasil', 'نصل غدا.', 'Llegamos manana.'],
      ['يحجز', 'reservar', 'verbo', 'yahjiz', 'أريد أن أحجز غرفة.', 'Quiero reservar una habitacion.'],
    ],
    salud: [
      ['صحة', 'la salud', 'sust', 'sihha', '', '', 'f'],
      ['جسم', 'el cuerpo', 'sust', 'jism', '', '', 'm'],
      ['رأس', 'la cabeza', 'sust', 'ras', 'رأسي يؤلمني.', 'Me duele la cabeza.', 'm'],
      ['يد', 'la mano', 'sust', 'yad', '', '', 'f'],
      ['قدم', 'el pie', 'sust', 'qadam', '', '', 'f'],
      ['طبيب', 'el medico', 'sust', 'tabib', 'يجب أن أذهب إلى الطبيب.', 'Tengo que ir al medico.', 'm'],
      ['مريض', 'enfermo', 'adj', 'marid', 'أنا مريض.', 'Estoy enfermo.'],
      ['صيدلية', 'la farmacia', 'sust', 'saydaliyya', '', '', 'f'],
      ['دواء', 'la medicina', 'sust', 'dawa', '', '', 'm'],
      ['يشعر', 'sentir', 'verbo', 'yashur', 'أشعر بتحسن.', 'Me siento mejor.'],
      ['ألم', 'el dolor', 'sust', 'alam', '', '', 'm'],
      ['متعب', 'cansado', 'adj', 'mutab'],
    ],
    tiempo_libre: [
      ['طقس', 'el tiempo (clima)', 'sust', 'taqs', 'كيف الطقس؟', 'Que tiempo hace?', 'm'],
      ['شمس', 'el sol', 'sust', 'shams', 'الشمس مشرقة.', 'Hace sol.', 'f'],
      ['مطر', 'la lluvia', 'sust', 'matar', 'إنها تمطر.', 'Esta lloviendo.', 'm'],
      ['رياح', 'el viento', 'sust', 'riyah', '', '', 'f'],
      ['ثلج', 'la nieve', 'sust', 'thalj', '', '', 'm'],
      ['شجرة', 'el arbol', 'sust', 'shajara', '', '', 'f'],
      ['بحر', 'el mar', 'sust', 'bahr', 'نذهب إلى البحر.', 'Vamos al mar.', 'm'],
      ['جبل', 'la montana', 'sust', 'jabal', '', '', 'm'],
      ['كلب', 'el perro', 'sust', 'kalb', '', '', 'm'],
      ['قطة', 'el gato', 'sust', 'qitta', '', '', 'f'],
      ['موسيقى', 'la musica', 'sust', 'musiqa', 'أستمع إلى الموسيقى.', 'Escucho musica.', 'f'],
      ['يلعب', 'jugar', 'verbo', 'yalab', 'ألعب كرة القدم.', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'ar-abjad', title: 'El alfabeto arabe y la direccion', cefr: 'A1', body:
`El arabe se escribe **de derecha a izquierda**. Tiene 28 letras y cada una cambia de forma segun su posicion (inicial, media, final, aislada).
Las vocales cortas (a, i, u) no suelen escribirse: se aprenden con la palabra.
Sonidos nuevos: ح (h fuerte), خ (j), ع (sonido gutural), ق (k profunda), ص/ض/ط (enfaticas).` },
    { skill: 'casa', slug: 'ar-al', title: 'El articulo ال y las letras solares/lunares', cefr: 'A1', body:
`El unico articulo es **ال** (al-), prefijo unido a la palabra: بيت (casa) -> **ال**بيت (la casa).
Con las "letras solares" (t, th, d, r, z, s, sh, n...) la "l" se asimila: الشمس se pronuncia *ash-shams*.
Con las "lunares" (b, j, h, kh, ...) se oye la l: القمر *al-qamar*.` },
    { skill: 'verbos1', slug: 'ar-jumla', title: 'La frase nominal: "ser" no se dice', cefr: 'A1', body:
`En presente afirmativo el arabe **omite el verbo "ser"**:
- البيت كبير = "la casa (es) grande".
- أنا طالب = "yo (soy) estudiante".
El verbo si aparece en pasado (كان) y futuro. El verbo suele ir antes del sujeto en la frase verbal.` },
  ],
  readings: [
    { skill: 'saludos', title: 'زميل جديد', cefr: 'A1', body:
`— مرحبا، هل أنت جديد هنا؟
— نعم، اسمي كريم. أعمل في قسم التسويق.
— تشرفنا يا كريم. أنا سارة. هل تريد قهوة؟
— نعم، من فضلك. أين المطبخ؟
— هناك، على اليمين. الاجتماع يبدأ الساعة العاشرة.
— شكرا جزيلا. إلى اللقاء!`,
      translation:
`— Hola, eres nuevo aqui?
— Si, me llamo Karim. Trabajo en el departamento de marketing.
— Encantada, Karim. Yo soy Sara. Quieres un cafe?
— Si, por favor. Donde esta la cocina?
— Alli, a la derecha. La reunion empieza a las diez.
— Muchas gracias. Hasta luego!`,
      questions: [
        { q: 'Donde trabaja Karim?', options: ['En marketing', 'En ventas', 'En contabilidad'], answer: 0 },
        { q: 'Donde esta la cocina?', options: ['A la derecha', 'A la izquierda', 'Arriba'], answer: 0 },
        { q: 'A que hora empieza la reunion?', options: ['A las diez', 'A las nueve', 'A las once'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'compras', title: 'في المتجر', scenario: 'Compras algo en una tienda en El Cairo.', lines: [
      { speaker: 'البائع', target: 'مرحبا، كيف يمكنني مساعدتك؟', source: 'Hola, en que puedo ayudarle?' },
      { speaker: 'الزبون', target: 'كم يكلف هذا الكتاب؟', source: 'Cuanto cuesta este libro?' },
      { speaker: 'البائع', target: 'خمسون جنيها.', source: 'Cincuenta libras.' },
      { speaker: 'الزبون', target: 'هل يمكنني الدفع بالبطاقة؟', source: 'Puedo pagar con tarjeta?' },
      { speaker: 'البائع', target: 'بالطبع. تفضل.', source: 'Por supuesto. Aqui tiene.' },
      { speaker: 'الزبون', target: 'شكرا. يوما سعيدا!', source: 'Gracias. Buen dia!' },
    ] },
  ],
};
