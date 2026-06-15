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
    priceMin: 320000,
    priceMax: 600000,
    sqftMin: 1800,
    sqftMax: 3100,
    lotSizeSqftMin: 6500,
    lotSizeSqftMax: 9000,
    bedroomsMin: 3,
    bedroomsMax: 5,
    bathroomsMin: 2,
    bathroomsMax: 3.5,
    status: 'AVAILABLE',
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
    priceMin: 280000,
    priceMax: 520000,
    sqftMin: 1650,
    sqftMax: 2800,
    lotSizeSqftMin: 5500,
    lotSizeSqftMax: 8200,
    bedroomsMin: 3,
    bedroomsMax: 4,
    bathroomsMin: 2,
    bathroomsMax: 3.5,
    status: 'AVAILABLE',
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
    priceMin: 490000,
    priceMax: 700000,
    sqftMin: 2600,
    sqftMax: 3200,
    lotSizeSqftMin: 8000,
    lotSizeSqftMax: 10000,
    bedroomsMin: 4,
    bedroomsMax: 5,
    bathroomsMin: 3,
    bathroomsMax: 4,
    status: 'AVAILABLE',
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
    priceMin: 240000,
    priceMax: 430000,
    sqftMin: 1400,
    sqftMax: 2300,
    lotSizeSqftMin: 5000,
    lotSizeSqftMax: 7000,
    bedroomsMin: 3,
    bedroomsMax: 4,
    bathroomsMin: 2,
    bathroomsMax: 3,
    status: 'AVAILABLE',
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
    priceMin: 520000,
    priceMax: 950000,
    sqftMin: 2800,
    sqftMax: 4200,
    lotSizeSqftMin: 8500,
    lotSizeSqftMax: 14000,
    bedroomsMin: 4,
    bedroomsMax: 5,
    bathroomsMin: 3.5,
    bathroomsMax: 4.5,
    status: 'AVAILABLE',
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
    priceMin: 350000,
    priceMax: 490000,
    sqftMin: 2000,
    sqftMax: 2600,
    lotSizeSqftMin: 6000,
    lotSizeSqftMax: 7500,
    bedroomsMin: 3,
    bedroomsMax: 4,
    bathroomsMin: 2.5,
    bathroomsMax: 3,
    status: 'AVAILABLE',
  },
];

// --- Generated communities for additional states (~12 per state) ---

