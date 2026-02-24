import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return `${base}-${randomUUID().split("-")[0]}`;
}

export async function seedDatabase(): Promise<void> {
  console.log("[Seed] Checking database...");

  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const hash = await bcrypt.hash("wedding2025", 12);
    await storage.createUser({ username: "admin", password: hash });
    console.log("[Seed] Created admin user (username: admin, password: wedding2025)");
  }

  const existingConfig = await storage.getWeddingConfig();
  if (!existingConfig) {
    const weddingDate = new Date("2026-12-14T10:30:00.000Z");
    await storage.upsertWeddingConfig({
      weddingDate,
      dateConfirmed: true,
      venueName: "The Grand Pavilion",
      venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
      venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
      coupleStory: "Kaustav and Himasree first met at a monsoon evening in Kolkata — over a shared umbrella and a debate about Tagore's poetry. What began as a spirited argument blossomed into countless evening walks, shared chai, and a love story written in laughter and letters.\n\nKaustav's quiet determination and Himasree's warmth made them inseparable. Through years of shared dreams and adventures, they knew they had found their forever in each other.\n\nToday, they invite you to witness the next beautiful chapter of their story.",
      whatsappEnabled: false,
      adminPasswordHash: "",
      upiId: "",
      backgroundMusicUrl: "",
      groomPhone: "+919876543210",
      bridePhone: "+919876543211",
      groomWhatsapp: "+919876543210",
      brideWhatsapp: "+919876543211",
    });
    console.log("[Seed] Created wedding config");
  }

  const existingEvents = await storage.getWeddingEvents();
  if (existingEvents.length === 0) {
    const events = [
      {
        title: "Haldi & Sangeet",
        description: "A joyful evening of music, dance, and traditional rituals. Join us for the Haldi ceremony followed by an enchanting Sangeet night filled with family performances and celebrations.",
        startTime: new Date("2026-12-13T16:00:00.000Z"),
        endTime: new Date("2026-12-13T21:00:00.000Z"),
        venueName: "Chatterjee Family Home",
        venueAddress: "45 Rabindra Nagar, Kolkata, West Bengal 700019",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Casual Indian — Yellows & Greens",
        sortOrder: 1,
        howToReach: "15 minutes from Kolkata airport by taxi. Take NH-12 and turn at Rabindra Nagar junction.",
        accommodation: "Guest rooms available at the family home. Hotels nearby: Hotel Bengal, Oberoi Grand.",
        distanceInfo: "Airport: 15 km | Railway Station (Howrah): 8 km",
        contactPerson: "Kaustav: +91 98765 43210",
      },
      {
        title: "Wedding Ceremony",
        description: "The sacred union of Kaustav and Himasree in a traditional Bengali wedding ceremony. Witness the timeless rituals of Saptapadi and exchange of garlands as our couple begins their journey together.",
        startTime: new Date("2026-12-14T05:30:00.000Z"),
        endTime: new Date("2026-12-14T09:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: true,
        dressCode: "Traditional Indian Formal",
        sortOrder: 2,
        howToReach: "Located on Marigold Lane, 10 minutes from Park Street Metro Station. Valet parking available.",
        accommodation: "The Oberoi Grand (2 km), ITC Royal Bengal (5 km), Taj Bengal (4 km)",
        distanceInfo: "Airport: 20 km | Railway Station (Howrah): 5 km",
        contactPerson: "Wedding Coordinator: +91 98765 12345",
      },
      {
        title: "Wedding Reception",
        description: "Celebrate with the newlyweds at a grand reception featuring live music, gourmet dining, and heartfelt moments shared with family and friends.",
        startTime: new Date("2026-12-14T18:00:00.000Z"),
        endTime: new Date("2026-12-14T23:00:00.000Z"),
        venueName: "The Grand Pavilion",
        venueAddress: "12 Marigold Lane, Kolkata, West Bengal 700001",
        venueMapUrl: "https://maps.google.com/?q=Kolkata+West+Bengal",
        isMainEvent: false,
        dressCode: "Indian Formal — Sarees & Sherwanis",
        sortOrder: 3,
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
      { title: "The First Meeting", date: "Monsoon 2019", description: "A chance encounter under a shared umbrella at a Kolkata bookshop. A debate about Tagore's poetry turned into hours of conversation over chai.", imageUrl: "", sortOrder: 1 },
      { title: "First Date", date: "October 2019", description: "An evening walk along the Hooghly River, watching the sunset paint the sky in shades of gold and crimson. The beginning of something beautiful.", imageUrl: "", sortOrder: 2 },
      { title: "The Long Letters", date: "2020", description: "When distance kept them apart, handwritten letters bridged the gap. Pages filled with dreams, poetry, and promises of forever.", imageUrl: "", sortOrder: 3 },
      { title: "The Proposal", date: "December 2025", description: "Under the fairy lights at their favorite rooftop cafe, Kaustav asked the question that would change their lives forever. She said yes.", imageUrl: "", sortOrder: 4 },
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

  const existingGuests = await storage.getGuests();
  if (existingGuests.length === 0) {
    const guestData = [
      { name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", side: "bride", rsvpStatus: "confirmed" },
      { name: "Rohan Das", email: "rohan@example.com", phone: "9876543211", side: "groom", rsvpStatus: "confirmed" },
      { name: "Anjali Bose", email: "anjali@example.com", phone: "9876543212", side: "bride", rsvpStatus: "pending" },
      { name: "Subhash Mukherjee", email: "subhash@example.com", phone: "9876543213", side: "groom", rsvpStatus: "pending" },
      { name: "Ritu Chatterjee", email: "ritu@example.com", phone: "9876543214", side: "both", rsvpStatus: "declined" },
    ];

    for (const g of guestData) {
      await storage.createGuest({
        ...g,
        inviteSlug: slugify(g.name),
        whatsappOptIn: false,
        adultsCount: 1,
        childrenCount: 0,
        foodPreference: "vegetarian",
        eventsAttending: "",
        dietaryRequirements: "",
        message: "",
      });
    }
    console.log("[Seed] Created sample guests");
  }

  console.log("[Seed] Database seeding complete.");
}
