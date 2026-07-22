// Mirrors the shape the real API will return once FastAPI/Mongo is live.
// Content pulled from pages_full_content.json extraction — replace placeholder
// descriptions with the real page copy per slug as you migrate each one.
//
// Structural fixes applied per the review:
//  - "Surveying Works" is now a top-level service, not nested under ISO Training
//  - "Asset Management" (the service) vs "ISO 55001 Asset Management System"
//    (the certification) are relabeled so they read as distinct in nav/admin

export const services = [
  {
    slug: "management-system-certification",
    path: "/ser/msc",
    name: "Management System Certification",
    shortName: "Management & certification",
    summary: "ISO certification support across every standard we work with, from gap assessment through certification audit.",
    image: { status: "pending", note: "see icon_inventory.csv" },
    children: [
      { slug: "qms", path: "/ser/msc/qms", standardCode: "ISO 9001:2015", name: "Quality Management Systems" },
      { slug: "ohsms", path: "/ser/msc/ohsms", standardCode: "ISO 45001:2018", name: "Occupational Health & Safety Management Systems" },
      { slug: "fsms", path: "/ser/msc/fsms", standardCode: "ISO 22000:2018", name: "Food Safety Management Systems" },
      { slug: "infosms", path: "/ser/msc/infosms", standardCode: "ISO/IEC 27001:2022", name: "Information Security Management Systems" },
      {
        slug: "ams",
        path: "/ser/msc/ams",
        standardCode: "ISO 55001:2014",
        name: "Asset Management System",
        note: "Certification standard — distinct from the 'Asset Management Services' offering below.",
      },
      { slug: "enems", path: "/ser/msc/enems", standardCode: "ISO 50001:2018", name: "Energy Management Systems" },
      { slug: "envms", path: "/ser/msc/envms", standardCode: "ISO 14001:2015", name: "Environmental Management Systems",
        benefits: [
          { id: "01", label: "Improved environmental performance", iconFile: "Expectation.svg" },
          { id: "02", label: "Compliance with environmental regulations", iconFile: "File.svg" },
          { id: "03", label: "Cost savings", iconFile: "Discount.svg" },
          { id: "04", label: "Increased customer satisfaction", iconFile: "Guarantee.svg" },
          { id: "05", label: "Enhanced reputation", iconFile: "Reputation.svg" },
          { id: "06", label: "Increased competitive edge / market access", iconFile: "Advantage.svg" },
          { id: "07", label: "Improved risk management", iconFile: "Check-list.svg" },
          { id: "08", label: "Data-driven decision making", iconFile: "Monitor.svg" },
          { id: "09", label: "Improved stakeholder management", iconFile: "Relationship.svg" },
          { id: "10", label: "Corporate responsibility", iconFile: "Responsibility-1.svg" },
        ],
      },
      { slug: "edums", path: "/ser/msc/edums", standardCode: "ISO 21001:2018", name: "Educational Organizations Management Systems" },
    ],
  },
  {
    slug: "iso-training",
    path: "/ser/isot",
    name: "ISO Training",
    shortName: "ISO training",
    summary: "Implementation, auditing, and awareness training for teams working toward certification.",
    image: { status: "pending" },
    children: [
      { slug: "isocli", path: "/ser/isot/isocli", name: "ISO Lead Implementer Training" },
      { slug: "isocla", path: "/ser/isot/isocla", name: "ISO Lead Auditor Training" },
      { slug: "isocia", path: "/ser/isot/isocia", name: "ISO Internal Auditor Training" },
    ],
  },
  {
    slug: "engineering-design",
    path: "/ser/eng",
    name: "Engineering Design",
    shortName: "Engineering design",
    summary: "Infrastructure and industrial design solutions delivered by our engineering team.",
    image: { status: "pending" },
    children: [],
  },
  {
    slug: "surveying-works",
    path: "/ser/surveying-works",
    name: "Surveying Works",
    shortName: "Survey & GIS mapping",
    summary: "Field survey and spatial data services — promoted to its own top-level section per review.",
    image: { status: "confirmed", file: "pexels-photo (see icon_inventory.csv for exact filename)" },
    includedServices: [
      "Fresh Survey", "Boundary Opening", "Amalgamation", "Sub-Division",
      "As-Built Demarcation", "Topographic Survey", "Land Title Processing",
    ],
    children: [],
  },
  {
    slug: "hse",
    path: "/ser/hse",
    name: "Health, Safety & Environmental (HSE)",
    shortName: "HSE training & equipment",
    summary: "Training and equipment supply covering health, safety, and environmental compliance.",
    image: { status: "pending" },
    children: [
      { slug: "hset", path: "/ser/hse/hset", name: "HSE Training" },
      { slug: "hseea", path: "/ser/hse/hseea", name: "HSE Equipment Acquisition" },
    ],
  },
  {
    slug: "asset-management-services",
    path: "/ser/asset-management-services",
    name: "Asset Management Services",
    shortName: "Asset management",
    summary: "Ongoing asset management and maintenance — a service engagement, not a certification (see ISO 55001 under Management System Certification for that).",
    image: { status: "pending" },
    children: [],
  },
];

// Flat lookup helper — every leaf (service or sub-service) by its full path,
// useful once routing needs to resolve arbitrary-depth slugs.
export function findServiceByPath(path) {
  for (const service of services) {
    if (service.path === path) return service;
    for (const child of service.children || []) {
      if (child.path === path) return { ...child, parent: service };
    }
  }
  return null;
}
