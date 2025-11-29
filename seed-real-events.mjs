import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const realEvents = [
  {
    title: "The London Beer Flood (1814)",
    description: "On October 17, 1814, a catastrophic industrial accident at the Horse Shoe Brewery resulted in the rupture of a massive fermentation vat containing over 320,000 gallons of beer. The resulting 15-foot wave of hot porter ale destroyed buildings and flooded the impoverished St Giles neighborhood.",
    category: "accident",
    eventDate: new Date("1970-10-17T14:00:00Z"), // Note: Represented as 1970 due to MySQL timestamp limits (actual event: 1814)
    latitude: "51.5165",
    longitude: "-0.1308",
    locationName: "Great Russell Street, St Giles, London",
    videoUrl: "https://www.youtube.com/watch?v=96OMuA65goo",
    sourceUrl: "https://www.historic-uk.com/HistoryUK/HistoryofBritain/The-London-Beer-Flood-of-1814/",
    peopleInvolved: "8 people killed, including Mary Banfield and her daughter Hannah, 4 mourners at an Irish wake, and barmaid Eleanor Cooper",
    backgroundInfo: "The Horse Shoe Brewery was located at the corner of Great Russell Street and Tottenham Court Road. The disaster was ruled an Act of God, leaving no one legally responsible. The brewery reclaimed excise duty on the lost beer, saving them from bankruptcy.",
    details: "One of the massive iron rings holding the 22-foot high wooden vat snapped, causing the entire tank to rupture an hour later. The force collapsed the brewery's back wall and ruptured several more vats. The stench of beer persisted in the area for months. This unique disaster led to the gradual replacement of wooden fermentation casks with lined concrete vats.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Walkie-Talkie Skyscraper Melts Cars",
    description: "The newly constructed 20 Fenchurch Street building, nicknamed the 'Walkie-Talkie' due to its distinctive shape, began reflecting concentrated sunlight onto the street below. The intense reflected light was hot enough to melt parts of vehicles, scorch shop carpets, and even fry eggs on the pavement.",
    category: "strange",
    eventDate: new Date("2013-09-02T12:00:00Z"),
    latitude: "51.5112",
    longitude: "-0.0831",
    locationName: "20 Fenchurch Street, London",
    videoUrl: "https://www.youtube.com/watch?v=wkC93LA0IAs",
    sourceUrl: "https://www.bbc.com/news/uk-england-london-23930675",
    peopleInvolved: "Martin Lindsay (Jaguar owner whose car was damaged), building developers Land Securities and Canary Wharf Group",
    backgroundInfo: "The concave design of the building acted as a giant curved mirror, focusing sunlight into a concentrated beam dubbed the 'death ray.' The phenomenon occurred during specific times of day when the sun was at particular angles.",
    details: "A Jaguar XJ parked on Eastcheap had its wing mirror, panels and badge melted. Temperatures on the street reached up to 117°F (47°C). Developers eventually installed a permanent sun-shading system on the building's south-facing facade to prevent further incidents. The building cost $1.7 billion to construct.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "The Great Smog of London (1952)",
    description: "In December 1952, a deadly combination of cold weather, windless conditions, and coal smoke created a toxic fog that blanketed London for five days. Visibility dropped to near zero, and the polluted air killed thousands of people, particularly those with respiratory conditions. The smog was so thick it seeped indoors and brought the city to a standstill.",
    category: "accident",
    eventDate: new Date("1970-12-05T00:00:00Z"), // Note: Represented as 1970 due to MySQL timestamp limits (actual event: 1952)
    latitude: "51.5074",
    longitude: "-0.1278",
    locationName: "Central London (citywide)",
    videoUrl: "https://www.youtube.com/watch?v=BUF2esXPYJk",
    sourceUrl: "https://www.londonmuseum.org.uk/collections/london-stories/the-great-smog-of-1952/",
    peopleInvolved: "Approximately 12,000 deaths, with 100,000 more made ill. Affected the entire London population of 8 million.",
    backgroundInfo: "The smog was caused by coal fires in homes and power stations combined with an anticyclone weather system that trapped pollutants. It was reported that cows in Smithfield Market choked to death on the toxic air.",
    details: "Visibility was reduced to a few yards. Public transport ceased, ambulances couldn't run, and the smog even penetrated indoor spaces. The disaster led directly to the Clean Air Act of 1956, which introduced smoke-free zones and regulations on coal burning. Medical records show deaths peaked on December 8-9, 1952.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "The Highgate Vampire Hunt",
    description: "Mass hysteria erupted when reports of a vampire haunting Highgate Cemetery spread through London media. Hundreds of people descended on the cemetery at night armed with stakes, crosses, and garlic. Two self-proclaimed vampire hunters, Sean Manchester and David Farrant, conducted rival investigations that escalated into a bizarre public feud.",
    category: "paranormal",
    eventDate: new Date("1970-03-13T23:00:00Z"),
    latitude: "51.5669",
    longitude: "-0.1461",
    locationName: "Highgate Cemetery, North London",
    videoUrl: "https://www.youtube.com/watch?v=IldDt2pRj-g",
    sourceUrl: "https://en.wikipedia.org/wiki/Highgate_Vampire",
    peopleInvolved: "Sean Manchester (self-proclaimed vampire hunter and bishop), David Farrant (occultist), hundreds of vampire hunters and curiosity seekers",
    backgroundInfo: "Reports began with sightings of a tall, dark figure near the cemetery gates. The phenomenon coincided with the popularity of Hammer Horror vampire films. Highgate Cemetery had been abandoned and overgrown, creating an eerie atmosphere.",
    details: "On Friday the 13th, March 1970, a mob of vampire hunters scaled the cemetery walls. Television crews documented the bizarre scene. Graves were vandalized and bodies disturbed. The 'vampire' was variously described as a medieval nobleman, a practitioner of black magic, or a king vampire from Wallachia. The incident became a media sensation and remains one of Britain's most famous paranormal cases.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Crystal Palace Fire (1936)",
    description: "On November 30, 1936, the iconic Crystal Palace, originally built for the Great Exhibition of 1851 and relocated to South London, was consumed by a massive fire visible across eight counties. Despite 89 fire engines and over 400 firefighters responding, the iron and glass structure was destroyed in just a few hours. An estimated 100,000 people gathered to watch the spectacular blaze.",
    category: "accident",
    eventDate: new Date("1970-11-30T19:00:00Z"), // Note: Represented as 1970 due to MySQL timestamp limits (actual event: 1936)
    latitude: "51.4217",
    longitude: "-0.0755",
    locationName: "Crystal Palace Park, South London",
    videoUrl: "https://www.youtube.com/watch?v=cCPq_ERbfZQ",
    sourceUrl: "https://www.london-fire.gov.uk/museum/london-fire-brigade-history-and-stories/fires-and-incidents-that-changed-history/the-crystal-palace-fire/",
    peopleInvolved: "Over 400 firefighters, 100,000 spectators. Winston Churchill reportedly said 'This is the end of an age.'",
    backgroundInfo: "The Crystal Palace had stood in Sydenham Hill since 1854 after being moved from Hyde Park. By 1936, it had fallen into disrepair due to lack of funding. The structure contained miles of wooden flooring and exhibits that fueled the fire.",
    details: "The fire started around 7pm in a small office. High winds fed the flames, and the structure's design created a chimney effect. The glow was visible from Brighton, 50 miles away. Two water towers exploded spectacularly. Remarkably, there were no fatalities. The site was never rebuilt, and only terraces and foundations remain today.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Thames Whale Rescue Attempt",
    description: "A northern bottlenose whale, normally found in deep North Atlantic waters, became disoriented and swam up the River Thames into central London. The 18-foot whale passed the Houses of Parliament and became a media sensation as thousands lined the riverbanks. A dramatic rescue attempt involving a barge and veterinarians ended tragically when the whale died during transport.",
    category: "strange",
    eventDate: new Date("2006-01-20T10:00:00Z"),
    latitude: "51.5007",
    longitude: "-0.1246",
    locationName: "River Thames near Westminster Bridge, London",
    videoUrl: "https://www.youtube.com/watch?v=d7Ne-KOiO50",
    sourceUrl: "https://www.nhm.ac.uk/discover/thames-whale-back-on-display.html",
    peopleInvolved: "Marine mammal rescue teams, veterinarians, thousands of onlookers. The whale was nicknamed 'Willy' by the media.",
    backgroundInfo: "This was the first time a northern bottlenose whale had been seen in the Thames since records began in 1913. The species normally inhabits waters 800-1000 meters deep in the North Atlantic.",
    details: "The whale was first spotted on January 19th near Southend. By January 20th, it had reached central London, swimming past Big Ben. Rescuers attempted to guide it back to sea using boats and sonar. When this failed, they lifted the distressed whale onto a barge. Despite veterinary care, the whale suffered convulsions and died. The skeleton is now displayed at the Natural History Museum.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Hatton Garden Safe Deposit Burglary",
    description: "A gang of elderly career criminals, with a combined age of over 400 years, executed what became known as the 'largest burglary in English legal history.' Over the Easter weekend, they used a diamond-tipped drill to bore through a reinforced concrete wall into the Hatton Garden Safe Deposit vault, ransacking 73 safety deposit boxes and stealing an estimated £14-25 million in cash, jewelry, and gems.",
    category: "crime",
    eventDate: new Date("2015-04-02T21:00:00Z"),
    latitude: "51.5191",
    longitude: "-0.1068",
    locationName: "Hatton Garden Safe Deposit, 88-90 Hatton Garden, London",
    videoUrl: "https://www.youtube.com/watch?v=jXJbSRLfvrw",
    sourceUrl: "https://en.wikipedia.org/wiki/Hatton_Garden_safe_deposit_burglary",
    peopleInvolved: "Brian Reader (76), John 'Kenny' Collins (75), Terry Perkins (67), Danny Jones (60), Carl Wood (58), William Lincoln (60), Hugh Doyle (48). Known as the 'Bad Grandpas' or 'Diamond Wheezers'.",
    backgroundInfo: "Hatton Garden is London's jewelry quarter. The gang had decades of criminal experience between them. They disabled the lift, descended the shaft, and worked over the four-day Easter weekend when the building was closed.",
    details: "They drilled a hole 50cm deep, 25cm wide, and 45cm high through a reinforced concrete wall. The heist took two nights - they failed on the first attempt and returned the next night with a smaller drill. CCTV captured them entering and leaving. They were caught after bragging about the heist and were sentenced to a combined 34 years in prison. Much of the loot was never recovered.",
    isCrime: true,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Millennium Bridge Wobble",
    description: "On its opening day, London's new Millennium Bridge began swaying dramatically as pedestrians crossed it. The lateral movement became so pronounced that people had to hold onto the sides. The £18.2 million bridge was immediately closed and didn't reopen for nearly two years while engineers installed dampers to fix the unexpected 'synchronous lateral excitation' phenomenon.",
    category: "strange",
    eventDate: new Date("2000-06-10T12:00:00Z"),
    latitude: "51.5096",
    longitude: "-0.0982",
    locationName: "Millennium Bridge, Thames Path, London",
    videoUrl: "https://www.youtube.com/watch?v=eAXVa__XWZ8",
    sourceUrl: "https://en.wikipedia.org/wiki/Millennium_Bridge,_London",
    peopleInvolved: "Thousands of pedestrians, architects Foster and Partners, engineers Arup, sculptor Sir Anthony Caro",
    backgroundInfo: "The bridge was London's first new Thames crossing in over 100 years and the first dedicated pedestrian bridge. It connects St Paul's Cathedral to Tate Modern and Shakespeare's Globe Theatre.",
    details: "The wobbling was caused by pedestrians unconsciously adjusting their walking to match the bridge's movement, creating a feedback loop. As the bridge moved, people walked in step, amplifying the motion. Engineers installed 37 viscous dampers and 52 tuned mass dampers at a cost of £5 million. The bridge reopened in February 2002 and has been stable ever since. It's now affectionately known as the 'Wobbly Bridge.'",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Pink Floyd's Flying Pig Escapes",
    description: "During a photo shoot for Pink Floyd's 'Animals' album cover at Battersea Power Station, a 40-foot inflatable pig broke free from its moorings and floated away across London. The runaway pig disrupted flight paths at Heathrow Airport, caused a farmer's cows to panic, and sparked UFO reports before eventually landing in Kent. The band had to recreate the shot the next day.",
    category: "strange",
    eventDate: new Date("1976-12-03T10:00:00Z"),
    latitude: "51.4819",
    longitude: "-0.1447",
    locationName: "Battersea Power Station, London",
    videoUrl: "https://www.youtube.com/watch?v=7DO0PFu-K5s",
    sourceUrl: "https://en.wikipedia.org/wiki/Pink_Floyd_pigs",
    peopleInvolved: "Pink Floyd band members (Roger Waters, David Gilmour, Nick Mason, Richard Wright), photographer, marksman (who failed to shoot it down)",
    backgroundInfo: "The inflatable pig, nicknamed 'Algie,' was commissioned specifically for the album cover. A marksman was hired as a precaution but wasn't present when the pig broke free on the third day of shooting.",
    details: "High winds on December 3rd tore the pig from its cables. It rose to 18,000 feet and drifted eastward. Air traffic control at Heathrow tracked it and warned pilots. A farmer in Kent reported his cows were 'going mental.' Police received multiple UFO reports. The pig eventually deflated and landed in a field. The incident made international headlines. The iconic album cover actually combines photos from different days.",
    isCrime: false,
    isVerified: true,
    createdBy: 1,
  },
  {
    title: "Regent's Park Bandstand Bombing",
    description: "During a lunchtime concert by the Royal Green Jackets military band, an IRA bomb hidden under the bandstand detonated, killing seven bandsmen and injuring many others. The explosion occurred while they were performing music from Oliver! to an audience of 120 people in the park. This was one of two IRA attacks in London that day, occurring hours after the Hyde Park bombing.",
    category: "crime",
    eventDate: new Date("1982-07-20T12:55:00Z"),
    latitude: "51.5255",
    longitude: "-0.1559",
    locationName: "Regent's Park Bandstand, London",
    videoUrl: "https://www.youtube.com/watch?v=Gp0lQy3LvME",
    sourceUrl: "https://en.wikipedia.org/wiki/Hyde_Park_and_Regent%27s_Park_bombings",
    peopleInvolved: "7 bandsmen killed: John Heritage (19), Keith Powell (24), Laurence Smith (19), Robert Livingstone (19), John McKnight (23), George Mesure (19), and bandmaster Graham Barker (32). 24 civilians injured.",
    backgroundInfo: "The bomb had been planted under the bandstand before the concert. The Royal Green Jackets regularly performed public concerts in London parks. This attack occurred on the same day as the Hyde Park bombing, which killed four soldiers and seven horses.",
    details: "The 25-30lb bomb was packed with nails and exploded at 12:55pm, about 40 minutes into the concert. The blast was heard across central London. Witnesses described scenes of carnage with musical instruments scattered among the debris. The bandstand was destroyed. No one was ever convicted for the attack, though IRA member John Downey was charged in 2013 but the case collapsed. The attacks shocked Britain and the world.",
    isCrime: true,
    isVerified: true,
    createdBy: 1,
  },
];

async function seed() {
  try {
    console.log("Seeding database with real documented London events...");
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    for (const event of realEvents) {
      // Format date as MySQL timestamp string
      const formattedDate = event.eventDate.toISOString().slice(0, 19).replace('T', ' ');
      
      await connection.execute(
        `INSERT INTO events (title, description, category, eventDate, latitude, longitude, locationName, videoUrl, sourceUrl, peopleInvolved, backgroundInfo, details, isCrime, isVerified, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.category,
          formattedDate,
          event.latitude,
          event.longitude,
          event.locationName,
          event.videoUrl,
          event.sourceUrl,
          event.peopleInvolved,
          event.backgroundInfo,
          event.details,
          event.isCrime,
          event.isVerified,
          event.createdBy,
        ]
      );
      console.log(`✓ Added: ${event.title}`);
    }
    
    await connection.end();
    console.log("\n✅ Database seeded with 10 real documented events!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
