// Reviews shown on the site.
//
// IMPORTANT: do not invent named Google reviews. Only add entries here when
// you have a verifiable source (Google profile, social post, signed
// testimonial). The current entries are sourced from public social media
// mentions of @delos.lounge / @lions_of_delos and from coverage by Durban
// food creators. Update `source` and `sourceUrl` when adding more.

export type Review = {
  id: string;
  /** Pull-quote from the source — keep short, edit lightly for grammar only. */
  quote: string;
  /** Display name. Use first name + last initial, or social handle. */
  author: string;
  /** Where this came from, e.g. "TikTok review", "Instagram comment". */
  source: string;
  /** Optional link to the original post. Helps verification. */
  sourceUrl?: string;
  /** Highlight tag shown above the quote. */
  tag?: "Bottomless brunch" | "Sunday brunch" | "Atmosphere" | "Food" | "Service";
};

export const reviews: Review[] = [
  {
    id: "r1",
    quote:
      "I visited Delos Lounge and what an amazing time I had. A definite must visit.",
    author: "TikTok creator",
    source: "TikTok mention",
    sourceUrl: "https://www.tiktok.com/discover/delos-lounge-and-dining-durban",
    tag: "Atmosphere",
  },
  {
    id: "r2",
    quote:
      "Delicious dishes and a vibrant atmosphere — perfect for food lovers. A must-visit foodie destination in Durban.",
    author: "Durban food community",
    source: "Social media",
    sourceUrl: "https://www.tiktok.com/discover/delos-lounge-and-dining-durban",
    tag: "Food",
  },
  {
    id: "r3",
    quote:
      "Bottomless Brunch at Delos Lounge — a review of the feast. Big platters, great vibes.",
    author: "@_amanda_kayy_",
    source: "TikTok review",
    sourceUrl:
      "https://www.tiktok.com/@_amanda_kayy_/video/7485070707387403526",
    tag: "Bottomless brunch",
  },
  {
    id: "r4",
    quote:
      "Sunday, done right. Live music, food platters, big vibes, pure luxury.",
    author: "@delos.lounge",
    source: "Instagram & TikTok",
    sourceUrl: "https://www.instagram.com/lions_of_delos/",
    tag: "Sunday brunch",
  },
];
