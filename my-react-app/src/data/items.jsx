import tanktop from "../assets/tanktop.png";
import appleShelf from "../assets/apple.png";
import bookmark from "../assets/bookmark.png";
import glass from "../assets/jar.png";
import scrap from "../assets/hearts.png";
import bottle from "../assets/planter.png";
import jean from "../assets/wallet.png";
import vase from "../assets/vase.png";
import earrings from "../assets/earrings.png";
import cd from "../assets/cd.png";
import watch from "../assets/watch earrings.png";
import table from "../assets/table.png";
import sprinkler from "../assets/sprinkler.png";
import lights from "../assets/lights.png";

export const CATEGORIES = [
  "All",
  "Fabric",
  "Bottles",
  "Boxes",
  "Wood",
  "Glass",
  "Scraps",
  "Misc.",
];

// Bento layout perfectly matching reference image
// Grid: 10 columns (4:3:3 ratio) × 10 rows (1:1 overall aspect ratio)
export const LAYOUT = {
  fabricTote: "md:[grid-column:1/span_3] md:[grid-row:1/span_4]",
  appleShelf: "md:[grid-column:4/span_2] md:[grid-row:1/span_2]",
  fabricBookmark: "md:[grid-column:4/span_2] md:[grid-row:3/span_2]",
  stampGlass: "md:[grid-column:6/span_2] md:[grid-row:1/span_3]",
  scrapHearts: "md:[grid-column:8/span_2] md:[grid-row:1/span_3]",
  planterBottle: "md:[grid-column:10/span_3] md:[grid-row:1/span_2]",
  jeanWallet: "md:[grid-column:10/span_3] md:[grid-row:3/span_3]",

  plasticVases: "md:[grid-column:1/span_5] md:[grid-row:5/span_3]",
  earringsGoogly: "md:[grid-column:6/span_4] md:[grid-row:4/span_2]",
  cd: "md:[grid-column:6/span_2] md:[grid-row:6/span_2]",
  violinEarrings: "md:[grid-column:8/span_2] md:[grid-row:6/span_2]",

  plasticBottleSprinkler: "md:[grid-column:1/span_4] md:[grid-row:8/span_3]",
  plasticBottleLights: "md:[grid-column:5/span_5] md:[grid-row:8/span_3]",
  vinylCoffeeTable: "md:[grid-column:10/span_3] md:[grid-row:6/span_5]",
};

// Items derived from reference image
export const ITEMS = [
  {
    id: "1",
    title: "Fabric Scrap Fruit Tank Tops",
    category: "Fabric",
    liked: true,
    src: tanktop,
    layoutKey: "fabricTote",
  },
  {
    id: "2",
    title: "Cardboard Apple Shelf",
    category: "Boxes",
    liked: false,
    src: appleShelf,
    layoutKey: "appleShelf",
  },
  {
    id: "3",
    title: "Fabric Bookmark",
    category: "Fabric",
    liked: false,
    src: bookmark,
    layoutKey: "fabricBookmark",
  },
  {
    id: "4",
    title: "Stamp Glass Jars",
    category: "Glass",
    liked: false,
    src: glass,
    layoutKey: "stampGlass",
  },
  {
    id: "5",
    title: "Scrap Hearts",
    category: "Scraps",
    liked: false,
    src: scrap,
    layoutKey: "scrapHearts",
  },
  {
    id: "6",
    title: "Planter Bottle",
    category: "Bottles",
    liked: true,
    src: bottle,
    layoutKey: "planterBottle",
  },
  {
    id: "7",
    title: "Jean Wallet",
    category: "Fabric",
    liked: false,
    src: jean,
    layoutKey: "jeanWallet",
  },
  {
    id: "8",
    title: "Artistic Can Vases",
    category: "Misc.",
    liked: false,
    src: vase,
    layoutKey: "plasticVases",
  },
  {
    id: "9",
    title: "Bread Clip Googly Eye Earrings",
    category: "Misc.",
    liked: false,
    src: earrings,
    layoutKey: "earringsGoogly",
  },
  {
    id: "10",
    title: "CD",
    category: "Misc.",
    liked: false,
    src: cd,
    layoutKey: "cd",
  },
  {
    id: "11",
    title: "Watch Earrings",
    category: "Misc.",
    liked: true,
    src: watch,
    layoutKey: "violinEarrings",
  },
  {
    id: "12",
    title: "Plastic Bottle Sprinkler",
    category: "Bottles",
    liked: false,
    src: sprinkler,
    layoutKey: "plasticBottleSprinkler",
  },
  {
    id: "13",
    title: "Vinyl Coffee Table",
    category: "Misc.",
    liked: true,
    src: table,
    layoutKey: "vinylCoffeeTable",
  },
  {
    id: "14",
    title: "Plastic Bottle Lights",
    category: "Bottles",
    liked: false,
    src: lights,
    layoutKey: "plasticBottleLights",
  },
];
