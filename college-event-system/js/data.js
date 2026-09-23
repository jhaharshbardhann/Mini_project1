/* ==========================================================================
   Accurate Group of Institutions - Event Data Store & Catalog
   ========================================================================== */

const DEFAULT_EVENTS = [
    {
        id: "evt-coding",
        title: "💻 Coding Competition",
        category: "technical",
        categoryName: "Technical",
        date: "25 September 2026",
        time: "10:00 AM - 01:00 PM",
        venue: "Computer Lab 3, Tech Block",
        prize: "₹10,000",
        teamSize: "Solo / Pair (1-2 members)",
        coordinator: "Prof. R. Sharma (CSE Dept) | +91 98765 43210",
        description: "Showcase your algorithmic thinking and problem-solving skills in C++, Java, or Python. 3 coding rounds of increasing difficulty.",
        rules: [
            "Languages permitted: C++, Java, Python, C.",
            "No internet access allowed during the contest.",
            "Plagiarism will lead to immediate disqualification.",
            "Time limits and memory constraints apply on submissions."
        ]
    },
    {
        id: "evt-freefire",
        title: "🎮 Free Fire Esports Championship",
        category: "gaming",
        categoryName: "Gaming / Esports",
        date: "26 September 2026",
        time: "11:00 AM - 04:00 PM",
        venue: "Seminar Hall B & Esports Arena",
        prize: "₹15,000",
        teamSize: "Squad (4 Players)",
        coordinator: "Aman Verma (Student Lead) | +91 98123 45678",
        description: "Battle it out in the ultimate Battle Royale survival showdown. Custom room matches across Bermuda and Purgatory maps with cash prizes and trophies.",
        rules: [
            "All players must bring their own mobile devices.",
            "Emulators and iPad/tablets strictly prohibited.",
            "Stable campus 5G Wi-Fi will be provided.",
            "Room ID & Passwords shared 10 mins before match."
        ]
    },
    {
        id: "evt-cultural",
        title: "🎤 Utkarsh Cultural Fest (Dance & Music)",
        category: "cultural",
        categoryName: "Cultural",
        date: "27 September 2026",
        time: "05:00 PM - 09:00 PM",
        venue: "Main Campus Auditorium",
        prize: "₹12,000",
        teamSize: "Solo & Group Performances",
        coordinator: "Dr. Sunita Rao (Cultural Head) | +91 97654 32109",
        description: "Express your passion through solo and group vocal music, classical and western dance, drama, and open-mic performances under the grand stage lights.",
        rules: [
            "Performance time limit: 5 minutes for solo, 8 minutes for groups.",
            "Audio tracks must be submitted on pen drive 2 hours before event.",
            "Indecent attire or lyrics are strictly forbidden.",
            "Judges' decision is final and binding."
        ]
    },
    {
        id: "evt-hackathon",
        title: "🌐 Smart Campus 24H Web Hackathon",
        category: "technical",
        categoryName: "Technical",
        date: "28 September 2026",
        time: "09:00 AM (24 Hours)",
        venue: "Incubation & Innovation Lab",
        prize: "₹25,000",
        teamSize: "Team of 2-4 Members",
        coordinator: "Prof. Vikas Gupta | +91 99887 76655",
        description: "Build innovative web and mobile apps solving real campus and societal challenges. Food, power strips, and mentorship provided throughout the night.",
        rules: [
            "Themes will be unveiled at the opening ceremony.",
            "Code must be written from scratch during the hackathon period.",
            "Use of open-source libraries and APIs is permitted.",
            "Final pitch: 3 min presentation + 2 min Q&A with industry judges."
        ]
    },
    {
        id: "evt-roborace",
        title: "🤖 Robo Race & Obstacle Challenge",
        category: "technical",
        categoryName: "Technical",
        date: "29 September 2026",
        time: "02:00 PM - 05:30 PM",
        venue: "Outdoor Tech Arena (Main Lawn)",
        prize: "₹8,000",
        teamSize: "Team of 2-3 Members",
        coordinator: "Er. Deepak Kumar (ME Dept) | +91 98451 23456",
        description: "Design and race your wired or wireless RC bots through challenging mud tracks, steep ramps, sand pits, and obstacle courses against the clock.",
        rules: [
            "Robot dimensions: max 30cm x 30cm x 30cm, weight under 5 kg.",
            "Voltage across any two points must not exceed 24V DC.",
            "Penalties apply if the bot leaves the race track.",
            "Ready-to-run commercial Lego kits are not allowed."
        ]
    },
    {
        id: "evt-quiz",
        title: "🧠 Corporate & Tech Mega Quiz",
        category: "management",
        categoryName: "Management & Tech",
        date: "30 September 2026",
        time: "11:30 AM - 02:00 PM",
        venue: "Executive Conference Hall",
        prize: "₹6,000",
        teamSize: "Teams of 2 Members",
        coordinator: "Prof. Neha Tyagi (MBA Dept) | +91 97112 23344",
        description: "Test your knowledge in technology trends, business current affairs, startup culture, and logical aptitude across 5 interactive buzzer rounds.",
        rules: [
            "Preliminary written screening round followed by stage finals.",
            "Top 6 teams qualify for the buzzer rounds.",
            "No electronic devices permitted during the quiz."
        ]
    }
];

// Helper to get all events (synced with localStorage)
function getAllEvents() {
    const stored = localStorage.getItem("agi_events_catalog");
    if (!stored) {
        localStorage.setItem("agi_events_catalog", JSON.stringify(DEFAULT_EVENTS));
        return DEFAULT_EVENTS;
    }
    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_EVENTS;
    } catch (e) {
        return DEFAULT_EVENTS;
    }
}

// Helper to save events
function saveEvents(eventsList) {
    localStorage.setItem("agi_events_catalog", JSON.stringify(eventsList));
}

// Helper to find single event by title or id
function getEventByIdOrTitle(query) {
    if (!query) return null;
    const events = getAllEvents();
    const cleanQuery = query.trim().toLowerCase();
    return events.find(e => 
        e.id.toLowerCase() === cleanQuery || 
        e.title.toLowerCase().includes(cleanQuery) ||
        cleanQuery.includes(e.title.toLowerCase())
    );
}

// Helper to get registrations
function getAllRegistrations() {
    const stored = localStorage.getItem("agi_all_registrations");
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        return [];
    }
}

// Helper to save registrations list
function saveAllRegistrations(registrations) {
    localStorage.setItem("agi_all_registrations", JSON.stringify(registrations));
}
