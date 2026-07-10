export interface Game {
  id: string;
  title: string;
  description: string;
  category: "build" | "pilot" | "explore" | "puzzle";
  difficulty: 1 | 2 | 3;
  xp: number;
  minGrade: number;
  playable: boolean; // playable in-browser today; others ship with curriculum content
  icon: string;
}

export const games: Game[] = [
  { id: "space-quiz", title: "Space Quiz Challenge", description: "Race the clock across the cosmos. Answer fast, climb the galactic leaderboard.", category: "puzzle", difficulty: 1, xp: 150, minGrade: 4, playable: true, icon: "🛰" },
  { id: "space-memory", title: "Space Memory Game", description: "Match spacecraft, planets and mission patches before your oxygen timer runs out.", category: "puzzle", difficulty: 1, xp: 100, minGrade: 4, playable: true, icon: "🪐" },
  { id: "orbit-simulator", title: "Satellite Orbit Simulator", description: "Adjust velocity and altitude to achieve a stable orbit without burning up or drifting away.", category: "pilot", difficulty: 2, xp: 250, minGrade: 5, playable: true, icon: "🌍" },
  { id: "build-cubesat", title: "Build a CubeSat", description: "Select subsystems, balance the power budget and pass launch review.", category: "build", difficulty: 2, xp: 300, minGrade: 7, playable: false, icon: "📦" },
  { id: "assemble-rocket", title: "Assemble a Rocket", description: "Stack stages, mount engines and fairings in the correct order — then launch.", category: "build", difficulty: 1, xp: 200, minGrade: 5, playable: true, icon: "🚀" },
  { id: "launch-mission", title: "Launch Mission", description: "Run the full countdown. Weather, fuel, telemetry — every call is yours, Flight.", category: "pilot", difficulty: 3, xp: 400, minGrade: 8, playable: false, icon: "🎛" },
  { id: "mission-control", title: "Mission Control Simulation", description: "Coordinate a live mission across stations: CAPCOM, FIDO, EECOM and Surgeon.", category: "pilot", difficulty: 3, xp: 450, minGrade: 9, playable: false, icon: "🖥" },
  { id: "dock-spacecraft", title: "Dock the Spacecraft", description: "Precision thruster control to dock with the station. Slow is smooth, smooth is fast.", category: "pilot", difficulty: 3, xp: 350, minGrade: 7, playable: false, icon: "🛸" },
  { id: "mars-rover", title: "Mars Rover Navigation", description: "Plot a safe path across craters and dunes with a 20-minute signal delay.", category: "explore", difficulty: 2, xp: 300, minGrade: 6, playable: false, icon: "🤖" },
  { id: "find-constellation", title: "Find the Constellation", description: "Connect the stars before dawn. Learn the sky one pattern at a time.", category: "explore", difficulty: 1, xp: 150, minGrade: 4, playable: true, icon: "✨" },
  { id: "moon-landing", title: "Moon Landing Challenge", description: "Manage fuel and descent rate to land softly in the Sea of Tranquility.", category: "pilot", difficulty: 2, xp: 300, minGrade: 6, playable: true, icon: "🌙" },
  { id: "planet-explorer", title: "Planet Explorer", description: "Free-roam the solar system. Scan planets and moons to complete your atlas.", category: "explore", difficulty: 1, xp: 200, minGrade: 4, playable: false, icon: "🔭" },
  { id: "gravity-simulator", title: "Gravity Simulator", description: "Bend orbits with mass. Create stable systems — or beautiful chaos.", category: "explore", difficulty: 2, xp: 250, minGrade: 8, playable: false, icon: "🕳" },
  { id: "solar-puzzle", title: "Solar System Puzzle", description: "Reassemble the solar system — every planet in its proper orbit.", category: "puzzle", difficulty: 1, xp: 100, minGrade: 4, playable: false, icon: "🧩" },
  { id: "sat-comms", title: "Satellite Communication Challenge", description: "Route signals through a relay network to keep ground stations connected.", category: "puzzle", difficulty: 2, xp: 250, minGrade: 6, playable: false, icon: "📡" },
  { id: "fuel-management", title: "Rocket Fuel Management", description: "Balance thrust and burn time. Reach orbit with fuel to spare.", category: "build", difficulty: 2, xp: 250, minGrade: 7, playable: false, icon: "⛽" },
];