const NEW_CITIES = [
  // Texas (6 more, bringing TX to a dozen)
  { state: 'TX', city: 'Fort Worth', zip: '76123', lat: 32.6566, lng: -97.3308 },
  { state: 'TX', city: 'El Paso', zip: '79938', lat: 31.7619, lng: -106.2989 },
  { state: 'TX', city: 'Plano', zip: '75025', lat: 33.0700, lng: -96.7836 },
  { state: 'TX', city: 'Lubbock', zip: '79424', lat: 33.5085, lng: -101.9466 },
  { state: 'TX', city: 'Corpus Christi', zip: '78414', lat: 27.6195, lng: -97.3689 },
  { state: 'TX', city: 'McKinney', zip: '75071', lat: 33.2148, lng: -96.6398 },

  // Oklahoma
  { state: 'OK', city: 'Oklahoma City', zip: '73142', lat: 35.5946, lng: -97.6394 },
  { state: 'OK', city: 'Tulsa', zip: '74137', lat: 36.0247, lng: -95.9392 },
  { state: 'OK', city: 'Norman', zip: '73072', lat: 35.2226, lng: -97.4395 },
  { state: 'OK', city: 'Edmond', zip: '73034', lat: 35.6804, lng: -97.4784 },
  { state: 'OK', city: 'Broken Arrow', zip: '74012', lat: 36.0526, lng: -95.7908 },
  { state: 'OK', city: 'Lawton', zip: '73505', lat: 34.6087, lng: -98.4067 },
  { state: 'OK', city: 'Moore', zip: '73160', lat: 35.3395, lng: -97.4867 },
  { state: 'OK', city: 'Midwest City', zip: '73130', lat: 35.4495, lng: -97.3967 },
  { state: 'OK', city: 'Stillwater', zip: '74074', lat: 36.1156, lng: -97.0584 },
  { state: 'OK', city: 'Owasso', zip: '74055', lat: 36.2695, lng: -95.8547 },
  { state: 'OK', city: 'Bixby', zip: '74008', lat: 35.9420, lng: -95.8833 },
  { state: 'OK', city: 'Yukon', zip: '73099', lat: 35.5067, lng: -97.7625 },

  // Louisiana
  { state: 'LA', city: 'New Orleans', zip: '70124', lat: 30.0099, lng: -90.1145 },
  { state: 'LA', city: 'Baton Rouge', zip: '70810', lat: 30.3777, lng: -91.0177 },
  { state: 'LA', city: 'Shreveport', zip: '71106', lat: 32.4046, lng: -93.7536 },
  { state: 'LA', city: 'Lafayette', zip: '70508', lat: 30.2143, lng: -92.0398 },
  { state: 'LA', city: 'Lake Charles', zip: '70605', lat: 30.1670, lng: -93.1771 },
  { state: 'LA', city: 'Kenner', zip: '70065', lat: 29.9941, lng: -90.2417 },
  { state: 'LA', city: 'Bossier City', zip: '71111', lat: 32.5446, lng: -93.6788 },
  { state: 'LA', city: 'Monroe', zip: '71203', lat: 32.5301, lng: -92.0668 },
  { state: 'LA', city: 'Alexandria', zip: '71303', lat: 31.3274, lng: -92.4796 },
  { state: 'LA', city: 'Houma', zip: '70360', lat: 29.5958, lng: -90.7195 },
  { state: 'LA', city: 'Slidell', zip: '70461', lat: 30.2752, lng: -89.7812 },
  { state: 'LA', city: 'Mandeville', zip: '70448', lat: 30.3588, lng: -90.0648 },

  // New Mexico
  { state: 'NM', city: 'Albuquerque', zip: '87114', lat: 35.1736, lng: -106.6516 },
  { state: 'NM', city: 'Las Cruces', zip: '88011', lat: 32.3978, lng: -106.7445 },
  { state: 'NM', city: 'Santa Fe', zip: '87507', lat: 35.6178, lng: -106.0158 },
  { state: 'NM', city: 'Rio Rancho', zip: '87144', lat: 35.2972, lng: -106.6504 },
  { state: 'NM', city: 'Roswell', zip: '88201', lat: 33.3943, lng: -104.5230 },
  { state: 'NM', city: 'Farmington', zip: '87401', lat: 36.7281, lng: -108.2187 },
  { state: 'NM', city: 'Clovis', zip: '88101', lat: 34.4048, lng: -103.2052 },
  { state: 'NM', city: 'Hobbs', zip: '88240', lat: 32.7026, lng: -103.1360 },
  { state: 'NM', city: 'Alamogordo', zip: '88310', lat: 32.8995, lng: -105.9603 },
  { state: 'NM', city: 'Carlsbad', zip: '88220', lat: 32.4207, lng: -104.2288 },
  { state: 'NM', city: 'Gallup', zip: '87301', lat: 35.5281, lng: -108.7426 },
  { state: 'NM', city: 'Los Lunas', zip: '87031', lat: 34.8062, lng: -106.7334 },

  // Arkansas
  { state: 'AR', city: 'Little Rock', zip: '72223', lat: 34.7706, lng: -92.4438 },
  { state: 'AR', city: 'Fayetteville', zip: '72703', lat: 36.0822, lng: -94.1719 },
  { state: 'AR', city: 'Fort Smith', zip: '72916', lat: 35.3859, lng: -94.3985 },
  { state: 'AR', city: 'Springdale', zip: '72762', lat: 36.1867, lng: -94.1288 },
  { state: 'AR', city: 'Jonesboro', zip: '72404', lat: 35.8423, lng: -90.6770 },
  { state: 'AR', city: 'Conway', zip: '72034', lat: 35.0887, lng: -92.4421 },
  { state: 'AR', city: 'Rogers', zip: '72758', lat: 36.3320, lng: -94.1185 },
  { state: 'AR', city: 'Bentonville', zip: '72712', lat: 36.3729, lng: -94.2088 },
  { state: 'AR', city: 'Pine Bluff', zip: '71603', lat: 34.2284, lng: -92.0032 },
  { state: 'AR', city: 'Benton', zip: '72019', lat: 34.5645, lng: -92.5868 },
  { state: 'AR', city: 'Cabot', zip: '72023', lat: 34.9745, lng: -92.0165 },
  { state: 'AR', city: 'Texarkana', zip: '71854', lat: 33.4418, lng: -94.0377 },
];

