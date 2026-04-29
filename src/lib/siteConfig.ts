export const siteConfig = {
  name: "Delos Lounge & Dining",
  shortName: "Delos",
  tagline: "Premium African Dining, Shisanyama & Cocktail Lounge",
  description:
    "Premium African dining, shisanyama, cocktails and lounge culture in Morningside, Durban. Book a table, view our menu, order delivery or enquire about private events.",
  url: "https://www.deloslounge.co.za",
  address: {
    street: "362 Lilian Ngoyi Road",
    suburb: "Morningside",
    city: "Durban",
    province: "KwaZulu-Natal",
    country: "South Africa",
    postalCode: "4001",
    full: "362 Lilian Ngoyi Road, Morningside, Durban, KwaZulu-Natal",
    googleMapsUrl:
      "https://maps.google.com/?q=Delos+Lounge+362+Lilian+Ngoyi+Road+Morningside+Durban",
  },
  contact: {
    phone: "+27 81 506 5898",
    phoneSecondary: "+27 65 821 2591",
    whatsapp: "+27 81 506 5898",
    whatsappUrl:
      "https://wa.me/27815065898?text=Hi%2C+I%27d+like+to+contact+Delos+Lounge+%26+Dining.",
    email: "info@deloslounge.co.za",
    bookingEmail: "bookings@deloslounge.co.za",
    eventsEmail: "events@deloslounge.co.za",
  },
  hours: {
    monday: "08:00 – 20:00",
    tuesday: "10:00 – 20:45",
    wednesday: "10:00 – 20:45",
    thursday: "10:00 – 20:45",
    friday: "10:00 – 21:15",
    saturday: "10:00 – 21:30",
    sunday: "10:00 – 21:00",
    display: [
      { days: "Monday", hours: "08:00 – 20:00" },
      { days: "Tue – Thu", hours: "10:00 – 20:45" },
      { days: "Friday", hours: "10:00 – 21:15" },
      { days: "Saturday", hours: "10:00 – 21:30" },
      { days: "Sunday", hours: "10:00 – 21:00" },
    ],
  },
  social: {
    instagram: "https://www.instagram.com/lions_of_delos/",
    facebook: "https://www.facebook.com/p/DELOS-Lounge-61566014750224/",
    tiktok: "https://www.tiktok.com/@delos.lounge",
    threads: "https://www.threads.com/@lions_of_delos",
  },
  delivery: {
    uberEats:
      "https://www.ubereats.com/za/store/delos-lounge-and-dining/kqV-rQj5Qe2jo9IDb_Fqyg",
    mrDelivery:
      "https://www.mrd.com/delivery/restaurant/delos-lounge-dining-morningside/33228",
  },
  booking: {
    url: "https://wa.me/27815065898?text=Hi%2C+I%27d+like+to+make+a+booking+at+Delos+Lounge+%26+Dining.",
    opensTable: null,
  },
  reviewsUrl: "https://maps.google.com/?q=Delos+Lounge+362+Lilian+Ngoyi+Road+Morningside+Durban",
  // Direct ordering pricing — designed to undercut Uber Eats / Mr D's ~30% take.
  // Adjust these once Delos confirms final pricing strategy.
  directOrder: {
    serviceFeePercent: 5, // 5% direct service fee vs ~30% on marketplaces
    deliveryFee: 35, // flat ZAR delivery fee (manual delivery)
    freeDeliveryThreshold: 500, // free delivery on orders >= R500
    minOrder: 80, // minimum order to checkout
    collectionPrepMinutes: 25,
    deliveryPrepMinutes: 45,
    deliveryNote: "Delivery available in Morningside and selected nearby suburbs. Confirm via WhatsApp on submit.",
    valueMessage: "Order direct and support Delos. Lower fees mean more of your order goes to the kitchen.",
  },
};

export type SiteConfig = typeof siteConfig;
