// items.js
export const CATEGORIES = [
  "All",
  "Fabric",
  "Bottles",
  "Boxes",
  "Wood",
  "Paper",
  "Tin",
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
  violinEarrings: "md:[grid-column5/span_2] md:[grid-row:6/span_2]",

  vinylTableLeft: "md:[grid-column:1/span_4] md:[grid-row:8/span_3]",
  vinylTableMid: "md:[grid-column:5/span_4] md:[grid-row:8/span_3]",
  vinylTableRight: "md:[grid-column:9/span_4] md:[grid-row:6/span_5]",
};

// Items derived from reference image
export const ITEMS = [
  {
    id: "1",
    title: "Fabric Spring Fruit Tote Tops",
    category: "Fabric",
    liked: true,
    src: "",
    layoutKey: "fabricTote",
    tutorial: {
      title: "Fabric Spring Fruit Tote Tops",
      hero: { src: "", alt: "Fabric Spring Fruit Tote Tops" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "15-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Before you start, gather your materials and set up your workspace.",
          },
          {
            title: "Materials",
            bullets: ["Fabric scraps", "Scissors", "Sewing machine or needle and thread", "Iron"],
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Cut and prepare fabric",
          intro: "Cut your fabric pieces to the desired size for your tote bag.",
          bullets: ["Measure and cut main fabric", "Cut lining fabric", "Cut handles"],
        },
        {
          title: "Sew the bag",
          bullets: ["Sew the sides together", "Attach the bottom", "Turn right side out"],
          image: { src: "", alt: "Sewing step" },
        },
        {
          title: "Add handles",
          intro: "Attach handles to complete your tote bag.",
          bullets: ["Position handles", "Sew securely", "Reinforce stitches"],
        },
        {
          title: "Finish and press",
          bullets: ["Press seams", "Trim threads", "Add decorative touches if desired"],
          image: { src: "", alt: "Finished tote" },
        },
      ],
    },
  },
  {
    id: "2",
    title: "Cardboard Apple Shelf",
    category: "Boxes",
    liked: false,
    src: "",
    layoutKey: "appleShelf",
    tutorial: {
      title: "Cardboard Apple Shelf",
      hero: { src: "", alt: "Cardboard Apple Shelf" },
      meta: { badgeLeft: "AI Generated Tutorial", readTime: "20-minute craft" },
      materials: {
        heading: "Preparation & Materials",
        sections: [
          {
            title: "Get Started",
            body: "Collect sturdy cardboard boxes and prepare your workspace.",
          },
          {
            title: "Materials",
            bullets: ["Cardboard boxes", "Box cutter", "Ruler", "Strong glue or tape", "Paint (optional)"],
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Design and measure",
          intro: "Plan your shelf dimensions and cut the cardboard pieces.",
          bullets: ["Measure desired shelf size", "Mark cutting lines", "Cut main pieces"],
        },
        {
          title: "Assemble the structure",
          bullets: ["Create support structure", "Attach shelves", "Reinforce corners"],
          image: { src: "", alt: "Assembly step" },
        },
        {
          title: "Finish and decorate",
          intro: "Add finishing touches to your shelf.",
          bullets: ["Smooth edges", "Paint or decorate", "Let dry completely"],
        },
      ],
    },
  },
  {
    id: "3",
    title: "Fabric Bookmark",
    category: "Fabric",
    liked: false,
    src: "",
    layoutKey: "fabricBookmark",
    tutorial: {
      title: "Fabric Bookmark",
      hero: { src: "", alt: "Fabric Bookmark" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Cut fabric",
          intro: "Cut your fabric to bookmark size.",
          bullets: ["Cut rectangle shape", "Cut two pieces if making double-sided"],
        },
        {
          title: "Assemble bookmark",
          bullets: ["Glue or sew pieces together", "Add ribbon or tassel", "Trim edges"],
          image: { src: "", alt: "Bookmark assembly" },
        },
      ],
    },
  },
  {
    id: "4",
    title: "Stamp Glass Jars",
    category: "Glass",
    liked: false,
    src: "",
    layoutKey: "stampGlass",
    tutorial: {
      title: "Stamp Glass Jars",
      hero: { src: "", alt: "Stamp Glass Jars" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Clean and prepare",
          intro: "Prepare your jars for stamping.",
          bullets: ["Clean jars thoroughly", "Dry completely", "Choose stamp design"],
        },
        {
          title: "Apply stamps",
          bullets: ["Apply paint to stamp", "Press onto jar", "Repeat pattern"],
          image: { src: "", alt: "Stamping step" },
        },
        {
          title: "Seal and finish",
          intro: "Protect your design.",
          bullets: ["Let paint dry", "Apply sealant if desired", "Cure completely"],
        },
      ],
    },
  },
  {
    id: "5",
    title: "Scrap Hearts",
    category: "Scraps",
    liked: false,
    src: "",
    layoutKey: "scrapHearts",
    tutorial: {
      title: "Scrap Hearts",
      hero: { src: "", alt: "Scrap Hearts" },
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
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Cut heart shapes",
          intro: "Cut fabric into heart shapes.",
          bullets: ["Draw heart template", "Cut two pieces per heart", "Match patterns if desired"],
        },
        {
          title: "Sew or glue together",
          bullets: ["Place pieces together", "Sew or glue edges", "Leave opening for stuffing"],
          image: { src: "", alt: "Assembly step" },
        },
        {
          title: "Finish hearts",
          intro: "Complete your decorative hearts.",
          bullets: ["Add stuffing if desired", "Close opening", "Add hanging loop"],
        },
      ],
    },
  },
  {
    id: "6",
    title: "Planter Bottle",
    category: "Bottles",
    liked: true,
    src: "",
    layoutKey: "planterBottle",
    tutorial: {
      title: "Planter Bottle",
      hero: { src: "", alt: "Planter Bottle" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare the bottle",
          intro: "Clean and prepare your bottle for planting.",
          bullets: ["Remove labels", "Clean thoroughly", "Cut opening if needed"],
        },
        {
          title: "Decorate the bottle",
          bullets: ["Paint or decorate exterior", "Let dry completely", "Add drainage holes"],
          image: { src: "", alt: "Decorating step" },
        },
        {
          title: "Plant and finish",
          intro: "Add your plant and complete the project.",
          bullets: ["Add potting soil", "Plant your seedling", "Water and care"],
        },
      ],
    },
  },
  {
    id: "7",
    title: "Jean Wallet",
    category: "Fabric",
    liked: false,
    src: "",
    layoutKey: "jeanWallet",
    tutorial: {
      title: "Jean Wallet",
      hero: { src: "", alt: "Jean Wallet" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Cut jean pieces",
          intro: "Cut the wallet pieces from your jeans.",
          bullets: ["Cut main wallet piece", "Cut card slots", "Cut lining if desired"],
        },
        {
          title: "Sew the wallet",
          bullets: ["Sew card slots", "Attach main pieces", "Add closure"],
          image: { src: "", alt: "Sewing step" },
        },
        {
          title: "Finish edges",
          intro: "Complete your wallet.",
          bullets: ["Finish raw edges", "Add final touches", "Test functionality"],
        },
      ],
    },
  },
  {
    id: "8",
    title: "A-Plastic Can Vases",
    category: "Misc.",
    liked: false,
    src: "",
    layoutKey: "plasticVases",
    tutorial: {
      title: "A-Plastic Can Vases",
      hero: { src: "", alt: "A-Plastic Can Vases" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Clean and prepare",
          intro: "Prepare your cans for decoration.",
          bullets: ["Remove labels", "Clean thoroughly", "Sand if needed"],
        },
        {
          title: "Decorate the cans",
          bullets: ["Apply base coat", "Add decorative elements", "Let dry"],
          image: { src: "", alt: "Decorating step" },
        },
        {
          title: "Seal and finish",
          intro: "Protect your design.",
          bullets: ["Apply sealant", "Let cure", "Add flowers or plants"],
        },
      ],
    },
  },
  {
    id: "9",
    title: "Bread Clip Googly Eye Earrings",
    category: "Misc.",
    liked: false,
    src: "",
    layoutKey: "earringsGoogly",
    tutorial: {
      title: "Bread Clip Googly Eye Earrings",
      hero: { src: "", alt: "Bread Clip Googly Eye Earrings" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare clips",
          intro: "Get your bread clips ready.",
          bullets: ["Clean clips", "Choose size", "Plan design"],
        },
        {
          title: "Attach googly eyes",
          bullets: ["Glue eyes to clips", "Let dry", "Attach earring hooks"],
          image: { src: "", alt: "Assembly step" },
        },
      ],
    },
  },
  {
    id: "10",
    title: "CD",
    category: "Misc.",
    liked: false,
    src: "",
    layoutKey: "cd",
    tutorial: {
      title: "CD Upcycling Project",
      hero: { src: "", alt: "CD Upcycling Project" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare CDs",
          intro: "Clean and prepare your CDs.",
          bullets: ["Remove labels", "Clean surface", "Plan design"],
        },
        {
          title: "Decorate",
          bullets: ["Apply paint or markers", "Add decorative elements", "Let dry"],
          image: { src: "", alt: "Decorating step" },
        },
        {
          title: "Finish project",
          intro: "Complete your CD upcycling project.",
          bullets: ["Add final touches", "Seal if needed", "Display or use"],
        },
      ],
    },
  },
  {
    id: "11",
    title: "Violin Earrings",
    category: "Misc.",
    liked: true,
    src: "",
    layoutKey: "violinEarrings",
    tutorial: {
      title: "Violin Earrings",
      hero: { src: "", alt: "Violin Earrings" },
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
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare violin shapes",
          intro: "Create or prepare violin shapes.",
          bullets: ["Cut or shape material", "Sand edges", "Drill hole for hook"],
        },
        {
          title: "Decorate and finish",
          bullets: ["Paint or varnish", "Add details", "Attach earring hooks"],
          image: { src: "", alt: "Finishing step" },
        },
      ],
    },
  },
  {
    id: "12",
    title: "Vinyl Coffee Table",
    category: "Wood",
    liked: false,
    src: "",
    layoutKey: "vinylTableLeft",
    tutorial: {
      title: "Vinyl Coffee Table",
      hero: { src: "", alt: "Vinyl Coffee Table" },
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
            bullets: ["Old vinyl records", "Table base or legs", "Glass or clear top", "Adhesive", "Protective coating"],
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare the base",
          intro: "Set up your table base.",
          bullets: ["Choose table base", "Measure and plan", "Prepare surface"],
        },
        {
          title: "Arrange vinyl records",
          bullets: ["Plan layout", "Arrange records", "Secure in place"],
          image: { src: "", alt: "Arrangement step" },
        },
        {
          title: "Add protective top",
          intro: "Protect your vinyl table.",
          bullets: ["Measure for glass top", "Install protective layer", "Finish edges"],
        },
        {
          title: "Final assembly",
          bullets: ["Attach legs if needed", "Test stability", "Add final touches"],
          image: { src: "", alt: "Final assembly" },
        },
      ],
    },
  },
  {
    id: "13",
    title: "Vinyl Coffee Table",
    category: "Wood",
    liked: true,
    src: "",
    layoutKey: "vinylTableMid",
    tutorial: {
      title: "Vinyl Coffee Table",
      hero: { src: "", alt: "Vinyl Coffee Table" },
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
            bullets: ["Old vinyl records", "Table base or legs", "Glass or clear top", "Adhesive", "Protective coating"],
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare the base",
          intro: "Set up your table base.",
          bullets: ["Choose table base", "Measure and plan", "Prepare surface"],
        },
        {
          title: "Arrange vinyl records",
          bullets: ["Plan layout", "Arrange records", "Secure in place"],
          image: { src: "", alt: "Arrangement step" },
        },
        {
          title: "Add protective top",
          intro: "Protect your vinyl table.",
          bullets: ["Measure for glass top", "Install protective layer", "Finish edges"],
        },
        {
          title: "Final assembly",
          bullets: ["Attach legs if needed", "Test stability", "Add final touches"],
          image: { src: "", alt: "Final assembly" },
        },
      ],
    },
  },
  {
    id: "14",
    title: "Vinyl Coffee Table",
    category: "Wood",
    liked: false,
    src: "",
    layoutKey: "vinylTableRight",
    tutorial: {
      title: "Vinyl Coffee Table",
      hero: { src: "", alt: "Vinyl Coffee Table" },
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
            bullets: ["Old vinyl records", "Table base or legs", "Glass or clear top", "Adhesive", "Protective coating"],
          },
        ],
        image: { src: "", alt: "Materials image" },
      },
      steps: [
        {
          title: "Prepare the base",
          intro: "Set up your table base.",
          bullets: ["Choose table base", "Measure and plan", "Prepare surface"],
        },
        {
          title: "Arrange vinyl records",
          bullets: ["Plan layout", "Arrange records", "Secure in place"],
          image: { src: "", alt: "Arrangement step" },
        },
        {
          title: "Add protective top",
          intro: "Protect your vinyl table.",
          bullets: ["Measure for glass top", "Install protective layer", "Finish edges"],
        },
        {
          title: "Final assembly",
          bullets: ["Attach legs if needed", "Test stability", "Add final touches"],
          image: { src: "", alt: "Final assembly" },
        },
      ],
    },
  },
];
