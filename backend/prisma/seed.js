const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const communities = [
  {
    name: 'Meadowbrook Estates',
    builder: 'Highland Homes',
    description: 'A serene master-planned community nestled among rolling hills with resort-style amenities.',
    address: '1200 Meadowbrook Dr',
    city: 'Austin',
    state: 'TX',
    zipCode: '78745',
    latitude: 30.2072,
    longitude: -97.8472,
    website: 'https://example.com/meadowbrook',
    homes: [
      { modelName: 'The Cypress', priceMin: 320000, priceMax: 380000, sqft: 1800, lotSizeSqft: 6500, bedrooms: 3, bathrooms: 2, status: 'AVAILABLE' },
      { modelName: 'The Magnolia', priceMin: 420000, priceMax: 480000, sqft: 2400, lotSizeSqft: 7200, bedrooms: 4, bathrooms: 3, status: 'AVAILABLE' },
      { modelName: 'The Pecan', priceMin: 530000, priceMax: 600000, sqft: 3100, lotSizeSqft: 9000, bedrooms: 5, bathrooms: 3.5, status: 'COMING_SOON' },
    ],
  },
  {
    name: 'Lakewood Crossing',
    builder: 'Perry Homes',
    description: 'Lakefront living at its finest, with walking trails and community dock access.',
    address: '5500 Lakewood Blvd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77084',
    latitude: 29.7941,
    longitude: -95.6758,
    website: 'https://example.com/lakewood',
    homes: [
      { modelName: 'The Willow', priceMin: 280000, priceMax: 320000, sqft: 1650, lotSizeSqft: 5500, bedrooms: 3, bathrooms: 2, status: 'AVAILABLE' },
      { modelName: 'The Oak', priceMin: 370000, priceMax: 430000, sqft: 2200, lotSizeSqft: 6800, bedrooms: 4, bathrooms: 2.5, status: 'AVAILABLE' },
      { modelName: 'The Sycamore', priceMin: 460000, priceMax: 520000, sqft: 2800, lotSizeSqft: 8200, bedrooms: 4, bathrooms: 3.5, status: 'SOLD_OUT' },
    ],
  },
  {
    name: 'Sunrise Ranch',
    builder: 'Toll Brothers',
    description: 'Luxury estate homes with gourmet kitchens and spa-like primary suites on generous lots.',
    address: '900 Sunrise Ranch Rd',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75252',
    latitude: 32.9868,
    longitude: -96.7471,
    website: 'https://example.com/sunrise',
    homes: [
      { modelName: 'The Pecan', priceMin: 490000, priceMax: 560000, sqft: 2600, lotSizeSqft: 8000, bedrooms: 4, bathrooms: 3, status: 'AVAILABLE' },
      { modelName: 'The Elm', priceMin: 620000, priceMax: 700000, sqft: 3200, lotSizeSqft: 10000, bedrooms: 5, bathrooms: 4, status: 'AVAILABLE' },
    ],
  },
  {
    name: 'Greenfield Commons',
    builder: 'D.R. Horton',
    description: 'Affordable quality homes in a family-friendly community near top-rated schools.',
    address: '3300 Greenfield Way',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78245',
    latitude: 29.458,
    longitude: -98.6936,
    website: 'https://example.com/greenfield',
    homes: [
      { modelName: 'The Cedar', priceMin: 240000, priceMax: 280000, sqft: 1400, lotSizeSqft: 5000, bedrooms: 3, bathrooms: 2, status: 'AVAILABLE' },
      { modelName: 'The Pine', priceMin: 310000, priceMax: 360000, sqft: 1900, lotSizeSqft: 6200, bedrooms: 3, bathrooms: 2.5, status: 'AVAILABLE' },
      { modelName: 'The Birch', priceMin: 380000, priceMax: 430000, sqft: 2300, lotSizeSqft: 7000, bedrooms: 4, bathrooms: 3, status: 'AVAILABLE' },
    ],
  },
  {
    name: 'Sterling Heights',
    builder: 'Shaddock Homes',
    description: 'Upscale homes in the heart of Frisco with designer finishes and smart home technology.',
    address: '7800 Sterling Pkwy',
    city: 'Frisco',
    state: 'TX',
    zipCode: '75035',
    latitude: 33.1581,
    longitude: -96.8236,
    website: 'https://example.com/sterling',
    homes: [
      { modelName: 'The Birch', priceMin: 520000, priceMax: 600000, sqft: 2800, lotSizeSqft: 8500, bedrooms: 4, bathrooms: 3.5, status: 'AVAILABLE' },
      { modelName: 'The Walnut', priceMin: 680000, priceMax: 780000, sqft: 3500, lotSizeSqft: 11000, bedrooms: 5, bathrooms: 4, status: 'AVAILABLE' },
      { modelName: 'The Maple', priceMin: 850000, priceMax: 950000, sqft: 4200, lotSizeSqft: 14000, bedrooms: 5, bathrooms: 4.5, status: 'COMING_SOON' },
    ],
  },
  {
    name: 'Creekside Village',
    builder: 'Meritage Homes',
    description: 'Energy-efficient homes with solar-ready infrastructure along a natural creek greenbelt.',
    address: '2100 Creekside Loop',
    city: 'Round Rock',
    state: 'TX',
    zipCode: '78664',
    latitude: 30.5083,
    longitude: -97.6789,
    website: 'https://example.com/creekside',
    homes: [
      { modelName: 'The Aspen', priceMin: 350000, priceMax: 400000, sqft: 2000, lotSizeSqft: 6000, bedrooms: 3, bathrooms: 2.5, status: 'AVAILABLE' },
      { modelName: 'The Cottonwood', priceMin: 430000, priceMax: 490000, sqft: 2600, lotSizeSqft: 7500, bedrooms: 4, bathrooms: 3, status: 'AVAILABLE' },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  for (const { homes, ...communityData } of communities) {
    const community = await prisma.community.create({
      data: {
        ...communityData,
        homes: { create: homes },
      },
    });
    console.log(`  Created: ${community.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
