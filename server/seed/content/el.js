// Griego - contenido A1/A2 (lemma en alfabeto griego + transliteracion)
export default {
  code: 'el',
  vocab: {
    saludos: [
      ['γεια σου', 'hola', 'interj', 'ya su', 'Γεια σου, τι κάνεις;', 'Hola, que tal?'],
      ['καλημέρα', 'buenos dias', 'interj', 'kaliméra', 'Καλημέρα σε όλους.', 'Buenos dias a todos.'],
      ['καλησπέρα', 'buenas tardes', 'interj', 'kalispéra', 'Καλησπέρα και καλως ηρθατε.', 'Buenas tardes y bienvenidos.'],
      ['αντίο', 'adios', 'interj', 'adío', 'Αντίο, τα λέμε αύριο.', 'Adios, hablamos manana.'],
      ['ευχαριστώ', 'gracias', 'verbo', 'efcharistó', 'Ευχαριστώ πολύ.', 'Muchas gracias.'],
      ['παρακαλώ', 'por favor / de nada', 'verbo', 'parakaló', 'Έναν καφέ, παρακαλώ.', 'Un cafe, por favor.'],
      ['συγγνώμη', 'perdon', 'sust', 'signómi', 'Συγγνώμη, άργησα.', 'Perdon, llego tarde.'],
      ['ναι', 'si', 'adv', 'ne', 'Ναι, καταλαβαίνω.', 'Si, entiendo.'],
      ['όχι', 'no', 'adv', 'óchi', 'Όχι, ευχαριστώ.', 'No, gracias.'],
      ['με λένε', 'me llamo', 'expr', 'me léne', 'Με λένε Άννα.', 'Me llamo Anna.'],
      ['χαίρω πολύ', 'encantado', 'expr', 'chéro polí', 'Χαίρω πολύ!', 'Mucho gusto!'],
      ['τι κάνεις', 'como estas', 'expr', 'ti kánis', 'Γεια! Τι κάνεις;', 'Hola! Como estas?'],
    ],
    numeros: [
      ['ένα', 'uno', 'num', 'éna'], ['δύο', 'dos', 'num', 'dío'], ['τρία', 'tres', 'num', 'tría'],
      ['τέσσερα', 'cuatro', 'num', 'tésera'], ['πέντε', 'cinco', 'num', 'pénde'], ['δέκα', 'diez', 'num', 'déka'],
      ['είκοσι', 'veinte', 'num', 'íkosi'], ['εκατό', 'cien', 'num', 'ekató'],
      ['η ώρα', 'la hora', 'sust', 'i óra', 'Τι ώρα είναι;', 'Que hora es?', 'f'],
      ['σήμερα', 'hoy', 'adv', 'símera', 'Σήμερα είναι Δευτέρα.', 'Hoy es lunes.'],
      ['αύριο', 'manana', 'adv', 'ávrio', 'Τα λέμε αύριο!', 'Hasta manana!'],
      ['χθες', 'ayer', 'adv', 'chthes', 'Χθες έβρεξε.', 'Ayer llovio.'],
      ['η εβδομάδα', 'la semana', 'sust', 'i evdomáda', 'την άλλη εβδομάδα', 'la proxima semana', 'f'],
      ['η μέρα', 'el dia', 'sust', 'i méra', 'Καλή μέρα!', 'Buen dia!', 'f'],
    ],
    personas: [
      ['η οικογένεια', 'la familia', 'sust', 'i ikoyénia', 'Η οικογένειά μου είναι μεγάλη.', 'Mi familia es grande.', 'f'],
      ['η μητέρα', 'la madre', 'sust', 'i mitéra', '', '', 'f'],
      ['ο πατέρας', 'el padre', 'sust', 'o patéras', '', '', 'm'],
      ['ο αδελφός', 'el hermano', 'sust', 'o adelfós', 'Έχω έναν αδελφό.', 'Tengo un hermano.', 'm'],
      ['η αδελφή', 'la hermana', 'sust', 'i adelfí', '', '', 'f'],
      ['το παιδί', 'el nino / la nina', 'sust', 'to pedí', 'Τα παιδιά παίζουν.', 'Los ninos juegan.', 'n'],
      ['ο φίλος', 'el amigo', 'sust', 'o fílos', 'Είναι ο καλύτερός μου φίλος.', 'Es mi mejor amigo.', 'm'],
      ['η γυναίκα', 'la mujer', 'sust', 'i yinéka', '', '', 'f'],
      ['ο άντρας', 'el hombre', 'sust', 'o ándras', '', '', 'm'],
      ['το όνομα', 'el nombre', 'sust', 'to ónoma', 'Πως σε λένε;', 'Como te llamas?', 'n'],
      ['νέος', 'joven', 'adj', 'néos'],
      ['μεγάλος', 'mayor / grande', 'adj', 'megálos'],
    ],
    comida: [
      ['το νερό', 'el agua', 'sust', 'to neró', 'Θα ήθελα νερό, παρακαλώ.', 'Quisiera agua, por favor.', 'n'],
      ['το ψωμί', 'el pan', 'sust', 'to psomí', 'Το ψωμί είναι φρέσκο.', 'El pan esta fresco.', 'n'],
      ['το τυρί', 'el queso', 'sust', 'to tirí', '', '', 'n'],
      ['το μήλο', 'la manzana', 'sust', 'to mílo', '', '', 'n'],
      ['ο καφές', 'el cafe', 'sust', 'o kafés', 'Έναν καφέ με γάλα, παρακαλώ.', 'Un cafe con leche, por favor.', 'm'],
      ['το κρασί', 'el vino', 'sust', 'to krasí', '', '', 'n'],
      ['το κρέας', 'la carne', 'sust', 'to kréas', 'Δεν τρώω κρέας.', 'No como carne.', 'n'],
      ['το ψάρι', 'el pescado / el pez', 'sust', 'to psári', '', '', 'n'],
      ['τρώω', 'comer', 'verbo', 'tró-o', 'Μου αρέσει να τρώω φρούτα.', 'Me gusta comer fruta.'],
      ['πίνω', 'beber', 'verbo', 'píno', 'Πρέπει να πίνεις νερό.', 'Hay que beber agua.'],
      ['το πρωινό', 'el desayuno', 'sust', 'to proinó', '', '', 'n'],
      ['ο λογαριασμός', 'la cuenta', 'sust', 'o logariasmós', 'Τον λογαριασμό, παρακαλώ.', 'La cuenta, por favor.', 'm'],
    ],
    casa: [
      ['το σπίτι', 'la casa', 'sust', 'to spíti', 'Μένω σε ένα μικρό σπίτι.', 'Vivo en una casa pequena.', 'n'],
      ['το δωμάτιο', 'la habitacion', 'sust', 'to domátio', '', '', 'n'],
      ['η κουζίνα', 'la cocina', 'sust', 'i kuzína', '', '', 'f'],
      ['το μπάνιο', 'el bano', 'sust', 'to bánio', '', '', 'n'],
      ['η πόρτα', 'la puerta', 'sust', 'i pórta', 'Κλείσε την πόρτα, παρακαλώ.', 'Cierra la puerta, por favor.', 'f'],
      ['το παράθυρο', 'la ventana', 'sust', 'to paráthiro', '', '', 'n'],
      ['το τραπέζι', 'la mesa', 'sust', 'to trapézi', '', '', 'n'],
      ['η καρέκλα', 'la silla', 'sust', 'i karékla', '', '', 'f'],
      ['το κρεβάτι', 'la cama', 'sust', 'to kreváti', '', '', 'n'],
      ['το κλειδί', 'la llave', 'sust', 'to klidí', 'Έχασα τα κλειδιά μου.', 'He perdido las llaves.', 'n'],
      ['ο κήπος', 'el jardin', 'sust', 'o kípos', '', '', 'm'],
    ],
    verbos1: [
      ['είμαι', 'ser / estar', 'verbo', 'íme', 'Είμαι κουρασμένος.', 'Estoy cansado.'],
      ['έχω', 'tener', 'verbo', 'ého', 'Έχω δύο παιδιά.', 'Tengo dos hijos.'],
      ['πηγαίνω', 'ir', 'verbo', 'piyéno', 'Πηγαίνω στη δουλειά.', 'Voy al trabajo.'],
      ['κάνω', 'hacer', 'verbo', 'káno', 'Τι κάνεις;', 'Que haces?'],
      ['θέλω', 'querer', 'verbo', 'thélo', 'Θέλω να μάθω ελληνικά.', 'Quiero aprender griego.'],
      ['μπορώ', 'poder', 'verbo', 'boró', 'Μπορείς να με βοηθήσεις;', 'Puedes ayudarme?'],
      ['ξέρω', 'saber', 'verbo', 'kséro', 'Δεν ξέρω.', 'No lo se.'],
      ['έρχομαι', 'venir', 'verbo', 'érhome', 'Έλα εδώ!', 'Ven aqui!'],
      ['βλέπω', 'ver', 'verbo', 'vlépo', 'Βλέπω τη θάλασσα.', 'Veo el mar.'],
      ['μιλάω', 'hablar', 'verbo', 'miláo', 'Μιλάω λίγο ελληνικά.', 'Hablo un poco de griego.'],
      ['παίρνω', 'tomar / coger', 'verbo', 'pérno', 'Παίρνω το λεωφορείο.', 'Cojo el autobus.'],
      ['λέω', 'decir', 'verbo', 'léo', 'Τι λες;', 'Que dices?'],
    ],
    ciudad: [
      ['η πόλη', 'la ciudad', 'sust', 'i póli', 'Η Αθήνα είναι μεγάλη πόλη.', 'Atenas es una ciudad grande.', 'f'],
      ['ο δρόμος', 'la calle', 'sust', 'o drómos', '', '', 'm'],
      ['ο σταθμός', 'la estacion', 'sust', 'o stathmós', 'Είναι μακριά ο σταθμός;', 'La estacion esta lejos?', 'm'],
      ['το νοσοκομείο', 'el hospital', 'sust', 'to nosokomío', '', '', 'n'],
      ['η τράπεζα', 'el banco', 'sust', 'i trápeza', '', '', 'f'],
      ['αριστερά', 'a la izquierda', 'adv', 'aristerá', 'Στρίψτε αριστερά.', 'Gire a la izquierda.'],
      ['δεξιά', 'a la derecha', 'adv', 'deksiá', 'Είναι δεξιά.', 'Esta a la derecha.'],
      ['ευθεία', 'todo recto', 'adv', 'efthía', 'Πηγαίνετε ευθεία.', 'Vaya todo recto.'],
      ['κοντά', 'cerca', 'adv', 'kondá', 'Είναι πολύ κοντά.', 'Esta muy cerca.'],
      ['μακριά', 'lejos', 'adv', 'makriá', 'Είναι μακριά από εδώ;', 'Esta lejos de aqui?'],
      ['πού', 'donde', 'adv', 'pu', 'Πού είναι η έξοδος;', 'Donde esta la salida?'],
      ['ο χάρτης', 'el mapa', 'sust', 'o hártis', '', '', 'm'],
    ],
    compras: [
      ['το μαγαζί', 'la tienda', 'sust', 'to magazí', 'Το μαγαζί είναι ανοιχτό.', 'La tienda esta abierta.', 'n'],
      ['η αγορά', 'el mercado', 'sust', 'i agorá', '', '', 'f'],
      ['τα λεφτά', 'el dinero', 'sust', 'ta leftá', 'Δεν έχω λεφτά.', 'No tengo dinero.', 'n'],
      ['η τιμή', 'el precio', 'sust', 'i timí', 'Ποια είναι η τιμή;', 'Cual es el precio?', 'f'],
      ['ακριβός', 'caro', 'adj', 'akrivós', 'Είναι πολύ ακριβό.', 'Es muy caro.'],
      ['φθηνός', 'barato', 'adj', 'fthinós'],
      ['αγοράζω', 'comprar', 'verbo', 'agorázo', 'Θέλω να αγοράσω αυτό το βιβλίο.', 'Quiero comprar este libro.'],
      ['πληρώνω', 'pagar', 'verbo', 'pliróno', 'Μπορώ να πληρώσω με κάρτα;', 'Puedo pagar con tarjeta?'],
      ['πόσο', 'cuanto', 'adv', 'póso', 'Πόσο κάνει;', 'Cuanto cuesta?'],
      ['δωρεάν', 'gratis', 'adj', 'doreán'],
      ['ανοιχτό', 'abierto', 'adj', 'anihtó'],
      ['κλειστό', 'cerrado', 'adj', 'klistó'],
    ],
    trabajo: [
      ['η δουλειά', 'el trabajo', 'sust', 'i duliá', 'Μου αρέσει η δουλειά μου.', 'Me gusta mi trabajo.', 'f'],
      ['το γραφείο', 'la oficina', 'sust', 'to grafío', '', '', 'n'],
      ['το σχολείο', 'la escuela', 'sust', 'to scholío', '', '', 'n'],
      ['το αφεντικό', 'el jefe', 'sust', 'to afendikó', '', '', 'n'],
      ['ο συνάδελφος', 'el companero de trabajo', 'sust', 'o sinádelfos', '', '', 'm'],
      ['ο υπολογιστής', 'el ordenador', 'sust', 'o ipoloyistís', '', '', 'm'],
      ['η συνάντηση', 'la reunion', 'sust', 'i sinándisi', 'Έχω συνάντηση στις δέκα.', 'Tengo una reunion a las diez.', 'f'],
      ['δουλεύω', 'trabajar', 'verbo', 'dulévo', 'Δουλεύω σε μια τράπεζα.', 'Trabajo en un banco.'],
      ['σπουδάζω', 'estudiar (carrera)', 'verbo', 'spudázo', 'Σπουδάζω νομική.', 'Estudio derecho.'],
      ['μαθαίνω', 'aprender', 'verbo', 'mathéno', 'Μαθαίνω γαλλικά.', 'Aprendo frances.'],
      ['το επάγγελμα', 'la profesion', 'sust', 'to epángelma', '', '', 'n'],
      ['απασχολημένος', 'ocupado', 'adj', 'apascholiménos'],
    ],
    viajes: [
      ['το ταξίδι', 'el viaje', 'sust', 'to taksídi', 'Καλό ταξίδι!', 'Buen viaje!', 'n'],
      ['το αεροδρόμιο', 'el aeropuerto', 'sust', 'to aerodrómio', '', '', 'n'],
      ['το αεροπλάνο', 'el avion', 'sust', 'to aeropláno', 'Το αεροπλάνο φεύγει στις δώδεκα.', 'El avion sale a las doce.', 'n'],
      ['το τρένο', 'el tren', 'sust', 'to tréno', '', '', 'n'],
      ['το αυτοκίνητο', 'el coche', 'sust', 'to aftokínito', '', '', 'n'],
      ['το εισιτήριο', 'el billete', 'sust', 'to isitírio', 'Ένα εισιτήριο με επιστροφή, παρακαλώ.', 'Un billete de ida y vuelta, por favor.', 'n'],
      ['το ξενοδοχείο', 'el hotel', 'sust', 'to ksenodohío', '', '', 'n'],
      ['η βαλίτσα', 'la maleta', 'sust', 'i valítsa', '', '', 'f'],
      ['το διαβατήριο', 'el pasaporte', 'sust', 'to diavatírio', '', '', 'n'],
      ['φεύγω', 'salir / irse', 'verbo', 'févgo', 'Το τρένο φεύγει στις δώδεκα.', 'El tren sale a las doce.'],
      ['φτάνω', 'llegar', 'verbo', 'ftáno', 'Φτάνουμε αύριο.', 'Llegamos manana.'],
      ['κλείνω', 'reservar / cerrar', 'verbo', 'klíno', 'Θέλω να κλείσω ένα δωμάτιο.', 'Quiero reservar una habitacion.'],
    ],
    salud: [
      ['η υγεία', 'la salud', 'sust', 'i iyía', '', '', 'f'],
      ['το σώμα', 'el cuerpo', 'sust', 'to sóma', '', '', 'n'],
      ['το κεφάλι', 'la cabeza', 'sust', 'to kefáli', 'Έχω πονοκέφαλο.', 'Tengo dolor de cabeza.', 'n'],
      ['το χέρι', 'la mano / el brazo', 'sust', 'to héri', '', '', 'n'],
      ['το πόδι', 'el pie / la pierna', 'sust', 'to pódi', '', '', 'n'],
      ['ο γιατρός', 'el medico', 'sust', 'o yatrós', 'Πρέπει να δω έναν γιατρό.', 'Tengo que ver a un medico.', 'm'],
      ['άρρωστος', 'enfermo', 'adj', 'árostos', 'Είμαι άρρωστος.', 'Estoy enfermo.'],
      ['το φαρμακείο', 'la farmacia', 'sust', 'to farmakío', '', '', 'n'],
      ['το φάρμακο', 'el medicamento', 'sust', 'to fármako', '', '', 'n'],
      ['νιώθω', 'sentirse', 'verbo', 'nióho', 'Νιώθω καλύτερα.', 'Me siento mejor.'],
      ['ο πόνος', 'el dolor', 'sust', 'o pónos', '', '', 'm'],
      ['κουρασμένος', 'cansado', 'adj', 'kurasménos'],
    ],
    tiempo_libre: [
      ['ο καιρός', 'el tiempo (clima)', 'sust', 'o kerós', 'Τι καιρό κάνει;', 'Que tiempo hace?', 'm'],
      ['ο ήλιος', 'el sol', 'sust', 'o ílios', 'Έχει ήλιο.', 'Hace sol.', 'm'],
      ['η βροχή', 'la lluvia', 'sust', 'i vrohí', 'Βρέχει.', 'Llueve.', 'f'],
      ['ο άνεμος', 'el viento', 'sust', 'o ánemos', '', '', 'm'],
      ['το χιόνι', 'la nieve', 'sust', 'to hióni', '', '', 'n'],
      ['το δέντρο', 'el arbol', 'sust', 'to déndro', '', '', 'n'],
      ['η θάλασσα', 'el mar', 'sust', 'i thálasa', 'Πάμε στη θάλασσα.', 'Vamos al mar.', 'f'],
      ['το βουνό', 'la montana', 'sust', 'to vunó', '', '', 'n'],
      ['ο σκύλος', 'el perro', 'sust', 'o skílos', '', '', 'm'],
      ['η γάτα', 'el gato', 'sust', 'i gáta', '', '', 'f'],
      ['η μουσική', 'la musica', 'sust', 'i musikí', 'Ακούω μουσική.', 'Escucho musica.', 'f'],
      ['παίζω', 'jugar / tocar', 'verbo', 'pézo', 'Παίζω ποδόσφαιρο.', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'el-alfabeto', title: 'El alfabeto griego (24 letras)', cefr: 'A1', body:
`El griego usa su propio alfabeto. Algunas claves de pronunciacion:
- **β** = v (no b) | **γ** = g suave / "y" ante e,i | **δ** = "th" de "the"
- **η, ι, υ, ει, οι** = todas suenan /i/ | **θ** = "th" de "think" | **χ** = j espanola
- **μπ** = b | **ντ** = d | **γκ** = g
El acento (´) marca SIEMPRE la silaba tonica: es obligatorio y muy util.` },
    { skill: 'casa', slug: 'el-articulo', title: 'El articulo: ο / η / το', cefr: 'A1', body:
`Tres generos, como en aleman:
- **ο** (o) masculino: ο δρόμος
- **η** (i) femenino: η πόρτα
- **το** (to) neutro: το σπίτι
El articulo cambia mucho con los casos (nominativo, genitivo, acusativo). Aprende la palabra con su articulo.` },
    { skill: 'verbos1', slug: 'el-presente', title: 'Presente: είμαι y verbos en -ω', cefr: 'A1', body:
`**είμαι** (ser/estar): είμαι, είσαι, είναι, είμαστε, είστε, είναι.
Verbos en **-ω**: μιλάω/μιλώ -> μιλάς, μιλάει, μιλάμε, μιλάτε, μιλάνε.
No suele hacer falta el pronombre: la terminacion ya indica la persona.` },
  ],
  readings: [
    { skill: 'saludos', title: 'Στην καφετέρια', cefr: 'A1', body:
`— Γεια σου! Είσαι καινούριος εδώ;
— Ναι, με λένε Νίκο. Δουλεύω στο γραφείο πάνω.
— Χαίρω πολύ, Νίκο. Είμαι η Μαρία. Θέλεις έναν καφέ;
— Ναι, ευχαριστώ. Πού είναι η κουζίνα;
— Εκεί, δεξιά. Η συνάντηση αρχίζει στις δέκα.
— Τέλεια. Τα λέμε σε λίγο!`,
      translation:
`— Hola! Eres nuevo aqui?
— Si, me llamo Nikos. Trabajo en la oficina de arriba.
— Mucho gusto, Nikos. Yo soy Maria. Quieres un cafe?
— Si, gracias. Donde esta la cocina?
— Alli, a la derecha. La reunion empieza a las diez.
— Perfecto. Nos vemos en un rato!`,
      questions: [
        { q: 'Como se llama el hombre?', options: ['Nikos', 'Maria', 'Yorgos'], answer: 0 },
        { q: 'Donde esta la cocina?', options: ['A la derecha', 'A la izquierda', 'Arriba'], answer: 0 },
        { q: 'A que hora empieza la reunion?', options: ['A las diez', 'A las nueve', 'A las once'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'compras', title: 'Στο μαγαζί', scenario: 'Compras algo en una tienda de Atenas.', lines: [
      { speaker: 'Πωλητής', target: 'Καλημέρα! Ορίστε;', source: 'Buenos dias! Digame?' },
      { speaker: 'Πελάτης', target: 'Πόσο κάνει αυτό το βιβλίο;', source: 'Cuanto cuesta este libro?' },
      { speaker: 'Πωλητής', target: 'Δώδεκα ευρώ.', source: 'Doce euros.' },
      { speaker: 'Πελάτης', target: 'Μπορώ να πληρώσω με κάρτα;', source: 'Puedo pagar con tarjeta?' },
      { speaker: 'Πωλητής', target: 'Βεβαίως. Ευχαριστώ πολύ.', source: 'Por supuesto. Muchas gracias.' },
      { speaker: 'Πελάτης', target: 'Ευχαριστώ. Καλή σας μέρα!', source: 'Gracias. Buen dia!' },
    ] },
  ],
};
