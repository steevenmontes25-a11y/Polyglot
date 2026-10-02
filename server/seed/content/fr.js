// Frances - contenido A1/A2 (base para hispanohablantes)
export default {
  code: 'fr',
  vocab: {
    saludos: [
      ['bonjour', 'buenos dias / hola', 'interj', '', 'Bonjour, comment allez-vous ?', 'Buenos dias, como esta usted?'],
      ['salut', 'hola / chao (informal)', 'interj', '', 'Salut, ca va ?', 'Hola, que tal?'],
      ['bonsoir', 'buenas tardes / buenas noches', 'interj', '', 'Bonsoir et bienvenue.', 'Buenas noches y bienvenido.'],
      ['au revoir', 'adios', 'expr', '', 'Au revoir, a bientot !', 'Adios, hasta pronto!'],
      ['merci', 'gracias', 'interj', '', 'Merci beaucoup pour votre aide.', 'Muchas gracias por su ayuda.'],
      ["s'il vous plait", 'por favor', 'expr', '', 'Un cafe, s\'il vous plait.', 'Un cafe, por favor.'],
      ['pardon', 'perdon / disculpe', 'interj', '', 'Pardon, je suis en retard.', 'Perdon, llego tarde.'],
      ['oui', 'si', 'adv', '', 'Oui, je comprends.', 'Si, entiendo.'],
      ['non', 'no', 'adv', '', 'Non, merci.', 'No, gracias.'],
      ['enchante', 'encantado', 'adj', '', 'Enchante de faire votre connaissance.', 'Encantado de conocerle.'],
      ["je m'appelle", 'me llamo', 'expr', '', 'Je m\'appelle Marie.', 'Me llamo Marie.'],
      ['comment ca va', 'que tal / como estas', 'expr', '', 'Salut ! Comment ca va ?', 'Hola! Como estas?'],
    ],
    numeros: [
      ['un', 'uno', 'num'], ['deux', 'dos', 'num'], ['trois', 'tres', 'num'],
      ['quatre', 'cuatro', 'num'], ['cinq', 'cinco', 'num'], ['dix', 'diez', 'num'],
      ['vingt', 'veinte', 'num'], ['cent', 'cien', 'num'],
      ["l'heure", 'la hora', 'sust', '', 'Quelle heure est-il ?', 'Que hora es?', 'f'],
      ["aujourd'hui", 'hoy', 'adv', '', "Aujourd'hui, c'est lundi.", 'Hoy es lunes.'],
      ['demain', 'manana (dia siguiente)', 'adv', '', 'A demain !', 'Hasta manana!'],
      ['hier', 'ayer', 'adv', '', 'Hier, il a plu.', 'Ayer llovio.'],
      ['la semaine', 'la semana', 'sust', '', 'la semaine prochaine', 'la proxima semana', 'f'],
      ['le jour', 'el dia', 'sust', '', 'Bonne journee !', 'Buen dia!', 'm'],
    ],
    personas: [
      ['la famille', 'la familia', 'sust', '', 'Ma famille est grande.', 'Mi familia es grande.', 'f'],
      ['la mere', 'la madre', 'sust', '', '', '', 'f'],
      ['le pere', 'el padre', 'sust', '', '', '', 'm'],
      ['le frere', 'el hermano', 'sust', '', "J'ai un frere et une soeur.", 'Tengo un hermano y una hermana.', 'm'],
      ['la soeur', 'la hermana', 'sust', '', '', '', 'f'],
      ["l'enfant", 'el nino / la nina', 'sust', '', 'Les enfants jouent dans le parc.', 'Los ninos juegan en el parque.', 'm'],
      ["l'ami", 'el amigo', 'sust', '', "C'est mon meilleur ami.", 'Es mi mejor amigo.', 'm'],
      ['la femme', 'la mujer / la esposa', 'sust', '', '', '', 'f'],
      ["l'homme", 'el hombre', 'sust', '', '', '', 'm'],
      ['le nom', 'el nombre / apellido', 'sust', '', 'Quel est votre nom ?', 'Cual es su apellido?', 'm'],
      ['jeune', 'joven', 'adj'],
      ['vieux', 'viejo', 'adj'],
    ],
    comida: [
      ["l'eau", 'el agua', 'sust', '', 'Je voudrais de l\'eau, s\'il vous plait.', 'Quisiera agua, por favor.', 'f'],
      ['le pain', 'el pan', 'sust', '', 'Le pain est frais.', 'El pan esta fresco.', 'm'],
      ['le fromage', 'el queso', 'sust', '', '', '', 'm'],
      ['la pomme', 'la manzana', 'sust', '', '', '', 'f'],
      ['le cafe', 'el cafe', 'sust', '', 'Un cafe au lait, s\'il vous plait.', 'Un cafe con leche, por favor.', 'm'],
      ['le vin', 'el vino', 'sust', '', '', '', 'm'],
      ['la viande', 'la carne', 'sust', '', 'Je ne mange pas de viande.', 'No como carne.', 'f'],
      ['le poisson', 'el pescado / el pez', 'sust', '', '', '', 'm'],
      ['manger', 'comer', 'verbo', '', "J'aime manger des fruits.", 'Me gusta comer fruta.'],
      ['boire', 'beber', 'verbo', '', "Il faut boire de l'eau.", 'Hay que beber agua.'],
      ['le petit-dejeuner', 'el desayuno', 'sust', '', '', '', 'm'],
      ["l'addition", 'la cuenta', 'sust', '', "L'addition, s'il vous plait.", 'La cuenta, por favor.', 'f'],
    ],
    casa: [
      ['la maison', 'la casa', 'sust', '', "J'habite dans une petite maison.", 'Vivo en una casa pequena.', 'f'],
      ['la chambre', 'la habitacion / el dormitorio', 'sust', '', '', '', 'f'],
      ['la cuisine', 'la cocina', 'sust', '', '', '', 'f'],
      ['la salle de bains', 'el bano', 'sust', '', '', '', 'f'],
      ['la porte', 'la puerta', 'sust', '', 'Ferme la porte, s\'il te plait.', 'Cierra la puerta, por favor.', 'f'],
      ['la fenetre', 'la ventana', 'sust', '', '', '', 'f'],
      ['la table', 'la mesa', 'sust', '', '', '', 'f'],
      ['la chaise', 'la silla', 'sust', '', '', '', 'f'],
      ['le lit', 'la cama', 'sust', '', '', '', 'm'],
      ['la cle', 'la llave', 'sust', '', "J'ai perdu mes cles.", 'He perdido las llaves.', 'f'],
      ['le jardin', 'el jardin', 'sust', '', '', '', 'm'],
    ],
    verbos1: [
      ['etre', 'ser / estar', 'verbo', '', 'Je suis fatigue.', 'Estoy cansado.'],
      ['avoir', 'tener / haber', 'verbo', '', "J'ai deux enfants.", 'Tengo dos hijos.'],
      ['aller', 'ir', 'verbo', '', 'Je vais au travail.', 'Voy al trabajo.'],
      ['faire', 'hacer', 'verbo', '', "Qu'est-ce que tu fais ?", 'Que haces?'],
      ['vouloir', 'querer', 'verbo', '', 'Je veux apprendre le francais.', 'Quiero aprender frances.'],
      ['pouvoir', 'poder', 'verbo', '', 'Pouvez-vous m\'aider ?', 'Puede ayudarme?'],
      ['savoir', 'saber', 'verbo', '', 'Je ne sais pas.', 'No lo se.'],
      ['venir', 'venir', 'verbo', '', 'Viens ici !', 'Ven aqui!'],
      ['voir', 'ver', 'verbo', '', 'Je vois la mer.', 'Veo el mar.'],
      ['parler', 'hablar', 'verbo', '', 'Je parle un peu francais.', 'Hablo un poco de frances.'],
      ['prendre', 'tomar / coger', 'verbo', '', 'Je prends le bus.', 'Cojo el autobus.'],
      ['dire', 'decir', 'verbo', '', "Qu'est-ce que tu dis ?", 'Que dices?'],
    ],
    ciudad: [
      ['la ville', 'la ciudad', 'sust', '', 'Paris est une grande ville.', 'Paris es una ciudad grande.', 'f'],
      ['la rue', 'la calle', 'sust', '', '', '', 'f'],
      ['la gare', 'la estacion de tren', 'sust', '', 'La gare est loin ?', 'La estacion esta lejos?', 'f'],
      ["l'hopital", 'el hospital', 'sust', '', '', '', 'm'],
      ['la banque', 'el banco', 'sust', '', '', '', 'f'],
      ['a gauche', 'a la izquierda', 'expr', '', 'Tournez a gauche.', 'Gire a la izquierda.'],
      ['a droite', 'a la derecha', 'expr', '', "C'est a droite.", 'Esta a la derecha.'],
      ['tout droit', 'todo recto', 'expr', '', 'Continuez tout droit.', 'Siga todo recto.'],
      ['pres', 'cerca', 'adv', '', "C'est tout pres.", 'Esta muy cerca.'],
      ['loin', 'lejos', 'adv', '', "C'est loin d'ici ?", 'Esta lejos de aqui?'],
      ['ou', 'donde', 'adv', '', 'Ou est la sortie ?', 'Donde esta la salida?'],
      ['le plan', 'el plano / el mapa', 'sust', '', '', '', 'm'],
    ],
    compras: [
      ['le magasin', 'la tienda', 'sust', '', 'Le magasin est ouvert.', 'La tienda esta abierta.', 'm'],
      ['le marche', 'el mercado', 'sust', '', '', '', 'm'],
      ["l'argent", 'el dinero', 'sust', '', "Je n'ai pas d'argent.", 'No tengo dinero.', 'm'],
      ['le prix', 'el precio', 'sust', '', 'Quel est le prix ?', 'Cual es el precio?', 'm'],
      ['cher', 'caro', 'adj', '', "C'est trop cher.", 'Es demasiado caro.'],
      ['acheter', 'comprar', 'verbo', '', 'Je voudrais acheter ce livre.', 'Quisiera comprar este libro.'],
      ['payer', 'pagar', 'verbo', '', 'Je peux payer par carte ?', 'Puedo pagar con tarjeta?'],
      ['combien', 'cuanto', 'adv', '', 'Ca coute combien ?', 'Cuanto cuesta?'],
      ['gratuit', 'gratis', 'adj'],
      ['la monnaie', 'el cambio / la moneda', 'sust', '', '', '', 'f'],
      ['ouvert', 'abierto', 'adj'],
      ['ferme', 'cerrado', 'adj'],
    ],
    trabajo: [
      ['le travail', 'el trabajo', 'sust', '', "J'aime mon travail.", 'Me gusta mi trabajo.', 'm'],
      ['le bureau', 'la oficina / el escritorio', 'sust', '', '', '', 'm'],
      ["l'ecole", 'la escuela', 'sust', '', '', '', 'f'],
      ['le patron', 'el jefe', 'sust', '', '', '', 'm'],
      ['le collegue', 'el companero de trabajo', 'sust', '', '', '', 'm'],
      ["l'ordinateur", 'el ordenador', 'sust', '', '', '', 'm'],
      ['la reunion', 'la reunion', 'sust', '', "J'ai une reunion a dix heures.", 'Tengo una reunion a las diez.', 'f'],
      ['travailler', 'trabajar', 'verbo', '', 'Je travaille dans une banque.', 'Trabajo en un banco.'],
      ['etudier', 'estudiar', 'verbo', '', "J'etudie le droit.", 'Estudio derecho.'],
      ['apprendre', 'aprender', 'verbo', '', "J'apprends l'italien.", 'Aprendo italiano.'],
      ['le metier', 'el oficio / la profesion', 'sust', '', '', '', 'm'],
      ['occupe', 'ocupado', 'adj'],
    ],
    viajes: [
      ['le voyage', 'el viaje', 'sust', '', 'Bon voyage !', 'Buen viaje!', 'm'],
      ["l'aeroport", 'el aeropuerto', 'sust', '', '', '', 'm'],
      ["l'avion", 'el avion', 'sust', '', "L'avion decolle a midi.", 'El avion despega a mediodia.', 'm'],
      ['le train', 'el tren', 'sust', '', '', '', 'm'],
      ['la voiture', 'el coche', 'sust', '', '', '', 'f'],
      ['le billet', 'el billete', 'sust', '', 'Un billet aller-retour, s\'il vous plait.', 'Un billete de ida y vuelta, por favor.', 'm'],
      ["l'hotel", 'el hotel', 'sust', '', '', '', 'm'],
      ['la valise', 'la maleta', 'sust', '', '', '', 'f'],
      ['le passeport', 'el pasaporte', 'sust', '', '', '', 'm'],
      ['partir', 'salir / irse', 'verbo', '', 'Le train part a midi.', 'El tren sale a mediodia.'],
      ['arriver', 'llegar', 'verbo', '', 'Nous arrivons demain.', 'Llegamos manana.'],
      ['reserver', 'reservar', 'verbo', '', 'Je voudrais reserver une chambre.', 'Quisiera reservar una habitacion.'],
    ],
    salud: [
      ['la sante', 'la salud', 'sust', '', 'A votre sante !', 'A su salud!', 'f'],
      ['le corps', 'el cuerpo', 'sust', '', '', '', 'm'],
      ['la tete', 'la cabeza', 'sust', '', "J'ai mal a la tete.", 'Me duele la cabeza.', 'f'],
      ['la main', 'la mano', 'sust', '', '', '', 'f'],
      ['le pied', 'el pie', 'sust', '', '', '', 'm'],
      ['le medecin', 'el medico', 'sust', '', 'Je dois voir un medecin.', 'Tengo que ver a un medico.', 'm'],
      ['malade', 'enfermo', 'adj', '', 'Je suis malade.', 'Estoy enfermo.'],
      ['la pharmacie', 'la farmacia', 'sust', '', '', '', 'f'],
      ['le medicament', 'el medicamento', 'sust', '', '', '', 'm'],
      ['se sentir', 'sentirse', 'verbo', '', 'Je me sens mieux.', 'Me siento mejor.'],
      ['la douleur', 'el dolor', 'sust', '', '', '', 'f'],
      ['fatigue', 'cansado', 'adj'],
    ],
    tiempo_libre: [
      ['le temps', 'el tiempo (clima)', 'sust', '', 'Quel temps fait-il ?', 'Que tiempo hace?', 'm'],
      ['le soleil', 'el sol', 'sust', '', 'Il fait du soleil.', 'Hace sol.', 'm'],
      ['la pluie', 'la lluvia', 'sust', '', 'Il pleut aujourd\'hui.', 'Hoy llueve.', 'f'],
      ['le vent', 'el viento', 'sust', '', '', '', 'm'],
      ['la neige', 'la nieve', 'sust', '', '', '', 'f'],
      ["l'arbre", 'el arbol', 'sust', '', '', '', 'm'],
      ['la mer', 'el mar', 'sust', '', 'Nous allons a la mer.', 'Vamos al mar.', 'f'],
      ['la montagne', 'la montana', 'sust', '', '', '', 'f'],
      ['le chien', 'el perro', 'sust', '', '', '', 'm'],
      ['le chat', 'el gato', 'sust', '', '', '', 'm'],
      ['la musique', 'la musica', 'sust', '', "J'ecoute de la musique.", 'Escucho musica.', 'f'],
      ['jouer', 'jugar / tocar', 'verbo', '', 'Je joue au football.', 'Juego al futbol.'],
    ],
  },
  grammar: [
    { skill: 'saludos', slug: 'fr-tu-vous', title: 'Tutear o tratar de usted: tu / vous', cefr: 'A1', body:
`En frances hay dos formas de "tu":
- **tu**: informal, con amigos, familia y ninos. -> "Comment vas-tu ?"
- **vous**: formal (una persona a la que tratas de usted) y tambien plural (varias personas). -> "Comment allez-vous ?"

Ante la duda con un adulto desconocido, usa **vous**. Cambiar a "tu" suele proponerse: "On peut se tutoyer ?"` },
    { skill: 'casa', slug: 'fr-articles', title: 'Los articulos: le, la, les / un, une, des', cefr: 'A1', body:
`Todo sustantivo frances tiene genero (m/f), aunque no coincida con el espanol.
- Definidos: **le** (m), **la** (f), **les** (plural), **l'** ante vocal -> le livre, la table, les cles, l'eau.
- Indefinidos: **un** (m), **une** (f), **des** (plural) -> un chien, une maison, des amis.

Consejo: aprende siempre la palabra CON su articulo ("la table", no solo "table").` },
    { skill: 'verbos1', slug: 'fr-etre-avoir', title: 'Presente de être y avoir', cefr: 'A1', body:
`**être** (ser/estar): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.
**avoir** (tener/haber): j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.

Ojo: la edad se dice con *avoir* -> "J'ai vingt ans" (literalmente "tengo veinte anos").` },
    { skill: 'compras', slug: 'fr-negation', title: 'La negacion: ne... pas', cefr: 'A1', body:
`El verbo se rodea de **ne ... pas**:
- Je **ne** parle **pas** anglais. (No hablo ingles.)
- Ce **n'**est **pas** cher. (No es caro.)

En lenguaje hablado el "ne" a menudo desaparece: "Je sais pas". Otras: ne... jamais (nunca), ne... rien (nada), ne... plus (ya no).` },
  ],
  readings: [
    { skill: 'saludos', title: 'Une nouvelle voisine', cefr: 'A1', body:
`— Bonjour ! Je m'appelle Camille. J'habite au troisieme etage.
— Enchante, Camille. Moi, c'est Paul. Bienvenue dans l'immeuble !
— Merci beaucoup. Vous habitez ici depuis longtemps ?
— Depuis cinq ans. Le quartier est calme et il y a un marche le samedi.
— Parfait. Bonne journee, Paul !
— A bientot, Camille.`,
      translation:
`— Hola! Me llamo Camille. Vivo en el tercer piso.
— Encantado, Camille. Yo soy Paul. Bienvenida al edificio!
— Muchas gracias. Vive aqui desde hace mucho?
— Desde hace cinco anos. El barrio es tranquilo y hay un mercado los sabados.
— Perfecto. Buen dia, Paul!
— Hasta pronto, Camille.`,
      questions: [
        { q: 'A que piso vive Camille?', options: ['Al tercero', 'Al quinto', 'Al primero'], answer: 0 },
        { q: 'Desde cuando vive Paul en el edificio?', options: ['Desde cinco anos', 'Desde un ano', 'Desde diez anos'], answer: 0 },
        { q: 'Que dia hay mercado?', options: ['El sabado', 'El domingo', 'El lunes'], answer: 0 },
      ] },
    { skill: 'viajes', title: 'A la gare', cefr: 'A2', body:
`Marc arrive a la gare a huit heures. Son train pour Lyon part a huit heures vingt.
Il achete un billet aller-retour et un cafe. Le train a un peu de retard : il part a huit heures trente.
Pendant le voyage, Marc lit un livre et regarde le paysage. Il arrive a Lyon a dix heures et demie.
Sa soeur l'attend sur le quai.`,
      translation:
`Marc llega a la estacion a las ocho. Su tren a Lyon sale a las ocho y veinte.
Compra un billete de ida y vuelta y un cafe. El tren lleva un poco de retraso: sale a las ocho y media.
Durante el viaje, Marc lee un libro y mira el paisaje. Llega a Lyon a las diez y media.
Su hermana lo espera en el anden.`,
      questions: [
        { q: 'A que hora deberia salir el tren?', options: ['A las 8:20', 'A las 8:00', 'A las 8:30'], answer: 0 },
        { q: 'Que compra Marc?', options: ['Un billete y un cafe', 'Solo un billete', 'Un libro'], answer: 0 },
        { q: 'Quien espera a Marc en Lyon?', options: ['Su hermana', 'Su madre', 'Su amigo'], answer: 0 },
      ] },
  ],
  dialogues: [
    { skill: 'comida', title: 'Au restaurant', scenario: 'Pides la cena en un bistro parisino.', lines: [
      { speaker: 'Serveur', target: 'Bonsoir, vous avez reserve ?', source: 'Buenas noches, ha reservado?' },
      { speaker: 'Client', target: 'Oui, une table pour deux au nom de Dupont.', source: 'Si, una mesa para dos a nombre de Dupont.' },
      { speaker: 'Serveur', target: 'Tres bien. Voici la carte. Que voulez-vous boire ?', source: 'Muy bien. Aqui tiene la carta. Que quiere beber?' },
      { speaker: 'Client', target: 'Une carafe d\'eau et un verre de vin rouge, s\'il vous plait.', source: 'Una jarra de agua y una copa de vino tinto, por favor.' },
      { speaker: 'Serveur', target: 'Et comme plat ?', source: 'Y de plato?' },
      { speaker: 'Client', target: 'Le poisson du jour, merci.', source: 'El pescado del dia, gracias.' },
      { speaker: 'Serveur', target: 'Parfait. L\'addition arrivera plus tard.', source: 'Perfecto. La cuenta llegara mas tarde.' },
    ] },
  ],
};