const NAME_PREFIXES = [
  'Meadow', 'Creek', 'Ridge', 'Oak', 'Stone', 'River', 'Hill', 'Prairie', 'Sunset', 'Eagle',
  'Willow', 'Cedar', 'Pecan', 'Brook', 'Heritage', 'Legacy', 'Canyon', 'Mesa', 'Vista', 'Spring',
  'Pine', 'Maple', 'Magnolia', 'Falcon', 'Sage', 'Aspen', 'Hawthorne', 'Cypress', 'Juniper', 'Copper',
];

const NAME_SUFFIXES = [
  'Estates', 'Crossing', 'Ranch', 'Commons', 'Heights', 'Village', 'Park', 'Landing',
  'Pointe', 'Trails', 'Meadows', 'Reserve',
];

const STREET_NAMES = [
  'Meadowbrook', 'Creekside', 'Ridgeline', 'Oakwood', 'Stonebridge', 'River Bend', 'Hillcrest',
  'Prairie View', 'Sunset', 'Eagle Pass', 'Willow Bend', 'Cedar Grove', 'Pecan Grove', 'Brookhollow',
  'Heritage', 'Legacy', 'Canyon View', 'Mesa Verde', 'Vista', 'Spring Valley', 'Pine Hollow',
  'Maple Leaf', 'Magnolia', 'Falcon Ridge', 'Sage Brush', 'Aspen Grove', 'Hawthorne', 'Cypress Point',
  'Juniper Hill', 'Copper Creek',
];

const STREET_TYPES = ['Dr', 'Blvd', 'Ln', 'Way', 'Trail', 'Ct', 'Pkwy', 'Rd'];

const BUILDERS = [
  'D.R. Horton', 'Lennar', 'KB Home', 'Pulte Homes', 'Meritage Homes', 'Taylor Morrison',
  'M/I Homes', 'Highland Homes', 'LGI Homes', 'Century Communities', 'Toll Brothers', 'Perry Homes',
  'Shaddock Homes', 'David Weekley Homes', 'Ashton Woods', 'Chesmar Homes', 'HistoryMaker Homes',
];

const DESC_TEMPLATES = [
  'A {adj} community featuring {amenity} with easy access to local shopping and dining.',
  'New construction homes with {feature}, set in a {adj} neighborhood near top-rated schools.',
  '{adjCap} living with {amenity}, perfect for growing families.',
  'Thoughtfully designed homes offering {feature} in a {adj} setting.',
  'A growing community with {amenity} and convenient access to major highways.',
];

const ADJECTIVES = ['quiet', 'family-friendly', 'master-planned', 'up-and-coming', 'established', 'charming', 'scenic', 'vibrant'];
const AMENITIES = [
  'a community pool and clubhouse', 'walking trails and a playground', 'a fitness center and dog park',
  'green spaces and picnic areas', 'a resort-style pool and splash pad',
];
const FEATURES = [
  'open-concept floor plans', 'energy-efficient designs', 'spacious primary suites',
  'modern kitchens with large islands', 'flexible bonus rooms',
];

const TIERS = [
  { weight: 0.3, priceMin: [220000, 270000], priceSpread: [80000, 140000], sqftMin: [1300, 1650], sqftSpread: [400, 700], lotMin: [4500, 5500], lotSpread: [800, 1500], bedsMin: 3, bedsMax: 4, bathsMin: 2, bathsSpread: [0, 1] },
  { weight: 0.5, priceMin: [320000, 430000], priceSpread: [100000, 180000], sqftMin: [1800, 2300], sqftSpread: [500, 900], lotMin: [5500, 7000], lotSpread: [1000, 2000], bedsMin: 3, bedsMax: 5, bathsMin: 2, bathsSpread: [0.5, 1.5] },
  { weight: 0.2, priceMin: [480000, 600000], priceSpread: [150000, 300000], sqftMin: [2600, 3200], sqftSpread: [600, 1000], lotMin: [7500, 9000], lotSpread: [1500, 4000], bedsMin: 4, bedsMax: 5, bathsMin: 3, bathsSpread: [0.5, 1.5] },
];

