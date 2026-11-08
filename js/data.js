/* Studio Krivo — content taken from studiokrivo.com (text kept verbatim). */

window.DIMS = {"attractor-1.jpg":[1600,2133],"attractor-2.jpg":[1600,2133],"attractor-3.jpg":[1600,2133],"attractor-4.jpg":[1600,2133],"attractor-5.jpg":[1600,1200],"attractor-6.jpg":[1600,2133],"attractor-7.jpg":[1600,2133],"attractor-8.jpg":[1600,2133],"attractor-render.jpg":[1600,805],"ghostcloth-1.jpg":[1600,1200],"ghostcloth-2.jpg":[1600,1200],"ghostcloth-3.jpg":[1600,2133],"ghostcloth-render.png":[1600,1200],"ghostcloth-s1.png":[1600,1200],"ghostcloth-s2.png":[1600,1200],"ghostcloth-s3.png":[1600,1200],"ghostcloth-s4.png":[1600,1200],"ghostcloth-s5.png":[1600,1200],"ghostcloth-s6.png":[1600,1200],"lookatme-1.jpg":[1600,2133],"lookatme-2.jpg":[1600,1200],"lookatme-3.jpg":[1600,2133],"lookatme-hero.png":[1600,1200],"lookatme-render.jpg":[1600,816],"pedestal-1.jpg":[1600,2133],"pedestal-2.jpg":[1600,2133],"pedestal-3.jpg":[1600,2133],"pedestal-hero.png":[1600,1200],"pedestal-render.jpg":[1600,816],"spiked-1.jpg":[1600,2133],"spiked-2.jpg":[1600,2133],"spiked-3.jpg":[1600,1200],"spiked-4.jpg":[1600,2133],"spiked-hero.png":[1600,1200],"spiked-render.png":[1600,1200],"tile-1.jpg":[1600,2133],"tile-2.jpg":[1600,2133],"tile-hero.png":[1600,1200],"tile-render.png":[1600,1200],"tile-t1.jpg":[700,728],"tile-t2.jpg":[700,695],"tile-t3.jpg":[700,704],"tile-t4.jpg":[700,706],"tile-t5.jpg":[700,700],"tile-t6.jpg":[700,670],"tile-t7.jpg":[700,707],"tile-t8.jpg":[700,735],"tile-t9.jpg":[700,673],"tile-t10.jpg":[700,689],"tile-t11.jpg":[700,689],"tile-t12.jpg":[700,708],"tile-t13.jpg":[700,726],"topocrete-1.jpg":[1600,2133],"topocrete-2.jpg":[1600,2133],"topocrete-render.jpg":[1600,816],"toposhelf-1.jpg":[1600,1200],"toposhelf-2.jpg":[1600,1200],"toposhelf-3.jpg":[1600,1200],"toposhelf-4.jpg":[1600,1200],"toposhelf-render.jpg":[1600,816],"viking-render.png":[1600,1067],"viking-1.jpg":[1600,1258],"viking-2.jpg":[1600,1147],"viking-3.jpg":[1600,1204],"viking-4.jpg":[1600,1200],"viking-5.jpg":[1600,1200],"viking-6.jpg":[1600,1206],"viking-7.jpg":[1600,900],"viking-8.jpg":[1600,900],"viking-9.jpg":[1600,900],"viking-10.jpg":[900,1600],"viking-11.jpg":[1600,938],"viking-12.jpg":[1600,1021],"viking-13.jpg":[1600,1335],"viking-14.jpg":[1600,1139],"viking-15.jpg":[1600,900],"viking-16.jpg":[1116,1600]};

const INQUIRY = "For inquiries or custom requests, please contact us at";
const EMAIL = "etan@krivorot.com";

