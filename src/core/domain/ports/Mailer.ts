type BookingMailPayload = {
  candidateName: string;
  candidateEmail: string;
  startsAtIso: string;
  endsAtIso: string;
};

type ContactMailPayload = {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
};

export interface Mailer {
  sendBookingConfirmation(payload: BookingMailPayload): Promise<void>;
  sendContactMessage(payload: ContactMailPayload): Promise<void>;
}