const STATUSES = [
  { value: 'AVAILABLE', weight: 0.75 },
  { value: 'COMING_SOON', weight: 0.15 },
  { value: 'SOLD_OUT', weight: 0.10 },
];

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickWeighted(rng, items) {
  const r = rng();
  let acc = 0;
  for (const item of items) {
    acc += item.weight;
    if (r <= acc) return item;
  }
  return items[items.length - 1];
}

function randInt(rng, [min, max]) {
  return Math.round(min + rng() * (max - min));
}

function roundHalf(n) {
  return Math.round(n * 2) / 2;
}

function generateCommunity(cityInfo, index) {
  const rng = mulberry32(hashSeed(`${cityInfo.state}-${cityInfo.city}-${index}`));

  const name = `${pick(rng, NAME_PREFIXES)} ${pick(rng, NAME_SUFFIXES)}`;
  const builder = pick(rng, BUILDERS);

  const template = pick(rng, DESC_TEMPLATES);
  const adj = pick(rng, ADJECTIVES);
  const description = template
    .replace('{adj}', adj)
    .replace('{adjCap}', adj.charAt(0).toUpperCase() + adj.slice(1))
    .replace('{amenity}', pick(rng, AMENITIES))
    .replace('{feature}', pick(rng, FEATURES));

  const streetNumber = randInt(rng, [100, 9900]);
  const address = `${streetNumber} ${pick(rng, STREET_NAMES)} ${pick(rng, STREET_TYPES)}`;

  const tier = pickWeighted(rng, TIERS);
  const priceMin = randInt(rng, tier.priceMin);
  const priceMax = priceMin + randInt(rng, tier.priceSpread);
  const sqftMin = randInt(rng, tier.sqftMin);
  const sqftMax = sqftMin + randInt(rng, tier.sqftSpread);
  const lotSizeSqftMin = randInt(rng, tier.lotMin);
  const lotSizeSqftMax = lotSizeSqftMin + randInt(rng, tier.lotSpread);
  const bedroomsMin = tier.bedsMin;
  const bedroomsMax = tier.bedsMax;
  const bathroomsMin = tier.bathsMin;
  const bathroomsMax = roundHalf(tier.bathsMin + (tier.bathsSpread[0] + rng() * (tier.bathsSpread[1] - tier.bathsSpread[0])));

  // Slight jitter so multiple communities in the same city aren't stacked on the map
  const latitude = cityInfo.lat + (rng() - 0.5) * 0.08;
  const longitude = cityInfo.lng + (rng() - 0.5) * 0.08;

  const status = pickWeighted(rng, STATUSES).value;

  const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${cityInfo.city.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    name,
    builder,
    description,
    address,
    city: cityInfo.city,
    state: cityInfo.state,
    zipCode: cityInfo.zip,
    latitude,
    longitude,
    website: `https://example.com/${slug}`,
    priceMin,
    priceMax,
    sqftMin,
    sqftMax,
    lotSizeSqftMin,
    lotSizeSqftMax,
    bedroomsMin,
    bedroomsMax,
    bathroomsMin,
    bathroomsMax,
    status,
  };
}

const generatedCommunities = NEW_CITIES.map((cityInfo, index) => generateCommunity(cityInfo, index));

const allCommunities = [...communities, ...generatedCommunities];

async function main() {
  console.log('Seeding database...');

  await prisma.community.deleteMany();

  for (const communityData of allCommunities) {
    const community = await prisma.community.create({ data: communityData });
    console.log(`  Created: ${community.name} (${community.city}, ${community.state})`);
  }

  console.log(`Seeding complete. ${allCommunities.length} communities created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
