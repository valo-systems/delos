export type Event = {
  id: string;
  title: string;
  description: string;
  date?: string;
  time?: string;
  price?: string;
  type: "regular" | "special" | "private";
  image?: string;
};

export const upcomingEvents: Event[] = [
  {
    id: "event-1",
    title: "Friday Night Lounge",
    description:
      "End your week in style. Live music, curated cocktails, and the full Delos menu. Dress smart casual. Tables available from 18:00.",
    time: "18:00 – Late",
    price: "No cover charge. Bookings recommended.",
    type: "regular",
  },
  {
    id: "event-2",
    title: "Saturday Shisanyama Sessions",
    description:
      "The full open-flame experience. Live grill from 14:00, DJ from 17:00, and the best shisanyama in Morningside. Walk-ins welcome, reservations advised.",
    time: "14:00 – Late",
    price: "No cover charge",
    type: "regular",
  },
  {
    id: "event-3",
    title: "Sunday Brunch & Jazz",
    description:
      "A laid-back Sunday experience. Full brunch menu, bottomless mimosas, and live jazz. The perfect end to the weekend.",
    time: "11:00 – 16:00",
    price: "R250 per person (bottomless mimosas). Booking essential.",
    type: "regular",
  },
];

export const privateFunctions = {
  heading: "Private Functions & Group Bookings",
  intro:
    "Delos is the ideal venue for birthdays, corporate events, private dinners, and group celebrations. Our events team will work with you to create a personalised experience from menu selection to décor and entertainment.",
  packages: [
    {
      id: "pkg-1",
      name: "Birthday Celebration Package",
      description:
        "Exclusive seating, personalised décor, custom menu selection, and a dedicated host for your birthday group. Minimum 10 guests.",
      includes: [
        "Reserved private or semi-private area",
        "Custom menu selection",
        "Personalised birthday setup",
        "Dedicated event host",
        "Complimentary birthday dessert",
      ],
    },
    {
      id: "pkg-2",
      name: "Corporate Dining & Events",
      description:
        "Impress your clients and team with a premium dining experience. Full AV support, custom menu, and private seating arrangements available.",
      includes: [
        "Private dining room",
        "Custom menu (set or à la carte)",
        "AV support available",
        "Dedicated event coordinator",
        "Branded menus available",
      ],
    },
    {
      id: "pkg-3",
      name: "Group Shisanyama Package",
      description:
        "Bring your crew for the ultimate group shisanyama experience. Perfect for groups of 10–50+. Includes open grill, live DJ, and full package options.",
      includes: [
        "Reserved outdoor/semi-outdoor shisanyama area",
        "Full shisanyama spread (customisable)",
        "Live DJ or playlist setup",
        "Full bar access",
        "Group cocktail welcome drink",
      ],
    },
  ],
};
