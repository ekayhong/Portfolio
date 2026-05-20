import { Slot } from "@/core/domain/entities/Slot";

const TARGET_DAYS = [2, 3, 4]; // mardi, mercredi, jeudi

const TIME_RANGES = [
  { startH: 11, startM: 0, endH: 12, endM: 0 },
  { startH: 16, startM: 0, endH: 18, endM: 0 },
];

const SLOT_DURATION_MIN = 30;

export function generateSlotsForMonth(year: number, month: number): Slot[] {
  const slots: Slot[] = [];
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