/*
 * Order and names follow the PROJECTS grid on the current homepage.
 * `title` is the heading used on each project's own page.
 * `year` — every piece is shown as 2025 (the studio's founding year); edit per piece if needed.
 * `collection` — reserved for the future Sculptures / Engineered Designs split.
 * `wall` — the photos hung in the gallery next to the render (all photos still show in the piece's detail view).
 *   Pieces without `wall` hang every photo.
 * `below` — detail-view images shown in their own grid underneath the main photos (e.g. the individual tiles).
 * `cutout` — the render has a transparent background: shown whole (not cropped) on the page colour.
 * `fill` — two images set side by side under the render in the detail view, filling the space beside two tall photos.
 */
window.PROJECTS = [
  {
    id: "viking",
    name: "The Viking",
    title: "The Viking",
    category: "McGill OAP Commissioned Artwork",
    year: 2026,
    collection: "sculptures",
    cover: "viking-render.png",
    cutout: true,
    wall: ["viking-1.jpg", "viking-2.jpg"],
    photos: ["viking-1.jpg", "viking-2.jpg", "viking-3.jpg", "viking-4.jpg", "viking-5.jpg", "viking-6.jpg", "viking-7.jpg", "viking-8.jpg", "viking-9.jpg", "viking-10.jpg", "viking-11.jpg", "viking-12.jpg", "viking-13.jpg", "viking-14.jpg", "viking-15.jpg", "viking-16.jpg"],
    extras: [],
    text: [
      "A table that creates its own third space by storing 8 chairs inside. Paying tribute to Montreal landmarks with custom laser engraved artwork, each seat has their own unique interior angle, allowing some chairs to be more up right and others to be more reclined"
    ]
  },
  {
    id: "toposhelf",
    wall: ["toposhelf-3.jpg", "toposhelf-4.jpg"],
    name: "Topo-Shelf",
    title: "Topo-Shelf",
    category: "Shelf Bracket",
    year: 2025,
    collection: "sculptures",
    cover: "toposhelf-render.jpg",
    photos: ["toposhelf-1.jpg", "toposhelf-2.jpg", "toposhelf-3.jpg", "toposhelf-4.jpg"],
    extras: [],
    text: [
      "Ever wanted the laws of nature and physics holding up your belongings?",
      "Now you can have that with the Topo-Shelf!",
      "Two brackets are available for various shelf dimensions"
    ]
  },
  {
    id: "attractor",
    wall: ["attractor-1.jpg", "attractor-3.jpg", "attractor-6.jpg"],
    name: "Attractor Cube",
    title: "Parametric Attractor Cube",
    category: "Sculpture",
    year: 2025,
    collection: "sculptures",
    cover: "attractor-render.jpg",
    photos: ["attractor-1.jpg", "attractor-2.jpg", "attractor-3.jpg", "attractor-4.jpg", "attractor-5.jpg", "attractor-6.jpg", "attractor-7.jpg", "attractor-8.jpg"],
    extras: [],
    text: [
      "This modern concrete sculpture is fully customizable with your choice of colors and patterns. Each piece is handcrafted to fit your style, making it a perfect statement centerpiece or a subtle decorative accent for any room.",
      "This sculpture has an average dimension of 12 x 12 x 12 cm and 3.12 kg of pure concrete artistry."
    ]
  },
  {
    id: "tile",
    wall: ["tile-1.jpg", "tile-2.jpg"],
    name: "Tile Showcase",
    title: "Tile Display",
    category: "Sculpture",
    year: 2025,
    collection: "sculptures",
    cover: "tile-render.png",
    photos: ["tile-1.jpg", "tile-2.jpg"],
    extras: [],
    fill: ["tile-t12.jpg", "tile-t13.jpg"],
    below: ["tile-t1.jpg", "tile-t2.jpg", "tile-t3.jpg", "tile-t4.jpg", "tile-t5.jpg", "tile-t6.jpg", "tile-t7.jpg", "tile-t8.jpg", "tile-t9.jpg", "tile-t10.jpg", "tile-t11.jpg"],
    text: [
      "this sculpture combines unique concrete tiling with a distinctive 3D printed display with overall dimensions of 25 x 25 x 43 cm. Each tile has a dimension of 10 x 10 x 2 cm and features a simple locking mechanism to hold and allow for interchangeability amongst tiles."
    ]
  },
  {
    id: "topocrete",
    wall: ["topocrete-2.jpg"],
    name: "Topo-Crete",
    title: "Topo-Crete",
    category: "Lamp",
    year: 2025,
    collection: "sculptures",
    cover: "topocrete-render.jpg",
    photos: ["topocrete-1.jpg", "topocrete-2.jpg"],
    extras: [],
    text: [
      "This sculpture is made up of two materials, PLA and concrete. The PLA is used for the lamp shade and the topological base. Concrete is used to contrast the PLA at the secondary base and the cap.",
      "This futuristic  sculpture is fully customizable with your choice of colors and patterns. Each piece is handcrafted to fit your style, making it a perfect statement centerpiece or a subtle decorative accent for any room."
    ]
  },
  {
    id: "ghostcloth",
    wall: ["ghostcloth-3.jpg", "ghostcloth-2.jpg"],
    name: "Ghost Cloth",
    title: "Ghost Cloth",
    category: "Sculpture",
    year: 2025,
    collection: "sculptures",
    cover: "ghostcloth-render.png",
    photos: ["ghostcloth-1.jpg", "ghostcloth-2.jpg", "ghostcloth-3.jpg"],
    extras: [],
    text: [
      "Created using a simple physics algorithm in grasshopper to simulate a fabric being stretched by a hand and face, this sculpture offers a captivating design that elevates the aesthetic of any space it inhabits.",
      "With an overal bounding dimension of 22 x 17 x 20 cm, this piece can be customized with your choice of colors and patterns to suit any interior."
    ]
  },
  {
    id: "pedestal",
    wall: ["pedestal-1.jpg", "pedestal-3.jpg"],
    name: "Simple Pedestal",
    title: "Simple Pedestal",
    category: "Sculpture / Display",
    year: 2025,
    collection: "sculptures",
    cover: "pedestal-render.jpg",
    photos: ["pedestal-1.jpg", "pedestal-2.jpg", "pedestal-3.jpg"],
    extras: [],
    text: [
      "The Simple Pedestal offers a modernist twist on any decorative lighting. Designed to support candles, it can also lift up any small object to be placed on display"
    ]
  },
  {
    id: "lookatme",
    wall: ["lookatme-1.jpg", "lookatme-2.jpg"],
    name: "LookAtMe!",
    title: "LookAtMe!",
    category: "Jewelry Display / Sculpture",
    year: 2025,
    collection: "sculptures",
    cover: "lookatme-render.jpg",
    photos: ["lookatme-1.jpg", "lookatme-2.jpg", "lookatme-3.jpg"],
    extras: [],
    text: [
      "This jewelry display is one designed to show off the most prideful pieces of one's collection. Two variations exist with one being able to support only one watch while the other can support two or more!"
    ]
  },
  {
    id: "spiked",
    wall: ["spiked-1.jpg", "spiked-3.jpg"],
    name: "Spiked Bowl",
    title: "Spiked Bowl",
    category: "Sculpture",
    year: 2025,
    collection: "sculptures",
    cover: "spiked-render.png",
    photos: ["spiked-1.jpg", "spiked-2.jpg", "spiked-3.jpg", "spiked-4.jpg"],
    extras: [],
    text: [
      "With dimensions of 22 x 22 x 10 cm, this bowl provides a versatile piece that can be used as a jewelry holder, plant display, catchall for everyday items, or simply as a striking decorative accent.",
      "Each bowl can be customized with your choice of colors and patterns to perfectly match any space. From subtle tones to bold designs, every piece is tailored to your style. Functional and beautiful, it’s a unique addition to any room."
    ]
  }
];
