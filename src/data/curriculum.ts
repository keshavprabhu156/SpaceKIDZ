/**
 * Curriculum data model.
 *
 * NOTE: This static module is the seed/mock content source. In production the
 * same shapes are served from PostgreSQL via Prisma (see prisma/schema.prisma)
 * through /api/curriculum — the UI consumes only these types, so swapping the
 * source requires no component changes.
 */

import type {
  Chapter,
  Grade,
  Lesson,
  LessonRef,
  LessonType,
  Term,
} from "@/types/curriculum";

// Re-exported so existing call sites importing these from the data module keep working.
export type { Chapter, Grade, Lesson, LessonRef, LessonType, Term };

const lesson = (
  id: string,
  title: string,
  type: LessonType,
  duration = 15,
  xp = 50
): Lesson => ({ id, title, type, duration, xp });

export const grades: Grade[] = [
  {
    grade: 4,
    codename: "CADET",
    tagline: "First Steps Into the Cosmos",
    theme: "Discovering the Sky, Earth & Our Place in Space",
    color: "#4cc9f0",
    terms: [
      {
        id: "g4-t1",
        title: "Term 1 — Looking Up",
        chapters: [
          {
            id: "g4-c1",
            title: "Our Home Planet Earth",
            description: "Earth as a planet — day, night, seasons and the view from orbit.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g4-c1-l1", "Earth From Space", "reading"),
              lesson("g4-c1-l2", "Spin the Earth: Day & Night", "3d-model", 20, 80),
              lesson("g4-c1-l3", "Seasons Simulator", "simulation", 20, 80),
              lesson("g4-c1-l4", "Checkpoint: Planet Earth", "quiz", 10, 60),
            ],
          },
          {
            id: "g4-c2",
            title: "The Moon — Our Companion",
            description: "Phases, craters, tides and the story of lunar exploration.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g4-c2-l1", "Why the Moon Changes Shape", "reading"),
              lesson("g4-c2-l2", "Crater Experiment at Home", "experiment", 30, 100),
              lesson("g4-c2-l3", "Explore the Moon in 3D", "3d-model", 20, 80),
              lesson("g4-c2-l4", "Checkpoint: Moon Master", "quiz", 10, 60),
            ],
          },
          {
            id: "g4-c3",
            title: "The Sun — Our Star",
            description: "What the Sun is made of, solar energy and staying safe observing it.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g4-c3-l1", "Inside Our Star", "reading"),
              lesson("g4-c3-l2", "Solar Energy Activity", "activity", 25, 90),
              lesson("g4-c3-l3", "Checkpoint: Solar Scientist", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g4-t2",
        title: "Term 2 — The Solar Neighbourhood",
        chapters: [
          {
            id: "g4-c4",
            title: "Meet the Planets",
            description: "A guided tour of all eight planets with interactive 3D flybys.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g4-c4-l1", "Solar System Flyby", "simulation", 25, 100),
              lesson("g4-c4-l2", "Rocky vs Gas Planets", "reading"),
              lesson("g4-c4-l3", "Build Your Solar System", "activity", 30, 120),
              lesson("g4-c4-l4", "Checkpoint: Planet Explorer", "quiz", 10, 60),
            ],
          },
          {
            id: "g4-c5",
            title: "Stars & Constellations",
            description: "Star patterns, navigation by the night sky, and star life stories.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g4-c5-l1", "Find the Constellations", "simulation", 20, 80),
              lesson("g4-c5-l2", "Make a Star Wheel", "experiment", 30, 100),
              lesson("g4-c5-l3", "Checkpoint: Star Navigator", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 5,
    codename: "EXPLORER",
    tagline: "Machines That Touch the Sky",
    theme: "Rockets, Flight & the Journey to Orbit",
    color: "#3b6af0",
    terms: [
      {
        id: "g5-t1",
        title: "Term 1 — The Science of Flight",
        chapters: [
          {
            id: "g5-c1",
            title: "How Things Fly",
            description: "Forces of flight — lift, thrust, drag and gravity in action.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g5-c1-l1", "Four Forces of Flight", "reading"),
              lesson("g5-c1-l2", "Paper Glider Lab", "experiment", 30, 100),
              lesson("g5-c1-l3", "Checkpoint: Flight Basics", "quiz", 10, 60),
            ],
          },
          {
            id: "g5-c2",
            title: "Rockets 101",
            description: "Newton's third law, rocket parts and how launches work.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g5-c2-l1", "Anatomy of a Rocket", "3d-model", 20, 80),
              lesson("g5-c2-l2", "Balloon Rocket Experiment", "experiment", 25, 90),
              lesson("g5-c2-l3", "Assemble a Rocket", "simulation", 25, 120),
              lesson("g5-c2-l4", "Checkpoint: Rocketeer", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g5-t2",
        title: "Term 2 — Reaching Orbit",
        chapters: [
          {
            id: "g5-c3",
            title: "What Is an Orbit?",
            description: "Why satellites don't fall down — gravity and sideways speed.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g5-c3-l1", "Orbit Simulator", "simulation", 25, 100),
              lesson("g5-c3-l2", "Newton's Cannonball", "reading"),
              lesson("g5-c3-l3", "Checkpoint: Orbit Officer", "quiz", 10, 60),
            ],
          },
          {
            id: "g5-c4",
            title: "Famous Missions",
            description: "From Sputnik to today — the missions that changed history.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g5-c4-l1", "Timeline of Space", "reading"),
              lesson("g5-c4-l2", "Mission Report Activity", "activity", 30, 100),
              lesson("g5-c4-l3", "Checkpoint: Space Historian", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 6,
    codename: "PILOT",
    tagline: "Signals From Above",
    theme: "Satellites, Communication & Observing Earth",
    color: "#22d3ee",
    terms: [
      {
        id: "g6-t1",
        title: "Term 1 — Satellite Science",
        chapters: [
          {
            id: "g6-c1",
            title: "Anatomy of a Satellite",
            description: "Buses, payloads, solar panels, antennas — explore each subsystem in 3D.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g6-c1-l1", "Satellite Anatomy Explorer", "3d-model", 25, 100),
              lesson("g6-c1-l2", "Label the Satellite", "activity", 15, 70),
              lesson("g6-c1-l3", "Checkpoint: Satellite Engineer", "quiz", 10, 60),
            ],
          },
          {
            id: "g6-c2",
            title: "Types of Orbits",
            description: "LEO, MEO, GEO and polar orbits — who uses which and why.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g6-c2-l1", "Orbit Types Simulator", "simulation", 25, 100),
              lesson("g6-c2-l2", "Match Orbits to Missions", "activity", 15, 70),
              lesson("g6-c2-l3", "Checkpoint: Orbit Analyst", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g6-t2",
        title: "Term 2 — Talking to Space",
        chapters: [
          {
            id: "g6-c3",
            title: "Space Communication",
            description: "Radio waves, ground stations and how data travels from orbit.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g6-c3-l1", "The Journey of a Signal", "reading"),
              lesson("g6-c3-l2", "Satellite Communication Challenge", "simulation", 25, 110),
              lesson("g6-c3-l3", "Checkpoint: Comms Operator", "quiz", 10, 60),
            ],
          },
          {
            id: "g6-c4",
            title: "Eyes on Earth",
            description: "Remote sensing — weather, farming, disasters and climate from orbit.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g6-c4-l1", "Reading Satellite Images", "activity", 25, 90),
              lesson("g6-c4-l2", "Track a Storm Mission", "simulation", 25, 110),
              lesson("g6-c4-l3", "Checkpoint: Earth Observer", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 7,
    codename: "ENGINEER",
    tagline: "Build for the Void",
    theme: "Spacecraft Engineering & CubeSat Design",
    color: "#a855f7",
    terms: [
      {
        id: "g7-t1",
        title: "Term 1 — Engineering for Space",
        chapters: [
          {
            id: "g7-c1",
            title: "Surviving Space",
            description: "Vacuum, radiation, temperature swings — engineering against the void.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g7-c1-l1", "The Space Environment", "reading"),
              lesson("g7-c1-l2", "Thermal Blanket Experiment", "experiment", 30, 110),
              lesson("g7-c1-l3", "Checkpoint: Environment Expert", "quiz", 10, 60),
            ],
          },
          {
            id: "g7-c2",
            title: "CubeSat Design Studio",
            description: "Design a 1U CubeSat — power budget, payload choice, structure.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g7-c2-l1", "What Is a CubeSat?", "reading"),
              lesson("g7-c2-l2", "Build a CubeSat Simulator", "simulation", 35, 150),
              lesson("g7-c2-l3", "Power Budget Worksheet", "activity", 25, 90),
              lesson("g7-c2-l4", "Checkpoint: CubeSat Designer", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g7-t2",
        title: "Term 2 — Systems Thinking",
        chapters: [
          {
            id: "g7-c3",
            title: "Power in Space",
            description: "Solar arrays, batteries and managing every precious watt.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g7-c3-l1", "Solar Array Mechanics", "3d-model", 20, 80),
              lesson("g7-c3-l2", "Eclipse Survival Challenge", "simulation", 25, 110),
              lesson("g7-c3-l3", "Checkpoint: Power Systems", "quiz", 10, 60),
            ],
          },
          {
            id: "g7-c4",
            title: "Attitude & Control",
            description: "How spacecraft point — reaction wheels, magnetorquers, star trackers.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g7-c4-l1", "Pointing in Zero-G", "reading"),
              lesson("g7-c4-l2", "Dock the Spacecraft", "simulation", 30, 130),
              lesson("g7-c4-l3", "Checkpoint: ADCS Operator", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 8,
    codename: "SCIENTIST",
    tagline: "Question the Universe",
    theme: "Astrophysics, Gravity & the Physics of Space",
    color: "#7b2ff7",
    terms: [
      {
        id: "g8-t1",
        title: "Term 1 — Forces of the Cosmos",
        chapters: [
          {
            id: "g8-c1",
            title: "Gravity Deep Dive",
            description: "From falling apples to orbital mechanics and microgravity.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g8-c1-l1", "Gravity Simulator Lab", "simulation", 30, 120),
              lesson("g8-c1-l2", "Weight Across Worlds", "activity", 20, 80),
              lesson("g8-c1-l3", "Checkpoint: Gravity Guru", "quiz", 10, 60),
            ],
          },
          {
            id: "g8-c2",
            title: "Light & Telescopes",
            description: "The electromagnetic spectrum and how telescopes see the invisible.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g8-c2-l1", "Beyond Visible Light", "reading"),
              lesson("g8-c2-l2", "Build a Spectroscope", "experiment", 35, 130),
              lesson("g8-c2-l3", "Checkpoint: Light Detective", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g8-t2",
        title: "Term 2 — Stars & Beyond",
        chapters: [
          {
            id: "g8-c3",
            title: "Life of Stars",
            description: "Nebulae, main sequence, supernovae, neutron stars and black holes.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g8-c3-l1", "Stellar Evolution Journey", "reading", 20, 80),
              lesson("g8-c3-l2", "HR Diagram Activity", "activity", 25, 90),
              lesson("g8-c3-l3", "Checkpoint: Stellar Scientist", "quiz", 10, 60),
            ],
          },
          {
            id: "g8-c4",
            title: "Galaxies & the Universe",
            description: "Galaxy types, the expanding universe and cosmic scale.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g8-c4-l1", "Scale of the Universe", "simulation", 25, 100),
              lesson("g8-c4-l2", "Checkpoint: Cosmologist", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 9,
    codename: "COMMANDER",
    tagline: "Lead the Mission",
    theme: "Mission Design, Robotics & Planetary Exploration",
    color: "#f0abfc",
    terms: [
      {
        id: "g9-t1",
        title: "Term 1 — Mission Architecture",
        chapters: [
          {
            id: "g9-c1",
            title: "Designing a Mission",
            description: "Requirements, trade-offs, launch windows and delta-v budgets.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g9-c1-l1", "Mission Design Studio", "simulation", 35, 150),
              lesson("g9-c1-l2", "Delta-V Budget Lab", "activity", 30, 120),
              lesson("g9-c1-l3", "Checkpoint: Mission Architect", "quiz", 10, 60),
            ],
          },
          {
            id: "g9-c2",
            title: "Robotic Explorers",
            description: "Rovers, landers and probes — autonomy at 20 light-minutes.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g9-c2-l1", "Mars Rover Navigation", "simulation", 30, 130),
              lesson("g9-c2-l2", "Program a Rover Path", "activity", 30, 120),
              lesson("g9-c2-l3", "Checkpoint: Rover Operator", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g9-t2",
        title: "Term 2 — Destination Worlds",
        chapters: [
          {
            id: "g9-c3",
            title: "Mars: The Next Frontier",
            description: "Martian geology, atmosphere and the challenges of settlement.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g9-c3-l1", "Mars in 3D", "3d-model", 25, 100),
              lesson("g9-c3-l2", "Design a Mars Habitat", "activity", 35, 140),
              lesson("g9-c3-l3", "Checkpoint: Mars Specialist", "quiz", 10, 60),
            ],
          },
          {
            id: "g9-c4",
            title: "Ocean Worlds & Icy Moons",
            description: "Europa, Enceladus, Titan — the search for life beyond Earth.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g9-c4-l1", "Ocean Worlds Tour", "reading", 20, 80),
              lesson("g9-c4-l2", "Checkpoint: Astrobiologist", "quiz", 10, 60),
            ],
          },
        ],
      },
    ],
  },
  {
    grade: 10,
    codename: "ASTRONAUT",
    tagline: "Ready for Launch",
    theme: "Human Spaceflight, Space Industry & Your Future in Space",
    color: "#f5c542",
    terms: [
      {
        id: "g10-t1",
        title: "Term 1 — Humans in Space",
        chapters: [
          {
            id: "g10-c1",
            title: "Living in Orbit",
            description: "Life support, microgravity health and daily life on a space station.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g10-c1-l1", "Space Station Systems", "3d-model", 30, 120),
              lesson("g10-c1-l2", "Life Support Challenge", "simulation", 30, 130),
              lesson("g10-c1-l3", "Checkpoint: Station Crew", "quiz", 10, 60),
            ],
          },
          {
            id: "g10-c2",
            title: "Astronaut Training",
            description: "Selection, training and what it takes to fly.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g10-c2-l1", "Inside Astronaut Training", "reading", 20, 80),
              lesson("g10-c2-l2", "Moon Landing Challenge", "simulation", 30, 140),
              lesson("g10-c2-l3", "Checkpoint: Flight Ready", "quiz", 10, 60),
            ],
          },
        ],
      },
      {
        id: "g10-t2",
        title: "Term 2 — The Space Economy",
        chapters: [
          {
            id: "g10-c3",
            title: "The New Space Industry",
            description: "Commercial launch, mega-constellations, space policy and law.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g10-c3-l1", "The Space Economy Map", "activity", 25, 100),
              lesson("g10-c3-l2", "Constellation Planner", "simulation", 30, 130),
              lesson("g10-c3-l3", "Checkpoint: Industry Analyst", "quiz", 10, 60),
            ],
          },
          {
            id: "g10-c4",
            title: "Careers in Space",
            description: "Engineering, science, medicine, law, art — pathways to the stars.",
            hasWeeklyTest: true,
            lessons: [
              lesson("g10-c4-l1", "Meet Space Professionals", "reading", 20, 80),
              lesson("g10-c4-l2", "Capstone Mission Project", "activity", 60, 300),
              lesson("g10-c4-l3", "Final Assessment", "quiz", 20, 120),
            ],
          },
        ],
      },
    ],
  },
];

export const getGrade = (grade: number) => grades.find((g) => g.grade === grade);

export function findLesson(lessonId: string): LessonRef | null {
  for (const grade of grades) {
    for (const term of grade.terms) {
      for (const chapter of term.chapters) {
        const i = chapter.lessons.findIndex((l) => l.id === lessonId);
        if (i !== -1) {
          return {
            grade,
            term,
            chapter,
            lesson: chapter.lessons[i],
            prev: chapter.lessons[i - 1] ?? null,
            next: chapter.lessons[i + 1] ?? null,
          };
        }
      }
    }
  }
  return null;
}

export const lessonTypeMeta: Record<LessonType, { label: string; icon: string }> = {
  "3d-model": { label: "3D Model", icon: "◈" },
  activity: { label: "Activity", icon: "✎" },
  experiment: { label: "Experiment", icon: "⚗" },
  simulation: { label: "Simulation", icon: "◉" },
  reading: { label: "Reading", icon: "☰" },
  quiz: { label: "Quiz", icon: "?" },
};
