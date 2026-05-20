export type SlotStatus = "available" | "booked";

export type BookingDetails = {
  fullName: string;
  email: string;
  message?: string;
  bookedAtIso: string;
};

export type Slot = {
  id: string;
  dayKey: string;
  startsAtIso: string;
  endsAtIso: string;
  status: SlotStatus;
  booking?: BookingDetails;
};
