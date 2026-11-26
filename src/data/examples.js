const pizzeriaHeroImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=72'

export const examples = [
  {
    number: '01',
    badge: 'Sito reale · WordPress',
    title: 'Il mio sito, una base già online',
    description:
      'Il mio sito attuale è realizzato in WordPress: un esempio concreto di cura della struttura, della gerarchia dei contenuti e della resa da smartphone. Se hai già una base WordPress, possiamo ragionare su come migliorarla; la piattaforma di partenza non definisce da sola la soluzione giusta per il tuo progetto.',
    features: ['Struttura e gerarchia', 'Cura dei contenuti', 'Resa da smartphone'],
    action: 'Parliamo del tuo sito',
    contactMessage: 'Ciao Teresa, vorrei parlare del mio sito e capire come migliorarlo.',
    icon: 'web',
  },
  {
    number: '02',
    type: 'concept',
    badge: 'Concept dimostrativo · Codice proprietario',
    title: 'Pizzeria al taglio e d’asporto',
    description:
      'Non una semplice vetrina: una web app su misura per raccogliere ordini e fasce di ritiro dal telefono, ridurre le telefonate nelle ore di punta e lavorare senza commissioni di intermediazione delle piattaforme terze. Il codice resta un asset tuo, con possibilità di riscatto secondo gli accordi di progetto.',
    features: ['Fasce di ritiro', 'Meno telefonate al banco', 'Codice tuo, riscattabile'],
    action: 'Prova la web app',
    icon: 'smartphone',
    preview: {
      image: pizzeriaHeroImage,
      imageAlt: 'Pizza appena sfornata, immagine del concept dimostrativo',
      brand: 'Forno Cortile · Concept',
      headline: 'Ritiro caldo, senza attese',
      pickup: '19:00',
      order: '3 pezzi',
      ownership: 'Codice tuo',
    },
  },
]

export const pizzeriaDemo = {
  image: pizzeriaHeroImage,
  imageAlt: 'Pizza al taglio appena sfornata nel concept dimostrativo',
  pickupSlots: [
    { id: '18:30', time: '18:30', status: 'Posti liberi' },
    { id: '19:00', time: '19:00', status: 'Ultimi 2 posti' },
    { id: '19:30', time: '19:30', status: 'Disponibile' },
  ],
  initialPickupSlot: '19:00',
  menuItems: [
    {
      id: 'margherita',
      name: 'Margherita al trancio',
      tag: 'Classica',
      description: 'Pomodoro, fiordilatte e basilico',
      price: 3.5,
      image:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=180&q=68',
      imageAlt: 'Pizza margherita',
      accent: 'amber',
    },
    {
      id: 'patate',
      name: 'Patate & Rosmarino',
      tag: 'Croccante',
      description: 'Patate al forno, rosmarino e olio EVO',
      price: 4,
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=180&q=68',
      imageAlt: 'Pizza con condimenti al forno',
      accent: 'terracotta',
    },
    {
      id: 'teglia-mista',
      name: 'Mezza Teglia Mista',
      tag: '6 tranci · Asporto',
      description: 'Sei tranci assortiti, da condividere',
      price: 16,
      image:
        'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=180&q=68',
      imageAlt: 'Teglia di pizza assortita',
      accent: 'gold',
    },
  ],
  initialQuantities: { margherita: 2, patate: 1, 'teglia-mista': 0 },
  quickNotes: [
    'Ben cotta e croccante',
    'Taglio a quadretti',
    'Senza origano',
    'Salsa piccante a parte',
  ],
  initialNotes: ['Ben cotta e croccante'],
  illustrativeCommissionRate: 0.25,
}
