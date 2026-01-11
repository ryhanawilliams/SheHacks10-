// items.js
import tanktop from "../assets/tanktop.jpg";
import tanktop0 from "../assets/tanktop0.jpg";
import tanktop1 from "../assets/tanktop1.jpg";
import tanktop2 from "../assets/tanktop2.jpg";
import tanktop3 from "../assets/tanktop3.jpg";
import appleShelf from "../assets/apple.jpg";
import apple0 from "../assets/apple0.jpg";
import apple1 from "../assets/apple1.jpg";
import apple2 from "../assets/apple2.jpg";
import apple3 from "../assets/apple3.jpg";

import bookmark from "../assets/bookmark.jpg";
import bookmark0 from "../assets/bookmark0.jpg";
import bookmark1 from "../assets/bookmark1.jpg";
import bookmark2 from "../assets/bookmark2.jpg";

import glass from "../assets/jar.jpg";
import glass0 from "../assets/jar0.jpg";
import glass1 from "../assets/jar1.jpg";
import glass2 from "../assets/jar2.jpg";
import glass3 from "../assets/jar3.jpg";

import scrap from "../assets/hearts.jpg";
import scrap0 from "../assets/hearts0.jpg";
import scrap1 from "../assets/hearts1.jpg";
import scrap2 from "../assets/hearts2.jpg";
import scrap3 from "../assets/hearts3.jpg";

import bottle from "../assets/planter.jpg";
import bottle0 from "../assets/planter0.jpg";
import bottle1 from "../assets/planter1.jpg";
import bottle2 from "../assets/planter2.jpg";
import bottle3 from "../assets/planter3.jpg";


import jean from "../assets/wallet.jpg";
import jean0 from "../assets/wallet0.jpg";
import jean1 from "../assets/wallet1.jpg";
import jean2 from "../assets/wallet2.jpg";
import jean3 from "../assets/wallet3.jpg";

import vase from "../assets/vase.jpg";
import vase0 from "../assets/vase0.jpg";
import vase1 from "../assets/vase1.jpg";
import vase2 from "../assets/vase2.jpg";
import vase3 from "../assets/vase3.jpg";

import earrings from "../assets/earrings.jpg";
import earrings0 from "../assets/earrings0.jpg";
import earrings1 from "../assets/earrings1.jpg";
import earrings2 from "../assets/earrings2.jpg";

import cd from "../assets/cd.jpg";
import cd0 from "../assets/cd0.jpg";
import cd1 from "../assets/cd1.jpg";
import cd2 from "../assets/cd2.jpg";
import cd3 from "../assets/cd3.jpg";

import watch from "../assets/watch earrings.jpg";
import watch0 from "../assets/watch earrings0.jpg";
import watch1 from "../assets/watch earrings1.jpg";
import watch2 from "../assets/watch earrings2.jpg";

import table from "../assets/table.jpg";
import table0 from "../assets/table0.jpg";
import table1 from "../assets/table1.jpg";
import table2 from "../assets/table2.jpg";
import table3 from "../assets/table3.jpg";

import sprinkler from "../assets/sprinkler.JPG";

