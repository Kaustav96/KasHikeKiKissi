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
      backgroundMusicUrl: "",
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
      { title: "Our Beginning 💕", date: "10th July 2025", description: "The day our story began! The universe brought us together and everything changed. This is where it all started, and I'm so grateful for every moment since then.", imageUrl: "", sortOrder: 1 },
      { title: "Our First Movie 🎬", date: "12th July 2025", description: "Our first movie date! Just two days after we met, and I already knew I wanted to spend more time with you. The movie was great, but honestly, I was just happy to be sitting next to you.", imageUrl: "", sortOrder: 2 },
      { title: "Our First Photos Together 📸💕", date: "19th July 2025", description: "The day before you left. We knew we had to meet even though you needed to pack and prepare. We took our first photos together that day - memories I'll treasure forever. That's when I knew distance wouldn't matter.", imageUrl: "", sortOrder: 3 },
      { title: "First Pub Outing 🍻", date: "24th August 2025", description: "Our first pub outing at Reservoir! We had so much fun together, and even the little moments of you being late and us being silly made it special. Those playful moments just show how comfortable we are with each other!", imageUrl: "", sortOrder: 4 },
      { title: "Your Birthday at Isha 🎂🕉️", date: "20th November 2025", description: "Your special day! Even though you were away at Isha Foundation, you thought of me and brought back a beautiful Shiv ji murti. You made me promise that once I get a job, we'll go there together. Mannat pura karna zaruri hai, and I promise we'll do it this year for sure! 🙏", imageUrl: "", sortOrder: 5 },
      { title: "First Christmas Together 🎄", date: "25th December 2025", description: "Our first Christmas together! We went to Jollygunj and had drinks together for the first time. It felt so special celebrating this day with you. Here's to many more holidays together!", imageUrl: "", sortOrder: 6 },
      { title: "You getting your desired role in IBM! 🎉💼", date: "January 2026", description: "Finally after 3 days of tension and month long interview process, you got your desired role in IBM. I'm so proud of you and all your hard work. This is just the beginning of many more achievements to come. Let's celebrate this milestone together!", imageUrl: "", sortOrder: 7 },
      { title: "Our first stand-up comedy show together 😂🎤", date: "18th January 2026", description: "Our first stand-up comedy show together! We laughed so hard that our cheeks hurt. Sharing those joyful moments with you makes everything better. Can't wait for more fun evenings/nights like this!", imageUrl: "", sortOrder: 8 },
      { title: "Our first flight together ✈️💕", date: "23rd January 2026", description: "Our first flight together, where we go and see each others parents for first time and hoping everything goes well. I'm so proud of us for taking this step together. Here's to many more journeys and adventures with you by my side.", imageUrl: "", sortOrder: 9 },
      { title: "Full Family trip in Siliguri! 👨‍👩‍👧‍👦🌄", date: "24th January 2026", description: "Our first full family trip to Siliguri! It was so special to see you bond with my family and create memories together. From exploring new places to sharing laughs, this trip was unforgettable because of you. Also getting the nod from both our families for marriage is a huge milestone for us.", imageUrl: "", sortOrder: 10 },
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