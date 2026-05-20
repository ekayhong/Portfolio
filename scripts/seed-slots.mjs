import fs from "node:fs";

function readAdminKey() {
  const fromEnv = process.env.ADMIN_API_KEY?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  for (const filePath of [".env.local", ".env"]) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/^ADMIN_API_KEY=(.*)$/m);
    if (match?.[1]) {
      return match[1].trim().replace(/^['\"]|['\"]$/g, "");
    }
  }

  throw new Error("Missing ADMIN_API_KEY. Set it in the environment or in .env.local.");
}

const ADMIN_KEY = readAdminKey();
const BASE_URL = "http://localhost:3000";

const TARGET_DAYS = [2, 3, 4]; // mardi, mercredi, jeudi
const TIME_RANGES = [
  { startH: 11, startM: 0, endH: 12, endM: 0 },
  { startH: 16, startM: 0, endH: 18, endM: 0 },
];
const SLOT_DURATION_MIN = 30;

function generateSlotsForMonth(year, month) {
  const slots = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    if (!TARGET_DAYS.includes(date.getDay())) continue;

    const dayKey = date.toISOString().slice(0, 10);

    for (const range of TIME_RANGES) {
      let h = range.startH;
      let m = range.startM;

      while (h * 60 + m + SLOT_DURATION_MIN <= range.endH * 60 + range.endM) {
        const start = new Date(date);
        start.setHours(h, m, 0, 0);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + SLOT_DURATION_MIN);

        const startStr = `${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}`;
        slots.push({
          id: `${dayKey}-${startStr}`,
          dayKey,
          startsAtIso: start.toISOString(),
          endsAtIso: end.toISOString(),
          status: "available",
        });

        m += SLOT_DURATION_MIN;
        if (m >= 60) { h += 1; m -= 60; }
      }
    }
  }
  return slots;
}

const now = new Date();
const end = { year: 2026, month: 8 }; // août 2026

const months = [];
let y = now.getFullYear();
let m = now.getMonth() + 1;
while (y < end.year || (y === end.year && m <= end.month)) {
  months.push({ year: y, month: m });
  m++;
  if (m > 12) { m = 1; y++; }
}

const slots = months.flatMap(({ year, month }) => generateSlotsForMonth(year, month));
console.log(`Insertion de ${slots.length} créneaux (${months.map(m => `${m.year}-${String(m.month).padStart(2,"0")}`).join(", ")})...`);

fetch(`${BASE_URL}/api/admin/slots`, {
  method: "PUT",
  headers: {
    "content-type": "application/json",
    "x-admin-api-key": ADMIN_KEY,
  },
  body: JSON.stringify({ slots }),
})
  .then((r) => r.json())
  .then((res) => console.log("Résultat:", res))
  .catch((err) => console.error("Erreur:", err));