import lights from "../assets/lights.jpg";
import lights0 from "../assets/lights0.jpg";
import lights1 from "../assets/lights1.jpg";
import lights2 from "../assets/lights2.jpg";
import lights3 from "../assets/lights3.jpg";
import lights4 from "../assets/lights4.jpg";

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
    title: "Fabric Spring Fruit Tote Tops",
    category: "Fabric",
    liked: true,
    src: tanktop,
    layoutKey: "fabricTote",
    tutorial: {
      title: "Fabric Spring Fruit Tote Tops",
      hero: { src: tanktop, alt: "Fabric Spring Fruit Tote Tops" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "15-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "The Pattern",
            body: "Choose a simple \"Tank Top\" or \"Boxy Tee\" pattern. If you don't have one, you can trace a shirt you already own (adding 1.5cm for \"seam allowance\" all around).",
          },
          {
            title: "Fabric Choice",
            body: "Use Cotton Poplin or Linen for the fruity patches, as they are stable and won't fray as much as knits.",
          },
          {
            title: "Pre-Wash",
            body: "Always wash your fabrics first! Different fabrics shrink at different rates; you don't want your strawberry to shrink and pull the shirt fabric after the first wash.",
          },
        ],
        image: { src: tanktop0, alt: "Templates and fabric preparation" },

      },
      steps: [
        {
          title: "Templates",
          intro: "Draft Your Shapes: On a piece of paper, draw your fruit (strawberry or lemon) and its corresponding leaf. Cut these out to use as stencils.",
          bullets: [
            "Prep the Appliqué Fabric: Choose your scraps (gingham for the fruit, green for the leaf).",
            "Tip: If you want the fruit to be sturdy, iron fusible web (like HeatnBond) to the back of the scraps before cutting.",
            "Cut the Fruit: Trace your paper stencils onto the fabric and cut them out. You should have a separate fabric piece for the fruit body and the leaf.",
          ],
          image: { src: tanktop1, alt: "Templates and fabric preparation" },
        },
        {
          title: "Sewing the Motifs",
          intro: "You have two main options for the \"embroidery\" look using a sewing machine:",
          bullets: [
            "The Zig-Zag (Appliqué) Stitch: Set your machine to a very short width and short length (satin stitch). This covers the raw edges of the fabric completely so they never fray.",
            "The Straight Stitch (Free Motion): Use a straight stitch about 2mm from the edge. This allows the edges to fray slightly for a \"handmade\" look, similar to your reference photo.",
          ],
          image: { src: tanktop2, alt: "Sewing the motifs" },
        },
        {
          title: "Add Finishing Touches",
          intro: "Personalize your creation with decorative elements.",
          bullets: [
            "Add any embellishments or decorations",
            "Trim any excess material",
            "Give it a final inspection",
          ],
          image: { src: tanktop3, alt: "Finishing touches" },
        },
      ],
    },
  },
  {
    id: "2",
    title: "Cardboard Apple Shelf",
    category: "Boxes",
    liked: false,
    src: appleShelf,
    layoutKey: "appleShelf",
    tutorial: {
      title: "Cardboard Apple Shelf",
      hero: { src: appleShelf, alt: "Cardboard Apple Shelf" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "20-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create a functional and decorative shelf from cardboard boxes, perfect for displaying items or organizing your space.",
          },
          {
            title: "Materials",
            bullets: ["Sturdy cardboard boxes", "Box cutter or utility knife", "Ruler and pencil", "Strong glue or heavy-duty tape", "Paint and brushes (optional)"],
          },
        ]
        ,
        image: { src: apple0, alt: "Templates and fabric preparation" },


      },
      steps: [
        {
          title: "Design and cut pieces",
          intro: "Plan your shelf design and cut all necessary cardboard pieces.",
          bullets: ["Measure and mark shelf dimensions", "Cut main shelf pieces", "Cut support brackets", "Cut decorative apple shapes if desired"],
          image: { src: apple1, alt: "Cutting cardboard pieces" },
        },
        {
          title: "Assemble the shelf",
          intro: "Construct the shelf structure using glue or tape.",
          bullets: ["Attach support brackets to back piece", "Secure shelf pieces in place", "Reinforce all joints", "Let glue dry completely"],
          image: { src: apple2, alt: "Assembling the shelf" },
        },
        {
          title: "Decorate and finish",
          intro: "Add decorative elements and finish your shelf.",
          bullets: ["Paint the shelf in your chosen colors", "Add apple decorations or patterns", "Smooth any rough edges", "Let paint dry before use"],
          image: { src: apple3, alt: "Finished apple shelf" },
        },
      ],
    },
  },
  {
    id: "3",
    title: "Fabric Bookmark",
    category: "Fabric",
    liked: false,
    src: bookmark,
    layoutKey: "fabricBookmark",
    tutorial: {
      title: "Fabric Bookmark",
      hero: { src: bookmark, alt: "Fabric Bookmark" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "5-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "A quick and easy project using fabric scraps.",
          },
          {
            title: "Materials",
            bullets: ["Fabric scraps", "Scissors", "Fabric glue or needle and thread", "Ribbon or tassel (optional)"],
          },
        ],
        image: { src: bookmark0, alt: "Bookmark assembly" },
      },
      steps: [
        {
          title: "Cut fabric",
          intro: "Cut your fabric to bookmark size.",
          bullets: ["Cut rectangle shape", "Cut two pieces if making double-sided"],
          image: { src: bookmark1, alt: "Bookmark assembly" },
        },
        {
          title: "Assemble bookmark",
          bullets: ["Glue or sew pieces together", "Add ribbon or tassel", "Trim edges"],
          image: { src: bookmark2, alt: "Bookmark assembly" },
        },
      ],
    },
  },
  {
    id: "4",
    title: "Stamp Glass Jars",
    category: "Glass",
    liked: false,
    src: glass,
    layoutKey: "stampGlass",
    tutorial: {
      title: "Stamp Glass Jars",
      hero: { src: glass, alt: "Stamp Glass Jars" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "10-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Transform glass jars with decorative stamps.",
          },
          {
            title: "Materials",
            bullets: ["Glass jars", "Rubber stamps", "Acrylic paint or ink", "Sealant (optional)"],
          },
        ],
        image: { src: glass0, alt: "Stamping step" },

      },
      steps: [
        {
          title: "Clean and prepare",
          intro: "Prepare your jars for stamping.",
          bullets: ["Clean jars thoroughly", "Dry completely", "Choose stamp design"],
          image: { src: glass1, alt: "Stamping step" },
        },
        {
          title: "Apply stamps",
          bullets: ["Apply paint to stamp", "Press onto jar", "Repeat pattern"],
          image: { src: glass2, alt: "Stamping step" },
        },
        {
          title: "Seal and finish",
          intro: "Protect your design.",
          bullets: ["Let paint dry", "Apply sealant if desired", "Cure completely"],
          image: { src: glass3, alt: "Stamping step" },

        },
      ],
    },
  },
  {
    id: "5",
    title: "Scrap Hearts",
    category: "Scraps",
    liked: false,
    src: scrap,
    layoutKey: "scrapHearts",
    tutorial: {
      title: "Scrap Hearts",
      hero: { src: scrap, alt: "Scrap Hearts" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "10-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create decorative hearts from fabric scraps.",
          },
          {
            title: "Materials",
            bullets: ["Fabric scraps", "Scissors", "Needle and thread or glue", "Stuffing (optional)"],
            image: { src: scrap0, alt: "Assembly step" },

          },
        ],
      },
      steps: [
        {
          title: "Cut heart shapes",
          intro: "Cut fabric into heart shapes.",
          bullets: ["Draw heart template", "Cut two pieces per heart", "Match patterns if desired"],
          image: { src: scrap1, alt: "Assembly step" },

        },
        {
          title: "Sew or glue together",
          bullets: ["Place pieces together", "Sew or glue edges", "Leave opening for stuffing"],
          image: { src: scrap2, alt: "Assembly step" },
        },
        {
          title: "Finish hearts",
          intro: "Complete your decorative hearts.",
          bullets: ["Add stuffing if desired", "Close opening", "Add hanging loop"],
          image: { src: scrap3, alt: "Assembly step" },

        },
      ],
    },
  },
  {
    id: "6",
    title: "Planter Bottle",
    category: "Bottles",
    liked: true,
    src: bottle,
    layoutKey: "planterBottle",
    tutorial: {
      title: "Planter Bottle",
      hero: { src: bottle, alt: "Planter Bottle" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "15-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Transform a bottle into a beautiful planter.",
          },
          {
            title: "Materials",
            bullets: ["Glass or plastic bottle", "Paint or markers", "Drill or cutting tool", "Potting soil", "Small plant"],
          },
        ],
        image: { src: bottle0, alt: "Decorating step" },

      },
      steps: [
        {
          title: "Prepare the bottle",
          intro: "Clean and prepare your bottle for planting.",
          bullets: ["Remove labels", "Clean thoroughly", "Cut opening if needed"],
          image: { src: bottle1, alt: "Decorating step" },

        },
        {
          title: "Decorate the bottle",
          bullets: ["Paint or decorate exterior", "Let dry completely", "Add drainage holes"],
          image: { src: bottle2, alt: "Decorating step" },
        },
        {
          title: "Plant and finish",
          intro: "Add your plant and complete the project.",
          bullets: ["Add potting soil", "Plant your seedling", "Water and care"],
          image: { src: bottle3, alt: "Decorating step" },

        },
      ],
    },
  },
  {
    id: "7",
    title: "Jean Wallet",
    category: "Fabric",
    liked: false,
    src: jean,
    layoutKey: "jeanWallet",
    tutorial: {
      title: "Jean Wallet",
      hero: { src: jean, alt: "Jean Wallet" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "30-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create a wallet from old jeans.",

          },
          {
            title: "Materials",
            bullets: ["Old jeans", "Scissors", "Sewing machine or needle and thread", "Zipper or button (optional)"],

          },
        ],
        image: { src: jean0, alt: "Assembly step" },

      },
      steps: [
        {
          title: "Cut jean pieces",
          intro: "Cut the wallet pieces from your jeans.",
          bullets: ["Cut main wallet piece", "Cut card slots", "Cut lining if desired"],
          image: { src: jean1, alt: "Assembly step" },

        },
        {
          title: "Sew the wallet",
          bullets: ["Sew card slots", "Attach main pieces", "Add closure"],
          image: { src: jean2, alt: "Sewing step" },
        },
        {
          title: "Finish edges",
          intro: "Complete your wallet.",
          bullets: ["Finish raw edges", "Add final touches", "Test functionality"],
          image: { src: jean3, alt: "Sewing step" },

        },
      ],
    },
  },
  {
    id: "8",
    title: "A-Plastic Can Vases",
    category: "Misc.",
    liked: false,
    src: vase,
    layoutKey: "plasticVases",
    tutorial: {
      title: "A-Plastic Can Vases",
      hero: { src: vase, alt: "A-Plastic Can Vases" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "20-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Transform plastic cans into decorative vases.",
          },
          {
            title: "Materials",
            bullets: ["Plastic cans", "Paint or spray paint", "Decorative materials", "Clear sealant"],
          },
        ],
        image: { src: vase0, alt: "Sewing step" },

      },
      steps: [
        {
          title: "Clean and prepare",
          intro: "Prepare your cans for decoration.",
          bullets: ["Remove labels", "Clean thoroughly", "Sand if needed"],
          image: { src: vase1, alt: "Sewing step" },

        },
        {
          title: "Decorate the cans",
          bullets: ["Apply base coat", "Add decorative elements", "Let dry"],
          image: { src: vase2, alt: "Decorating step" },
        },
        {
          title: "Seal and finish",
          intro: "Protect your design.",
          bullets: ["Apply sealant", "Let cure", "Add flowers or plants"],
          image: { src: vase3, alt: "Decorating step" },

        },
      ],
    },
  },
  {
    id: "9",
    title: "Bread Clip Googly Eye Earrings",
    category: "Misc.",
    liked: false,
    src: earrings,
    layoutKey: "earringsGoogly",
    tutorial: {
      title: "Bread Clip Googly Eye Earrings",
      hero: { src: earrings, alt: "Bread Clip Googly Eye Earrings" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "5-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create fun earrings from bread clips.",
          },
          {
            title: "Materials",
            bullets: ["Bread clips", "Googly eyes", "Hot glue gun", "Earring hooks"],
          },
        ],
        image: { src: earrings0, alt: "Decorating step" },

      },
      steps: [
        {
          title: "Prepare clips",
          intro: "Get your bread clips ready.",
          bullets: ["Clean clips", "Choose size", "Plan design"],
          image: { src: earrings1, alt: "Decorating step" },

        },
        {
          title: "Attach googly eyes",
          bullets: ["Glue eyes to clips", "Let dry", "Attach earring hooks"],
          image: { src: earrings2, alt: "Assembly step" },
        
        },
      ],
    },
  },
  {
    id: "10",
    title: "CD",
    category: "Misc.",
    liked: false,
    src: cd,
    layoutKey: "cd",
    tutorial: {
      title: "CD Upcycling Project",
      hero: { src: cd, alt: "CD Upcycling Project" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "15-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Upcycle old CDs into decorative items.",
          },
          {
            title: "Materials",
            bullets: ["Old CDs", "Paint or markers", "Glue", "Decorative materials"],
          },
        ],
        image: { src: cd0, alt: "Decorating step" },

      },
      steps: [
        {
          title: "Prepare CDs",
          intro: "Clean and prepare your CDs.",
          bullets: ["Remove labels", "Clean surface", "Plan design"],
          image: { src: cd1, alt: "Decorating step" },

        },
        {
          title: "Decorate",
          bullets: ["Apply paint or markers", "Add decorative elements", "Let dry"],
          image: { src: cd2, alt: "Decorating step" },
        },
        {
          title: "Finish project",
          intro: "Complete your CD upcycling project.",
          bullets: ["Add final touches", "Seal if needed", "Display or use"],
          image: { src: cd3, alt: "Decorating step" },

        },
      ],
    },
  },
  {
    id: "11",
    title: "Violin Earrings",
    category: "Misc.",
    liked: true,
    src: watch,
    layoutKey: "violinEarrings",
    tutorial: {
      title: "Violin Earrings",
      hero: { src: watch, alt: "Violin Earrings" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "20-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create musical earrings from upcycled materials.",
          },
          {
            title: "Materials",
            bullets: ["Wood or plastic pieces", "Small violin shapes", "Earring hooks", "Paint or varnish"],
          },
        ],
        image: { src: watch0, alt: "Decorating step" },

      },
      steps: [
        {
          title: "Prepare violin shapes",
          intro: "Create or prepare violin shapes.",
          bullets: ["Cut or shape material", "Sand edges", "Drill hole for hook"],
          image: { src: watch1, alt: "Decorating step" },

        },
        {
          title: "Decorate and finish",
          bullets: ["Paint or varnish", "Add details", "Attach earring hooks"],
          image: { src: watch2, alt: "Finishing step" },
        },
      ],
    },
  },
  {
    id: "12",
    title: "Plastic Bottle Sprinkler",
    category: "Bottles",
    liked: false,
    src: sprinkler,
    layoutKey: "plasticBottleSprinkler",
    tutorial: {
      title: "Plastic Bottle Sprinkler",
      hero: { src: sprinkler, alt: "Plastic Bottle Sprinkler" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "10-minute project" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Turn an empty plastic bottle into a simple garden sprinkler that attaches to a hose or can be used with gravity-fed water.",
          },
          {
            title: "Materials",
            bullets: [
              "Empty plastic bottle (1–2L works best)",
              "Push pin, nail, or small drill",
              "Garden hose or water source",
              "Tape or hose adapter (optional)",
              "Marker (optional)",
            ],
          },
        ],
      },
      
      steps: [
        {
          title: "Clean and prepare the bottle",
          intro: "Make sure your bottle is ready for reuse.",
          bullets: [
            "Remove any labels",
            "Rinse the bottle thoroughly",
            "Let it dry completely",
          ],
          image: { src: sprinkler, alt: "Clean plastic bottle" },
        },
        {
          title: "Create sprinkler holes",
          intro: "These holes will control the water spray.",
          bullets: [
            "Use a pin or nail to poke small holes around the bottle",
            "Space holes evenly for balanced water flow",
            "Avoid holes near the base to prevent leaks",
          ],
        },
        {
          title: "Attach the water source",
          intro: "Connect the bottle to water.",
          bullets: [
            "Insert the hose into the bottle opening",
            "Secure with tape or a hose adapter if needed",
            "Test for leaks before use",
          ],
        },
        {
          title: "Test and adjust",
          bullets: [
            "Turn on the water slowly",
            "Observe spray direction and coverage",
            "Add or enlarge holes if needed",
          ],
        },
      ],      
    },
  },
  {
    id: "13",
    title: "Vinyl Coffee Table",
    category: "Wood",
    liked: true,
    src: table,
    layoutKey: "vinylCoffeeTable",
    tutorial: {
      title: "Vinyl Coffee Table",
      hero: { src: table, alt: "Vinyl Coffee Table" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "2-hour project" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Create a unique coffee table using old vinyl records.",
          },
          {
            title: "Materials",
            bullets: ["Old vinyl records", "Table base or legs", "Glass or clear top", "Adhesive", "Protective coating", "Measuring tools"],
          },
        ],
      },
      steps: [
        {
          title: "Prepare the base",
          intro: "Set up your table base and plan the layout.",
          bullets: ["Choose table base", "Measure dimensions", "Prepare surface"],
          image: { src: table0, alt: "Arrangement step" },

        },
        {
          title: "Arrange vinyl records",
          bullets: ["Plan layout pattern", "Arrange records on base", "Secure in place with adhesive"],
          image: { src: table1, alt: "Arrangement step" },
        },
        {
          title: "Add protective top",
          intro: "Protect your vinyl table with a clear top.",
          bullets: ["Measure for glass or acrylic top", "Install protective layer", "Finish edges"],
          image: { src: table2, alt: "Arrangement step" },

        },
        {
          title: "Final assembly",
          bullets: ["Attach legs if needed", "Test stability", "Add final decorative touches"],
          image: { src: table3, alt: "Final assembly" },
        },
      ],
    },
  },
  {
    id: "14",
    title: "Plastic Bottle Lights",
    category: "Plastic",
    liked: false,
    src: lights,
    layoutKey: "plasticBottleLights",
    tutorial: {
      title: "Plastic Bottle Lights",
      hero: { src: lights, alt: "Plastic Bottle Lights" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "2-hour project" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Turn discarded plastic bottles into decorative lights or lanterns for indoor or outdoor spaces.",
          },
          {
            title: "Materials",
            bullets: [
              "Clear plastic bottles (1–2L)",
              "LED string lights or LED bulbs",
              "Scissors or craft knife",
              "Marker (optional)",
              "Decorative paint or paper (optional)",
              "Tape or glue",
            ],
          },
        ],
        image: { src: lights0, alt: "Final assembly" },

      },
      
      steps: [
        {
          title: "Clean and prep the bottles",
          intro: "Prepare the bottles for cutting and decorating.",
          bullets: [
            "Remove labels and rinse bottles",
            "Dry completely",
            "Mark cut lines if shaping the bottle",
          ],
          image: { src: lights1, alt: "Final assembly" },

        },
        {
          title: "Cut and shape the bottles",
          intro: "Create openings or patterns for the light to shine through.",
          bullets: [
            "Cut the bottom or sides of the bottle",
            "Create simple slits or patterns",
            "Smooth rough edges carefully",
          ],
          image: { src: lights2, alt: "Final assembly" },

        },
        {
          title: "Decorate the bottles",
          intro: "Add personality to your lights.",
          bullets: [
            "Paint or wrap bottles with decorative material",
            "Leave clear sections for light diffusion",
            "Let paint or glue dry fully",
          ],
          image: { src: lights3, alt: "Final assembly" },

        },
        {
          title: "Insert the lights",
          bullets: [
            "Place LED lights inside each bottle",
            "Secure lights so they don’t move",
            "Test lights before final placement",
          ],
          image: { src: lights4, alt: "Final assembly" },

        },
      ],      
    },
  },
];
