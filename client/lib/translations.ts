export const translations = {
  en: {
    nav: {
      home: "Home",
      track: "Track",
      services: "Services",
      about: "About",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
    },
    hero: {
      title: "Track Your Parcel in Real-Time",
      subtitle: "Global parcel delivery with live GPS tracking, guaranteed safety, and 24/7 support",
      trackButton: "Start Tracking",
      createButton: "Create Shipment",
      trackingBox: "Track Your Package",
     tracking_numberLabel: "Tracking Number",
      trackNowButton: "Track Now",
      dailyShipments: "Daily Shipments",
      countries: "Countries",
      onTime: "On-Time",
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive delivery solutions tailored to your needs",
      localDelivery: "Local Delivery",
      localDeliveryDesc: "Same-day delivery within city limits",
      internationalShipping: "International Shipping",
      internationalShippingDesc: "Worldwide parcel delivery service",
      sameDayExpress: "Same-Day Express",
      sameDayExpressDesc: "Ultra-fast express delivery options",
      fragileHandling: "Fragile Item Handling",
      fragileHandlingDesc: "Specialized care for delicate packages",
      refrigerated: "Refrigerated Shipping",
      refrigeratedDesc: "Temperature-controlled delivery",
      documentDelivery: "Document Delivery",
      documentDeliveryDesc: "Secure important document shipping",
    },
    footer: {
      copyright: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      quickLinks: "Quick Links",
      servicesLabel: "Services",
      contact: "Contact",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      track: "Suivi",
      services: "Services",
      about: "À propos",
      contact: "Contact",
      login: "Connexion",
      signup: "S'inscrire",
    },
    hero: {
      title: "Suivez votre colis en temps réel",
      subtitle: "Livraison mondiale de colis avec suivi GPS en direct, sécurité garantie et support 24/7",
      trackButton: "Commencer le suivi",
      createButton: "Créer un envoi",
      trackingBox: "Suivre votre colis",
    tracking_numberLabel: "Numéro de suivi",
      trackNowButton: "Suivre maintenant",
      dailyShipments: "Envois quotidiens",
      countries: "Pays",
      onTime: "À l'heure",
    },
    services: {
      title: "Nos services",
      subtitle: "Solutions de livraison complètes adaptées à vos besoins",
      localDelivery: "Livraison locale",
      localDeliveryDesc: "Livraison le jour même dans les limites de la ville",
      internationalShipping: "Expédition internationale",
      internationalShippingDesc: "Service de livraison de colis mondial",
      sameDayExpress: "Express le jour même",
      sameDayExpressDesc: "Options de livraison express ultra-rapides",
      fragileHandling: "Manutention d'articles fragiles",
      fragileHandlingDesc: "Soin spécialisé pour les colis délicats",
      refrigerated: "Expédition réfrigérée",
      refrigeratedDesc: "Livraison à température contrôlée",
      documentDelivery: "Livraison de documents",
      documentDeliveryDesc: "Expédition sécurisée de documents importants",
    },
    footer: {
      copyright: "Tous droits réservés.",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions de service",
      quickLinks: "Liens rapides",
      servicesLabel: "Services",
      contact: "Contact",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      track: "Rastrear",
      services: "Servicios",
      about: "Acerca de",
      contact: "Contacto",
      login: "Iniciar sesión",
      signup: "Registrarse",
    },
    hero: {
      title: "Rastra tu paquete en tiempo real",
      subtitle: "Entrega global de paquetes con rastreo GPS en directo, seguridad garantizada y soporte 24/7",
      trackButton: "Comenzar rastreo",
      createButton: "Crear envío",
      trackingBox: "Rastrear tu paquete",
      tracking_numberLabel: "Número de rastreo",
      trackNowButton: "Rastrear ahora",
      dailyShipments: "Envíos diarios",
      countries: "Países",
      onTime: "A tiempo",
    },
    services: {
      title: "Nuestros servicios",
      subtitle: "Soluciones de entrega completas adaptadas a tus necesidades",
      localDelivery: "Entrega local",
      localDeliveryDesc: "Entrega el mismo día dentro de los límites de la ciudad",
      internationalShipping: "Envío internacional",
      internationalShippingDesc: "Servicio de entrega de paquetes a nivel mundial",
      sameDayExpress: "Express el mismo día",
      sameDayExpressDesc: "Opciones de entrega express ultrarrápida",
      fragileHandling: "Manejo de artículos frágiles",
      fragileHandlingDesc: "Cuidado especializado para paquetes delicados",
      refrigerated: "Envío refrigerado",
      refrigeratedDesc: "Entrega con control de temperatura",
      documentDelivery: "Entrega de documentos",
      documentDeliveryDesc: "Envío seguro de documentos importantes",
    },
    footer: {
      copyright: "Todos los derechos reservados.",
      privacyPolicy: "Política de privacidad",
      termsOfService: "Términos de servicio",
      quickLinks: "Enlaces rápidos",
      servicesLabel: "Servicios",
      contact: "Contacto",
    },
  },
};

export type LanguageCode = keyof typeof translations;

export const getTranslation = (path: string, lang: LanguageCode = "en"): string => {
  const keys = path.split(".");
  let value: any = translations[lang];

  for (const key of keys) {
    value = value?.[key];
    if (!value) return path;
  }

  return value;
};
