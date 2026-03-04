import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return `${base}-${randomUUID().split("-")[0]}`;
}

export async function seedDatabase(): Promise<void> {
  console.log("[Seed] Checking database...");
  console.log("[Seed] Database URL:", process.env.DATABASE_URL?.replace(/:\/\/[^:]+:[^@]+@/, "://****:****@"));

  try {
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const hash = await bcrypt.hash("wedding2025", 12);
      await storage.createUser({ username: "admin", password: hash });
      console.log("[Seed] Created admin user (username: admin, password: wedding2025)");
    } else {
      console.log("[Seed] Admin user already exists");
    }
  } catch (err) {
    console.error("[Seed] Error checking/creating admin:", err);
    throw err;
  }

  const existingConfig = await storage.getWeddingConfig();
  if (!existingConfig) {
    await storage.upsertWeddingConfig({
      weddingDate: null, // Default to TBD
      venueName: "The Grand Pavilion",
      venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
      venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
      coupleStory: "Kaustav and Himasree first met at a monsoon evening in Kolkata — over a shared umbrella and a debate about Tagore's poetry. What began as a spirited argument blossomed into countless evening walks, shared chai, and a love story written in laughter and letters.\n\nKaustav's quiet determination and Himasree's warmth made them inseparable. Through years of shared dreams and adventures, they knew they had found their forever in each other.\n\nToday, they invite you to witness the next beautiful chapter of their story.",
      adminPasswordHash: "",
      upiId: "",
      backgroundMusicUrl: [] as { name: string; url: string }[],
      viewCount: 0,
    });
    console.log("[Seed] Created wedding config");
  }

  const existingEvents = await storage.getWeddingEvents();
  if (existingEvents.length === 0) {
    const events = [
      {
        title: "Haldi",
        description: "A joyful traditional ritual where turmeric paste is applied to the bride and groom, bringing blessings and glow. Join us for this vibrant, colorful ceremony filled with laughter, music, and family love.",
        startTime: new Date("2026-12-12T15:00:00.000Z"),
        endTime: new Date("2026-12-12T18:00:00.000Z"),
        venueName: "Chatterjee Family Home",
        venueAddress: "45 Rabindra Nagar, Kolkata, West Bengal 700019",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Casual Indian — Yellows & Greens",
        side: "both",
        sortOrder: 1,
        howToReach: "15 minutes from Kolkata airport by taxi. Take NH-12 and turn at Rabindra Nagar junction.",
        accommodation: "Guest rooms available at the family home. Hotels nearby: Hotel Bengal, Oberoi Grand.",
        distanceInfo: "Airport: 15 km | Railway Station (Howrah): 8 km",
        contactPerson: `Kaustav: ${process.env.GROOM_PHONE || "+919876543210"}`,
      },
      {
        title: "Engagement & Sangeet",
        description: "An enchanting evening of engagement ceremony followed by Sangeet night filled with music, dance performances, and celebrations. Join us as our families come together in joy and harmony.",
        startTime: new Date("2026-12-12T18:30:00.000Z"),
        endTime: new Date("2026-12-12T23:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Indian Formal — Bright Colors Welcome",
        side: "both",
        sortOrder: 2,
        howToReach: "Located on Marigold Lane, 10 minutes from Park Street Metro Station. Valet parking available.",
        accommodation: "The Oberoi Grand (2 km), ITC Royal Bengal (5 km), Taj Bengal (4 km)",
        distanceInfo: "Airport: 20 km | Railway Station (Howrah): 5 km",
        contactPerson: "Wedding Coordinator: +91 98765 12345",
      },
      {
        title: "Wedding Ceremony",
        description: "The sacred union of Kaustav and Himasree in a traditional Bengali wedding ceremony. Witness the timeless rituals of Saptapadi and exchange of garlands as our couple begins their journey together.",
        startTime: new Date("2026-12-13T05:30:00.000Z"),
        endTime: new Date("2026-12-13T09:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: true,
        dressCode: "Traditional Indian Formal",
        side: "both",
        sortOrder: 3,
        howToReach: "Located on Marigold Lane, 10 minutes from Park Street Metro Station. Valet parking available.",
        accommodation: "The Oberoi Grand (2 km), ITC Royal Bengal (5 km), Taj Bengal (4 km)",
        distanceInfo: "Airport: 20 km | Railway Station (Howrah): 5 km",
        contactPerson: "Wedding Coordinator: +91 98765 12345",
      },
      {
        title: "Vidai & Bashi Biye",
        description: "A touching farewell ceremony as the bride departs from her parental home, followed by Bashi Biye—the post-wedding rituals. An emotional and beautiful Bengali tradition celebrating new beginnings.",
        startTime: new Date("2026-12-14T10:00:00.000Z"),
        endTime: new Date("2026-12-14T13:00:00.000Z"),
        venueName: "Bride's Family Home",
        venueAddress: "45 Rabindra Nagar, Kolkata, West Bengal 700019",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Traditional Indian — Elegant Attire",
        side: "bride",
        sortOrder: 4,
        howToReach: "15 minutes from Kolkata airport by taxi. Take NH-12 and turn at Rabindra Nagar junction.",
        accommodation: "Guest rooms available at the family home. Hotels nearby: Hotel Bengal, Oberoi Grand.",
        distanceInfo: "Airport: 15 km | Railway Station (Howrah): 8 km",
        contactPerson: `Himasree: ${process.env.BRIDE_PHONE || "+919876543211"}`,
      },
      {
        title: "Wedding Reception",
        description: "Celebrate with the newlyweds at a grand reception featuring live music, gourmet dining, and heartfelt moments shared with family and friends. An evening of elegance, joy, and beautiful memories.",
        startTime: new Date("2026-12-15T18:00:00.000Z"),
        endTime: new Date("2026-12-15T23:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Indian Formal — Sarees & Sherwanis",
        side: "both",
        sortOrder: 5,
        howToReach: "Same venue as the wedding ceremony. Complimentary shuttle from select hotels.",
        accommodation: "The Oberoi Grand (2 km), ITC Royal Bengal (5 km), Taj Bengal (4 km)",
        distanceInfo: "Airport: 20 km | Railway Station (Howrah): 5 km",
        contactPerson: "Wedding Coordinator: +91 98765 12345",
      },
    ];

    for (const ev of events) {
      await storage.createWeddingEvent(ev);
    }
    console.log("[Seed] Created wedding events");
  }

  const existingStories = await storage.getStoryMilestones();
  if (existingStories.length === 0) {
    const stories = [
      { title: "Our Beginning 💕", date: "10th July 2025", description: "The day our story began. Two souls found each other, and everything changed. This is where forever started — a beautiful beginning to the journey we're celebrating with you today.", imageUrl: "/Story_Of_HK.jpg", sortOrder: 1 },
      { title: "Our First Movie 🎬", date: "12th July 2025", description: "Just two days in, and we already knew something special was happening. Our first movie date was less about the film and more about those stolen glances and shared laughter. The best stories don't always happen on screen.", imageUrl: "/IMG-20260304-WA0002.jpg", sortOrder: 2 },
      { title: "Our First Photos Together 📸💕", date: "19th July 2025", description: "The day before a temporary goodbye, we made time to capture our first moments together. Even knowing distance was ahead, we held onto these memories — proof that some connections transcend miles.", imageUrl: "/IMG-20260303-WA0000.jpg", sortOrder: 3 },
      // { title: "First Pub Outing 🍻", date: "24th August 2025", description: "Our first evening out at Reservoir! From running late to endless laughter, every little moment felt effortless. That's when we knew — we'd found someone we could be completely ourselves with.", imageUrl: "", sortOrder: 4 },
      { title: "A Birthday at Isha 🎂🕉️", date: "20th November 2025", description: "A special day celebrated apart, yet close at heart. From Isha Foundation came a beautiful blessing — a Shiv ji murti and a promise to visit together soon. Some wishes are meant to be fulfilled together. 🙏", imageUrl: "/IMG-20260304-WA0003.jpg", sortOrder: 5 },
      { title: "First Christmas Together 🎄", date: "25th December 2025", description: "Our first holiday season as a couple! An evening in Jollygunj, clinking glasses and making memories. The start of a lifetime of celebrations, laughter, and traditions we'll create together.", imageUrl: "/IMG-20260304-WA0004.jpg", sortOrder: 6 },
      // { title: "A Dream Role Achieved 🎉💼", date: "January 2026", description: "After weeks of anticipation and hard work, the dream role at IBM became reality. Celebrating victories together — big and small — that's what partnership is all about. Here's to many more milestones ahead!", imageUrl: "", sortOrder: 7 },
      { title: "Laughter & Comedy 😂🎤", date: "18th January 2026", description: "Our first stand-up comedy show together! An evening filled with belly laughs, sore cheeks, and pure joy. Finding someone who makes you laugh until you cry — that's the real magic.", imageUrl: "/IMG-20260304-WA0002.jpg", sortOrder: 8 },
      { title: "Our First Flight Together ✈️💕", date: "23rd January 2026", description: "Taking flight together for the first time — to meet each other's families and take the next step. Nervous excitement, hopeful hearts, and hands held tight. Some journeys change everything.", imageUrl: "/IMG-20260303-WA0000.jpg", sortOrder: 9 },
      { title: "Blessed in Siliguri 👨‍👩‍👧‍👦🌄", date: "24th January 2026", description: "A magical trip to Siliguri where both our families came together for the first time. Exploring the hills, sharing stories, and watching our loved ones bond over momos, oranges, and laughter. This is where we received the blessings that brought us here today.", imageUrl: "/Blessed_In_Siliguri.jpg", sortOrder: 10 },
    ];
    for (const s of stories) {
      await storage.createStoryMilestone(s);
    }
    console.log("[Seed] Created story milestones");
  }

  const existingVenues = await storage.getVenues();
  if (existingVenues.length === 0) {
    await storage.createVenue({
      name: "The Grand Pavilion",
      address: "12 Marigold Lane, Kolkata, West Bengal 700001",
      description: "A magnificent heritage banquet hall featuring grand chandeliers, marble floors, and lush gardens. The perfect setting for a royal Bengali wedding.",
      mapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0!2d88.35!3d22.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKolkata!5e0!3m2!1sen!2sin!4v1",
      directions: "From Airport: Take NH-12 towards the city center (20 km, ~45 min). From Howrah Station: Cross Howrah Bridge, head towards Park Street (5 km, ~20 min). From Sealdah Station: Head west on APC Road (3 km, ~15 min).",
      accommodation: "The Oberoi Grand — 2 km (Luxury)\nITC Royal Bengal — 5 km (Luxury)\nTaj Bengal — 4 km (Premium)\nHotel Hindustan International — 1 km (Mid-range)\nGuest houses available on request — contact the wedding coordinator.",
      contactInfo: "Wedding Coordinator: +91 98765 12345\nVenue Manager: +91 98765 67890",
      imageUrl: "",
      sortOrder: 1,
    });
    console.log("[Seed] Created venue");
  }

  const existingFaqs = await storage.getFaqs();
  if (existingFaqs.length === 0) {
    const faqData = [
      { question: "What is the dress code?", answer: "For the Haldi & Sangeet, we suggest comfortable Indian wear in yellows and greens. For the Wedding Ceremony, traditional Indian formal attire is preferred. For the Reception, elegant Indian formals — sarees, lehengas, sherwanis, or suits.", category: "dress-code", sortOrder: 1 },
      { question: "Is accommodation arranged for outstation guests?", answer: "Yes! We have partnered with nearby hotels for special rates. Please contact the wedding coordinator at +91 98765 12345 for bookings. Guest houses are also available on request.", category: "accommodation", sortOrder: 2 },
      { question: "How do I reach the venue from the airport?", answer: "The Grand Pavilion is approximately 20 km from Netaji Subhas Chandra Bose International Airport. Taxis and app-based cabs (Ola/Uber) are readily available. The drive takes about 45 minutes.", category: "travel", sortOrder: 3 },
      { question: "What are the main rituals during the ceremony?", answer: "The Bengali wedding ceremony includes traditional rituals such as Saat Paak, Subho Drishti, Mala Badal (garland exchange), Saptapadi (seven steps), and Sindoor Daan. Each ritual holds deep cultural significance.", category: "rituals", sortOrder: 4 },
      { question: "Can I bring a plus one?", answer: "Your invitation specifies the number of guests. If you'd like to bring an additional guest, please contact us and we'll do our best to accommodate.", category: "general", sortOrder: 5 },
      { question: "Is the venue child-friendly?", answer: "Absolutely! Children are welcome at all events. A dedicated kids' area with activities will be set up at the reception venue.", category: "general", sortOrder: 6 },
      { question: "Who should I contact for questions?", answer: "For any queries, please reach out to the Wedding Coordinator at +91 98765 12345 or email wedding@kaustavhimasree.com", category: "contact", sortOrder: 7 },
    ];
    for (const f of faqData) {
      await storage.createFaq(f);
    }
    console.log("[Seed] Created FAQs");
  }

  // No default guests - they will be created via RSVP submissions

  console.log("[Seed] Database seeding complete.");
}


// seedDatabase()
//   .then(() => {
//     console.log("[Seed] Done.");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error("[Seed] Failed:", err);
//     process.exit(1);
//   });