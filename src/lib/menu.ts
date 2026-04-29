export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  servingInfo?: string;
  availableDays?: string;
  tags: Array<"signature" | "bestseller" | "spicy" | "seafood" | "vegetarian" | "traditional" | "new">;
  notes?: string;
};

export const menuCategories = [
  { id: "all", label: "All" },
  { id: "starters", label: "Starters" },
  { id: "traditional", label: "Traditional" },
  { id: "shisanyama", label: "Shisanyama" },
  { id: "mains", label: "Mains" },
  { id: "seafood", label: "Seafood" },
  { id: "breakfast", label: "Breakfast" },
  { id: "platters", label: "Platters" },
  { id: "cocktails", label: "Cocktails" },
  { id: "mocktails", label: "Mocktails" },
  { id: "drinks", label: "Drinks" },
];

export const menuItems: MenuItem[] = [
  // STARTERS
  {
    id: "starter-1",
    name: "Delos Sharing Board",
    category: "starters",
    description: "A curated selection of house dips, grilled pita, pickled vegetables, and marinated olives. The perfect start to any Delos experience.",
    price: 165,
    servingInfo: "Serves 2–4",
    tags: ["bestseller"],
  },
  {
    id: "starter-2",
    name: "Grilled Chicken Livers",
    category: "starters",
    description: "Pan-grilled chicken livers in a spiced peri-peri and cream sauce, served with toasted ciabatta.",
    price: 95,
    tags: ["spicy", "traditional"],
  },
  {
    id: "starter-3",
    name: "Prawn Skewers",
    category: "starters",
    description: "Marinated king prawns grilled on open flame, served with garlic butter and lemon.",
    price: 145,
    tags: ["seafood", "signature"],
  },

  // TRADITIONAL
  {
    id: "traditional-1",
    name: "Oxtail",
    category: "traditional",
    description: "Slow-braised oxtail in a rich, spiced tomato and red wine gravy, served with stiff pap and chakalaka. A Delos classic.",
    price: 295,
    servingInfo: "Single portion",
    tags: ["signature", "bestseller", "traditional"],
  },
  {
    id: "traditional-2",
    name: "Lamb Curry",
    category: "traditional",
    description: "Tender lamb slow-cooked in a fragrant Durban-style curry with tomatoes, onions, and aromatic spices. Served with rice or roti.",
    price: 265,
    tags: ["signature", "spicy", "traditional"],
  },
  {
    id: "traditional-3",
    name: "Umgxabhiso",
    category: "traditional",
    description: "Traditional umgxabhiso (samp and beans) slow-cooked until perfectly tender, served with grilled meat of your choice.",
    price: 220,
    tags: ["traditional", "vegetarian"],
    notes: "Ask your server about the daily meat pairing.",
  },
  {
    id: "traditional-4",
    name: "Usu Nethumbu",
    category: "traditional",
    description: "A beloved traditional dish. Tripe and trotters slow-cooked with spices, served with pap and spinach. Soul food at its finest.",
    price: 195,
    tags: ["traditional"],
  },
  {
    id: "traditional-5",
    name: "Braised Short Rib",
    category: "traditional",
    description: "Slow-braised beef short rib in a dark beer and herb sauce, falling off the bone, served with creamy mashed potato.",
    price: 285,
    tags: ["signature"],
  },

  // SHISANYAMA
  {
    id: "shisa-1",
    name: "Shisanyama for Two",
    category: "shisanyama",
    description: "A generous mixed grill selection for two. Boerewors, lamb chops, chicken pieces, and pork rashers, all grilled over open flame. Served with pap, chakalaka, and house salad.",
    price: 490,
    servingInfo: "Serves 2",
    tags: ["signature", "bestseller"],
  },
  {
    id: "shisa-2",
    name: "Shisanyama for Four",
    category: "shisanyama",
    description: "The full Delos shisanyama feast for four. A spread of boerewors, lamb chops, chicken drumsticks, pork ribs, and wors, grilled to perfection. Served with pap, salads, and chakalaka.",
    price: 890,
    servingInfo: "Serves 4",
    tags: ["signature", "bestseller"],
  },
  {
    id: "shisa-3",
    name: "Shisanyama for Six",
    category: "shisanyama",
    description: "Our grand shisanyama spread for six. Ideal for group celebrations. A full mix of lamb, chicken, beef, and pork from the grill, with all the sides.",
    price: 1250,
    servingInfo: "Serves 6",
    tags: ["signature"],
  },
  {
    id: "shisa-4",
    name: "Boerewors Roll",
    category: "shisanyama",
    description: "Premium farm-style boerewors on a toasted roll with house chakalaka and your choice of sauce.",
    price: 95,
    tags: [],
  },
  {
    id: "shisa-5",
    name: "Lamb Chops",
    category: "shisanyama",
    description: "Marinated lamb loin chops grilled over flame, served with chips or pap and chakalaka.",
    price: 265,
    tags: ["bestseller"],
  },

  // MAINS
  {
    id: "main-1",
    name: "Chicken & Prawn Curry",
    category: "mains",
    description: "Succulent chicken pieces and king prawns cooked together in a rich Durban curry sauce. Served with basmati rice and roti.",
    price: 275,
    tags: ["signature", "spicy", "seafood"],
  },
  {
    id: "main-2",
    name: "Grilled Half Chicken",
    category: "mains",
    description: "Herb-marinated half chicken grilled to golden perfection, served with chips, pap, or rice and your choice of sauce.",
    price: 195,
    tags: ["bestseller"],
  },
  {
    id: "main-3",
    name: "Ribeye Steak",
    category: "mains",
    description: "300g prime ribeye steak, grilled to your liking, served with hand-cut chips, grilled tomato, and mushroom sauce.",
    price: 345,
    tags: ["signature"],
  },
  {
    id: "main-4",
    name: "Peri-Peri Prawns",
    category: "mains",
    description: "Plump king prawns tossed in a fiery house peri-peri sauce, served with rice and garlic bread.",
    price: 295,
    tags: ["seafood", "spicy"],
  },

  // SEAFOOD
  {
    id: "seafood-1",
    name: "Delos Seafood Pasta",
    category: "seafood",
    description: "Linguine tossed with prawns, calamari, and mussels in a light white wine and tomato cream sauce. Finished with fresh herbs and parmesan.",
    price: 265,
    tags: ["signature", "seafood"],
  },
  {
    id: "seafood-2",
    name: "Grilled Linefish",
    category: "seafood",
    description: "Fresh Durban linefish grilled with lemon butter and herbs, served with seasonal vegetables and your choice of starch.",
    price: 245,
    tags: ["seafood"],
    notes: "Fish changes daily based on availability.",
  },
  {
    id: "seafood-3",
    name: "Calamari",
    category: "seafood",
    description: "Lightly dusted calamari. Grilled or fried. Served with a house tartar sauce and lemon wedges.",
    price: 195,
    tags: ["seafood", "bestseller"],
  },

  // BREAKFAST
  {
    id: "breakfast-1",
    name: "Delos Full Breakfast",
    category: "breakfast",
    description: "Eggs your way, grilled boerewors, back bacon, sautéed mushrooms, roasted tomato, and toast. A proper South African start.",
    price: 165,
    availableDays: "Saturday & Sunday from 11:00",
    tags: ["bestseller"],
  },
  {
    id: "breakfast-2",
    name: "Avocado & Egg Toast",
    category: "breakfast",
    description: "Smashed avocado on thick-cut sourdough with poached eggs, chilli flakes, and lemon zest.",
    price: 125,
    availableDays: "Saturday & Sunday from 11:00",
    tags: [],
  },
  {
    id: "breakfast-3",
    name: "Shakshuka",
    category: "breakfast",
    description: "Eggs poached in a spiced tomato and pepper sauce with feta, fresh herbs, and warm pita.",
    price: 135,
    availableDays: "Saturday & Sunday from 11:00",
    tags: ["spicy", "vegetarian"],
  },

  // PLATTERS
  {
    id: "platter-1",
    name: "Delos Meat Platter",
    category: "platters",
    description: "The ultimate group meat experience. A lavish selection of grilled lamb, beef, chicken, pork, and boerewors on a sharing board, with sauces, pap, and salads.",
    price: 1450,
    servingInfo: "Serves 6–8",
    tags: ["signature", "bestseller"],
  },
  {
    id: "platter-2",
    name: "Seafood Platter",
    category: "platters",
    description: "A spectacular spread of grilled prawns, calamari, linefish, and mussels on a sharing board with garlic butter, lemon, and house sauces.",
    price: 1250,
    servingInfo: "Serves 4–6",
    tags: ["signature", "seafood"],
  },
  {
    id: "platter-3",
    name: "Shisanyama & Seafood Combo",
    category: "platters",
    description: "Can't choose? Have both. A mix of grilled meats and fresh seafood for the ultimate Delos group experience.",
    price: 1650,
    servingInfo: "Serves 6–8",
    tags: ["signature", "seafood"],
  },

  // COCKTAILS
  {
    id: "cocktail-1",
    name: "Delos Gold",
    category: "cocktails",
    description: "Our signature house cocktail. Premium bourbon, honey syrup, fresh lemon, and bitters. Served on the rocks.",
    price: 125,
    tags: ["signature", "bestseller"],
    notes: "Contains alcohol",
  },
  {
    id: "cocktail-2",
    name: "African Sunset",
    category: "cocktails",
    description: "A vibrant blend of Campari, passion fruit, mango, and prosecco. As beautiful as a Durban sunset.",
    price: 120,
    tags: ["signature"],
    notes: "Contains alcohol",
  },
  {
    id: "cocktail-3",
    name: "Morningside Mule",
    category: "cocktails",
    description: "Premium vodka, fresh ginger beer, lime, and mint. Crisp, refreshing, and dangerously drinkable.",
    price: 115,
    tags: ["bestseller"],
    notes: "Contains alcohol",
  },
  {
    id: "cocktail-4",
    name: "Dark & Smoky",
    category: "cocktails",
    description: "Aged dark rum, smoked sugar syrup, angostura bitters, and orange peel. Sophisticated and bold.",
    price: 130,
    tags: ["signature"],
    notes: "Contains alcohol",
  },
  {
    id: "cocktail-5",
    name: "Spiced Margarita",
    category: "cocktails",
    description: "Tequila, triple sec, fresh lime juice, and jalapeño-infused syrup. Heat meets citrus.",
    price: 125,
    tags: ["spicy"],
    notes: "Contains alcohol",
  },

  // MOCKTAILS
  {
    id: "mocktail-1",
    name: "Delos Sunrise",
    category: "mocktails",
    description: "Fresh orange juice, grenadine, and a splash of passion fruit. Non-alcoholic and stunning.",
    price: 75,
    tags: [],
  },
  {
    id: "mocktail-2",
    name: "Mint & Mango Cooler",
    category: "mocktails",
    description: "Muddled fresh mint, mango purée, lime, and sparkling water. Refreshing and fragrant.",
    price: 70,
    tags: ["bestseller"],
  },

  // DRINKS
  {
    id: "drinks-1",
    name: "Craft Beer Selection",
    category: "drinks",
    description: "Ask your server for today's local and imported craft beer selection.",
    price: 65,
    tags: [],
    notes: "Contains alcohol. Prices may vary.",
  },
  {
    id: "drinks-2",
    name: "House Wine (Glass)",
    category: "drinks",
    description: "Carefully selected South African red, white, or rosé by the glass.",
    price: 85,
    tags: [],
    notes: "Contains alcohol",
  },
  {
    id: "drinks-3",
    name: "Soft Drinks",
    category: "drinks",
    description: "Coca-Cola, Sprite, Fanta, Appletizer, still and sparkling water.",
    price: 35,
    tags: [],
  },
];

export function getMenuByCategory(category: string): MenuItem[] {
  if (category === "all") return menuItems;
  return menuItems.filter((item) => item.category === category);
}

export function getSignatureDishes(): MenuItem[] {
  return menuItems.filter((item) => item.tags.includes("signature"));
}

export function getBestsellers(): MenuItem[] {
  return menuItems.filter((item) => item.tags.includes("bestseller"));
}
