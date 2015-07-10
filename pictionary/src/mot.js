/* Function Remplacer les carractére de la chaine */

function preg_replace(array_pattern, array_pattern_replace, my_string) {
	var new_string = String (my_string);
    for (i=0; i<array_pattern.length; i++) {
        var reg_exp= RegExp(array_pattern[i], "gi");
        var val_to_replace = array_pattern_replace[i];
        new_string = new_string.replace (reg_exp, val_to_replace);
    }
    return new_string;
}

/* Liste MOTS */

var ListeMot = [

/* FRUIT */
"Raisin",
"Banane",
"Pomme",
"Mangue",
"Ananas",
"Poire",
"Fraise",
"Framboise",
"Cerise",
"Citron",

/* ANIMAL */
"Canard",
"Vache",
"Chat",
"Chien",
"lapin",
"Escargot",
"Ours",
"Serpent",
"Tortue",
"Crocodile",
"Grenouille",
"cochon",
"Zebre",
"Lion",
"singe",
"Ecureuil",
"Hérisson",
"Pieuvre",
"poussin",
"panda",
"pingouin",
"Elephant",
"Poule",
"Girafe",
"Poulet",
"Dauphin",
"Requin",
"Baleine",
"Méduse",
"Libellule",
"Papillon",
"Coccinelle",
"Sauterelle",
"Mante religieuse",
"Aigle",
"Rat",
"Corbeau",
"Guêpe",
"Koala",
"Poney",
"Fourmi",
"Chauve-souris",
"Humain",
"Cheval",
"Taupe",
"Castor",
"Autruche",
"Chameau",
"Crabe",
"Moustique",

/* METIER */
"Pompiers",
"Automobiliste",
"Maison",
"Immeuble",
"Spaghetti",
"Escarpin",
"Escalier",

/* OBJET */
"Telephone",
"Vase",
"Radio",
"Antenne",
"Prise de courant",
"Bouton",
"Fauteuil",
"Clavier",
"Tournevis",
"Punaise",
"Horloge",
"Pedalo",
"sucette",
"Enveloppe",
"Lettre",
"Parapluie",
"Manette",
"Stylo",

/* VELICULE */
"Voiture",
"Camion",
"Hélicoptère",

/* SPORT */
"Surfeur",
"Tennis",
"Football",
"Golf",
"Avion",
"Barque",
"Rame",
"Etang",
"Lac",
"Parachute",
"Deltaplane",
"Elastique",
"Systeme solaire",
"Tapis volant",

/* VEGETATION */
"Coquillette",
"Lierre",
"Nenuphar",
"Coquillage",
"Fleur",
"Cactus",
"Arbre",
"Tournesol",

/* LIEU / MONUMENT */
"Ile",
"Plage",
"tour Eiffel",
"Tour de Pise",

"France",
"Corse",
"Italie",
"Japon",

/* VETEMENT */
"pantalon",
"gants",
"chemise",
"écharpe",
"Casquette",
"Cravate",

"Peigne",

/* PARTIE DU CORP */
"Nez",
"Oreille",
"Oeil",
"Main",
"nombril",
"Pied",

/* FORME GEOMETRIQUE */
"Hexagone",
"Pyramide",
"Triangle",

/* AUTRE*/
"Lumiere",
"Ninja",
"Zombie",
"Momie",
"Squelette",
"Sorcier",
"Loup-Garou",
"Vampire",
"Diable",
"Tête de mort",
"Tombe",
"Bonhomme de neige",
"Femme",
"Addition",
"Electricité",
"Dragon",

//facile
"fleur", 
"chien", 
"éternuer", 
"livre", 
"cercle", 
"glace", 
"lait", 
"base-ball", 
"kangourou", 
"ballon", 
"boisson", 
"robot", 
"poulet", 
"rock", 
"appareil photo", 
"livre", 
"lapin", 
"bras", 
"bras", 
"crayon", 
"Aller", 
"porc", 
"singe", 
"bébé", 
"heureux", 
"marelle", 
"araignée", 
"oiseau", 
"poupée", 
"coulisses", 
"tortue", 
"chambre", 
"tambour", 
"oreille", 
"joue", 
"sourire", 
"pot", 
"menton", 
"téléphone", 
"bouche", 
"basket-ball", 
"queue", 
"avion", 
"arbre", 
"étoile", 
"point", 
"ciseaux",

// DIFICILE
"colonne vertébrale",
"cheveux ",
"clé",
"partie",
"pizza",
"gilet",
"Teinture",
"année",
"sable",
"moulin à vent",
"picorer",
"Tondeuse à gazon",
"pain d'épice",
"trône",
"aviron",
"histoire",
"craie",
"klaxonner",
"hibou",
"pot",
"cour de récréation",
"président",
"humain",
"artiste",
"girafe",
"miel",
"échelle",
"cire",
"jeter",
"coup de soleil",
"salle de bain",
"raide",
"échecs",
"ombre",
"chiffon",
"perruque",
"médecin",
"miroir",
"chenil",
"crampe",
"bulle",
"badge",
"nœud",
"colère",
"légume",
"cauchemar ",
"marbre",
"laver",
"poison",
"souris",
"petit",
"feuille",
"piège",
"sables mouvants",
"drôle",
"fouet",
"volcan",
"gomme",
"entreprise",
"cerveau",
"stores",
"flamant",
"panier",
"poumon",
"mendiant",
"toile d'araignée",
"carotte",
"cow-boy",
"torche",
"avion",
"arbre",
"mitaine",
"plume",
"fille",
"Crumbs",
"laitue",
"démanteler",
"train",
"évolution",
"invitation",
"adolescent",
"satellite",
"costume",
"vengeance",
"prix",
"mitaine",
"plume",
"fille",
"Crumbs",
"laitue",
"train",
"évolution",
"portefeuille",
"niveau",
"Mode de vie",
"tachymètre",
"rétrécir",
"charpentier",
"pendule",
"rationaliser",
"invitation",
"adolescent",
"personnel",
"afficher",
"journal",
"alphabet",
"texture",
"jeu",
"négocier",
"université",
"soleil",
"Espace-temps",
"satellite",
"fidélité",
"costume",
"amour",
"vengeance",
"silhouette",
"critiquer",
"tas de sable",
"prix",
"mitaine",
"plume",
"fille",
"Crumbs",
"laitue",
"démanteler",
"train",
"évolution",
"portefeuille",
"niveau",
"robinet",
"police",
"Pompus",
"Sauce tomate",
"application",
"conversation",
"musique",
"arbre",
"explorer",
"limite",
"huile d'olive",
"tachymètre",
"rétrécir",
"charpentier",
"pendule",
"rationaliser",
"invitation",
"laitue",
"démanteler",
"train",
"évolution",
"portefeuille",
"niveau",
"Mozart",
"robinet",
"au chômage",
"île",
"police",
"Sauce tomate",
"application",
"conversation",
"musique",
"arbre",
"explorer",
"limite",
"huile d'olive",
"rétrécir",
"charpentier",
"pendule",
"rationaliser",
"invitation",
"adolescent",
"drapeau",
"personnel",
"afficher",
"journal",
"alphabet",
"bulle",
"mine",
"défaut",
"Chuck norris",
"naufrage",
"Pinboard",
"canal",
"tueur",
"organiser",
"calendrier",
"Zamboni",
"regretter",
"point",
"ciseaux",
"Fleuri"

];

/* 
    "vase",
    "lit",
    "lire",
    "écrire",
    "livre",
    "papier",
    "lettre",
    "quenouille",
    "télévistion",
    "framboise",
    "ballon",
    "voler",
    "clavier",
    "ordinateur",
    "cochon",
    "verre",
    "blonde",
    "douche",
    "balancoire",
 */

var getMot = function(){
    var id = Math.floor(Math.random() * (ListeMot.length) );
    return ListeMot[id];
}


var formateChaine = function(my_string) {
    var new_string = "";
    var pattern_accent = new Array("é", "è", "ê", "ë", "ç", "à", "â", "ä", "î", "ï", "ù", "ô", "ó", "ö","ç",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        " ","-","_");
    var pattern_replace_accent = new Array("e", "e", "e", "e", "c", "a", "a", "a", "i", "i", "u", "o", "o", "o","c",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "","","");
    if (my_string && my_string!= "") {
        new_string = preg_replace (pattern_accent, pattern_replace_accent, my_string);
    }
    return new_string;
}

exports.getMot = getMot;
exports.formateChaine = formateChaine;