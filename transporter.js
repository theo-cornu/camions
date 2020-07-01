// J'importe marketEvent de offer-emmitter
const {marketEvent} = require('./offer-emmitter');

// Je crée un dictionnaire
const transporterStuff = {
  capital: 0,
  fuelPrice: 0.6,
  trucks: 2
};

// J'initialise les caractéristique des camions
const initTrucks = {
  size: 70,
  fuel: 700 // La distance qu'il peut parcourir
};

// C'est le thread, on le fait patienter le temps du trajet * 500
const displayOffer = (offer) => {
  setTimeout(() => offerGot(offer), offer.travel * 500);
};

// J'affiche l'offre qu'on a traité
const offerGot = (offer) => {
  const resultOffer = offer.pricePerBox * offer.boxes - offer.travel * 0.25;
  if (resultOffer >= 0) {
    transporterStuff.capital += resultOffer; // J'ajoute le resultat de la course au capital
    initTrucks.fuel -= offer.travel * 0.2; // J'enleve l'essence du camion
    console.log('Nous avons traité cette offre:', offer);
    console.log('capital', transporterStuff.capital);
    initTransporter(); // Je rajoute le camion parti à la flotte de camion
    console.log('Le c15 est de retour');
  }
};

// Pour envoyer les camions
const sendTrucks = (offer) => {
  if (transporterStuff.trucks > 0) {
    // On vérifie s'il y a des camions de dispo
    calcOffer(offer); // Si oui on lance les verifs de calcOffer
    console.log(
      '#################Il y a',
      transporterStuff.trucks,
      'camion dispo######################'
    );
  } else if (transporterStuff.trucks === 0) {
    // S'il n'y a plus de camion, on ne récupère plus d'offre
    console.log("Aucune cariole n'est dispo");
  }
};

// Pour faire les verifs pour savoir si on peut envoyer le camion ou non
const calcOffer = (offer) => {
  const check = offer.pricePerBox * offer.boxes - offer.travel * 0.25;
  console.log('Potentiel de la course:', check); // On regarde combien la course va nous rapporter
  if (initTrucks.size >= offer.boxes && initTrucks.fuel >= offer.travel) {
    // Si le camion peut prendre toutes les boxes et qu'il peut parcourir toute la distance
    if (check >= 0) {
      displayOffer(offer); // J'appel display offer pour afficher l'offre une fois la course terminée
      busyTransporter(); // J'enlève un camion de la flotte quand il est parti
      console.log("j'envoie le c15!");
    } else {
      // Ici la course n'est pas assez rentable < 0
      console.log("La course n'est pas assez rentable");
    }
  } else if (initTrucks.size <= offer.boxes) {
    // Le camion ne peut pas prendre toutes les offres
    console.log('Le camion ne peut pas prendre toute la commande');
  } else if (initTrucks.fuel < offer.travel) {
    // Le camion ne peut pas faire tout le trajet
    console.log('le camion ne peut pas faire un si long trajet');
    if (initTrucks.fuel !== 700) {
      // Si le camion a deja fait une course, on refait le plein
      console.log("j'ai refais le plein, le camion peut partir");
      transporterStuff.capital -=
        transporterStuff.fuelPrice * (700 - initTrucks.fuel); // On enleve le prix de l'essence du capital
      initTrucks.fuel = 700;
      console.log('capital après le plein :', transporterStuff.capital);
    }
  }
};

marketEvent.on('New Offer', sendTrucks); // Quand il va y avoir une annonce on appelle sendTrucks pour verif s'il y a des camions de dispo pour ensuite lancer toutes les verifs

// Pour ajouter un camion quand il rentre
const initTransporter = () => {
  transporterStuff.trucks += 1; // On ajoute +1 au dictionnaire
  console.log(transporterStuff);
};

// Pour enlever un camion de la flotte quand il est partit
const busyTransporter = () => {
  transporterStuff.trucks -= 1;
};
