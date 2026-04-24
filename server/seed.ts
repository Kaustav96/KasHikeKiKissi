import { storage } from "./storage.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  return `${base}-${randomUUID().split("-")[0]}`;
}

export async function seedDatabase(): Promise<void> {
  console.log("[Seed] Starting Firebase database check...");

  try {
    // CRITICAL: Check if already seeded FIRST (one DB call with timeout)
    // This runs on EVERY request in serverless, so must be FAST
    console.log("[Seed] Quick check: Is database already seeded?");

    const configCheckPromise = storage.getWeddingConfig();
    const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout after 15 seconds")), 15000)
    );

    let existingConfig;
    try {
      existingConfig = await Promise.race([configCheckPromise, timeoutPromise]);
    } catch (err) {
      // Database connection failed or timed out
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error("[Seed] Database connection failed:", errorMsg);
      throw new Error(`Database connection failed: ${errorMsg}`);
    }

    // FAST PATH: If config exists, database is already seeded - EXIT IMMEDIATELY
    if (existingConfig) {
      console.log("[Seed] ✓ Database already seeded (config found). Skipping initialization.");
      return; // EXIT - don't waste time checking other tables
    }

    // SLOW PATH: Database is empty, need to seed (only runs ONCE on first deployment)
    console.log("[Seed] Database is empty. Starting full initialization...");

    // Create admin user
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (!existingAdmin) {
        const hash = await bcrypt.hash("wedding2025", 10); // Reduced from 12 to 10 for speed
        await storage.createUser({ username: "admin", password: hash });
        console.log("[Seed] ✓ Created admin user");
      }
    } catch (err) {
      console.warn("[Seed] Could not create admin:", err);
      // Don't throw - admin might exist with different structure
    }

    // Create wedding config (only runs once)
    await storage.upsertWeddingConfig({
      weddingDate: null,
      venueName: "To Be Announced",
      venueAddress: "",
      venueMapUrl: "",
      coupleStory: "Lovable KIITian se shuru hui baat, dheere-dheere ek khoobsurat kahani ban gayi — jo aaj shaadi tak pahunch chuki hai.\n" +
          "Unki kahani ki shuruaat hui ek simple si movie date se. Koi fancy restaurant nahi, koi badi planning nahi — bas Bangalore ke ek mashhoor Udupi restaurant mein garma-garam dosa aur do log jo dheere-dheere ek-dusre ko samajhne lage.\n" +
          "Dosa ke saath baatein bhi banti gayi, aur baaton ke saath ek halka sa connection bhi. Kab nazrein churaane se lekar saath-saath chalne tak ka safar tay ho gaya, shayad unhe khud bhi pata nahi chala. Movie ki story shayad utni yaad nahi rahi, lekin uss shaam ek-dusre ke saath hone ki jo feeling thi, woh dil mein zaroor reh gayi.\n" +
          "Phir aaya alvida ka woh chhota sa pal. Bade tameez se unhone kaha,\n" +
          "Pehle aap auto book kar lijiye, phir main jaunga.\n" +
          "Woh auto mein baith gayi, aur thodi hi der baad ek message aaya —\n" +
          "Accha laga aapse milke.\n" +
              "Us par uska seedha sa jawab tha —\n" +
          "Phir milenge… jaldi.\n" +
    "Aur shayad wahi chhoti si line, wahi chhoti si umeed, unki kahani ka pehla sachcha chapter ban gayi. Dheere-dheere mulaqatein badhti gayi, baatein gehri hoti gayi… aur ek din wahi kahani, jo ek simple movie date aur ek plate dosa se shuru hui thi, shaadi tak aa pahunchi. ✨💛",
        adminPasswordHash: "",
        upiId: "",
        backgroundMusicUrl: [] as { name: string; url: string }[],
        viewCount: 0,
  });
    console.log("[Seed] ✓ Created wedding config");

    // Create events (only check if needed)
    const existingEvents = await storage.getWeddingEvents();
    if (existingEvents.length === 0) {
      const events: Array<{
        title: string;
        description: string;
        startTime: Date;
        endTime: Date | null;
        venueName: string;
        venueAddress: string;
        venueMapUrl: string;
        isMainEvent: boolean;
        dressCode: string;
        side: "both" | "groom" | "bride";
        sortOrder: number;
        howToReach: string;
        accommodation: string;
        distanceInfo: string;
        contactPerson: string;
      }> = [
        {
          title: "Engagement & Sangeet",
          description: "An enchanting evening of engagement ceremony followed by Sangeet night filled with music, dance performances, and celebrations. Join us as our families come together in joy and harmony.",
          startTime: new Date("2026-08-06T13:00:00.000Z"),
          endTime: new Date("2026-08-06T17:30:00.000Z"),
          venueName: "",
          venueAddress: "",
          venueMapUrl: "",
          isMainEvent: true,
          dressCode: "Indian Formal — Bright Colors Welcome",
          side: "both",
          sortOrder: 1,
          howToReach: "",
          accommodation: "",
          distanceInfo: "",
          contactPerson: "Wedding Coordinator: +91 98765 12345",
        },
        {
          title: "Haldi",
          description: "A joyful traditional ritual where turmeric paste is applied to the bride and groom, bringing blessings and glow. Join us for this vibrant, colorful ceremony filled with laughter, music, and family love.",
          startTime: new Date("2026-08-07T04:30:00.000Z"),
          endTime: new Date("2026-08-07T07:30:00.000Z"),
          venueName: "",
          venueAddress: "",
          venueMapUrl: "",
          isMainEvent: true,
          dressCode: "Casual Indian — Yellows & Greens",
          side: "both",
          sortOrder: 2,
          howToReach: "",
          accommodation: "",
          distanceInfo: "",
          contactPerson: `Kaustav: ${process.env.GROOM_PHONE || "+919876543210"}`,
        },
        {
          title: "Wedding Ceremony",
          description: "The sacred union of Kaustav and Himasree in a traditional Bengali wedding ceremony. Witness the timeless rituals of Saptapadi and exchange of garlands as our couple begins their journey together.",
          startTime: new Date("2026-08-07T13:00:00.000Z"),
          endTime: new Date("2026-08-07T17:30:00.000Z"),
          venueName: "",
          venueAddress: "",
          venueMapUrl: "",
          isMainEvent: true,
          dressCode: "Traditional Indian Formal",
          side: "both",
          sortOrder: 3,
          howToReach: "",
          accommodation: "",
          distanceInfo: "",
          contactPerson: "Wedding Coordinator: +91 98765 12345",
        },
        {
          title: "Wedding Reception",
          description: "Celebrate with the newlyweds at a grand reception featuring live music, gourmet dining, and heartfelt moments shared with family and friends. An evening of elegance, joy, and beautiful memories.",
          startTime: new Date("2026-08-10T12:30:00.000Z"),
          endTime: new Date("2026-08-10T17:30:00.000Z"),
          venueName: "",
          venueAddress: "",
          venueMapUrl: "",
          isMainEvent: true,
          dressCode: "Indian Formal — Sarees & Sherwanis",
          side: "groom",
          sortOrder: 4,
          howToReach: "",
          accommodation: "",
          distanceInfo: "",
          contactPerson: "Wedding Coordinator: +91 98765 12345",
        },
      ];

      for (const ev of events) {
        await storage.createWeddingEvent(ev);
      }
      console.log("[Seed] Created wedding events");
    }

    // Create story milestones
    const existingStories = await storage.getStoryMilestones();
    if (existingStories.length === 0) {
      const stories = [
        { title: "Our Beginning 💕", date: "10th July 2025", description: "The day our story began. Two souls found each other, and everything changed. This is where forever started — a beautiful beginning to the journey we're celebrating with you today.", imageUrl: "/Story_Of_HK.jpg", sortOrder: 1 },
        { title: "Our First Movie 🎬", date: "12th July 2025", description: "Just two days in, and we already knew something special was happening. Our first movie date was less about the film and more about those stolen glances and shared laughter. The best stories don't always happen on screen.", imageUrl: "/IMG-20260304-WA0002.jpg", sortOrder: 2 },
        { title: "Our First Photos Together 📸💕", date: "19th July 2025", description: "The day before a temporary goodbye, we made time to capture our first moments together. Even knowing distance was ahead, we held onto these memories — proof that some connections transcend miles.", imageUrl: "/IMG-20260303-WA0000.jpg", sortOrder: 3 },
        { title: "A Birthday at Isha 🎂🕉️", date: "20th November 2025", description: "A special day celebrated apart, yet close at heart. From Isha Foundation came a beautiful blessing — a Shiv ji murti and a promise to visit together soon. Some wishes are meant to be fulfilled together. 🙏", imageUrl: "/IMG-20260304-WA0003.jpg", sortOrder: 5 },
        { title: "First Christmas Together 🎄", date: "25th December 2025", description: "Our first holiday season as a couple! An evening in Jollygunj, clinking glasses and making memories. The start of a lifetime of celebrations, laughter, and traditions we'll create together.", imageUrl: "/IMG-20260304-WA0004.jpg", sortOrder: 6 },
        { title: "Laughter & Comedy 😂🎤", date: "18th January 2026", description: "Our first stand-up comedy show together! An evening filled with belly laughs, sore cheeks, and pure joy. Finding someone who makes you laugh until you cry — that's the real magic.", imageUrl: "/IMG-20260304-WA0002.jpg", sortOrder: 8 },
        { title: "Our First Flight Together ✈️💕", date: "23rd January 2026", description: "Taking flight together for the first time — to meet each other's families and take the next step. Nervous excitement, hopeful hearts, and hands held tight. Some journeys change everything.", imageUrl: "/IMG-20260303-WA0000.jpg", sortOrder: 9 },
        { title: "Blessed in Siliguri 👨‍👩‍👧‍👦🌄", date: "24th January 2026", description: "A magical trip to Siliguri where both our families came together for the first time. Exploring the hills, sharing stories, and watching our loved ones bond over momos, oranges, and laughter. This is where we received the blessings that brought us here today.", imageUrl: "/Blessed_In_Siliguri.jpg", sortOrder: 10 },
        { title: "The Dates Are Set! 📅💍", date: "13th March 2026", description: "After weeks of consulting pundits, checking calendars, and coordinating with both families, we finally locked the auspicious dates! August 6th to 10th, 2026 — when summer's warmth meets wedding festivities. The countdown to forever officially begins.", imageUrl: "", sortOrder: 11 },
      ];
      for (const s of stories) {
        await storage.createStoryMilestone(s);
      }
      console.log("[Seed] Created story milestones");
    }

    // Create FAQs
    const existingFaqs = await storage.getFaqs();
    if (existingFaqs.length === 0) {
      const faqData = [
        { question: "What is the dress code?", answer: "For the Haldi & Sangeet, we suggest comfortable Indian wear in yellows and greens. For the Wedding Ceremony, traditional Indian formal attire is preferred. For the Reception, elegant Indian formals — sarees, lehengas, sherwanis, or suits.", category: "dress-code", sortOrder: 1 },
        { question: "Is accommodation arranged for outstation guests?", answer: "Yes! We have partnered with nearby hotels for special rates. Please contact the wedding coordinator at +91 98765 12345 for bookings. Guest houses are also available on request.", category: "accommodation", sortOrder: 2 },
        { question: "How do I reach the venue from the airport?", answer: "Travel details will be shared closer to the wedding date. For any immediate queries, please contact the wedding coordinator.", category: "travel", sortOrder: 3 },
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

    console.log("[Seed] Database seeding complete!");

  } catch (error) {
    console.error("[Seed] Fatal error during seeding:", error);
    throw error;
  }
}
