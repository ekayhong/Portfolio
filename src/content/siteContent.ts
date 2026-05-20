import type { Locale } from "@/content/profile";

type HomeCopy = {
  nav: {
    portfolio: string;
    availability: string;
    privacy: string;
  };
  hero: {
    eyebrow: string;
    viewCv: string;
    scheduleCall: string;
    titleLabel: string;
    availabilityLabel: string;
    availabilityValue: string;
    availabilityDate: string;
    modeLabel: string;
    modeValue: string;
  };
  sections: {
    strengths: string;
    strengthsCount: string;
    stack: string;
    stackCount: string;
    experience: string;
    experienceCount: string;
    cvContact: string;
    contactDetails: string;
    contactMe: string;
    contactVerification: string;
    contactVerificationHint: string;
    educationLanguages: string;
    education: string;
    languages: string;
  };
  stats: Array<{ value: number; suffix: string; label: string }>;
  cvCard: {
    title: string;
    subtitle: string;
    pdfMissing: string;
    docxMissing: string;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github?: string;
  };
  gdpr: {
    title: string;
    subtitle: string;
    items: string[];
  };
  availabilityPage: {
    eyebrow: string;
    title: string;
    intro: string;
    listTitle: string;
  };
  booking: {
    loading: string;
    loadError: string;
    empty: string;
    selectedSlot: string;
    close: string;
    bookingError: string;
    success: string;
    fullName: string;
    email: string;
    message: string;
    submitIdle: string;
    submitLoading: string;
    gdprConsentLabel: string;
    gdprConsentHint: string;
    privacyLink: string;
  };
  footer: {
    privacyLink: string;
    rights: string;
  };
  privacyPage: {
    title: string;
    intro: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
  };
  api: {
    invalidRequest: string;
    slotUnavailable: string;
  };
};

export const siteContent: Record<Locale, HomeCopy> = {
  fr: {
    nav: {
      portfolio: "Portfolio",
      availability: "Disponibilités",
      privacy: "Confidentialité",
    },
    hero: {
      eyebrow: "Portfolio · Profil technique",
      viewCv: "Aperçu du CV",
      scheduleCall: "Planifier un entretien · 30 min",
      titleLabel: "Position",
      availabilityLabel: "Disponibilité",
      availabilityValue: "Ouvert aux opportunités · Monaco, Nice et environs",
      availabilityDate: "Disponible dès juillet 2026",
      modeLabel: "Mode",
      modeValue: "Remote · Hybride · Présentiel",
    },
    sections: {
      strengths: "Forces",
      strengthsCount: "compétences clés",
      stack: "Stack",
      stackCount: "technologies",
      experience: "Expérience",
      experienceCount: "postes",
      cvContact: "CV & Contact",
      contactDetails: "Coordonnées",
      contactMe: "Contactez moi",
      contactVerification: "Vérification anti-spam",
      contactVerificationHint: "Un contrôle discret protège ce formulaire des robots.",
      educationLanguages: "Formation & Langues",
      education: "Formation",
      languages: "Langues",
    },
    stats: [
      { value: 23, suffix: "+", label: "ans d'expérience" },
      { value: 3, suffix: "", label: "zones géographiques" },
      { value: 15, suffix: "+", label: "projets livrés" },
    ],
    cvCard: {
      title: "Télécharger mon CV",
      subtitle: "Choisissez le format qui vous convient.",
      pdfMissing: "PDF (URL manquante)",
      docxMissing: "DOCX (URL manquante)",
    },
    contact: {
      email: "Email",
      phone: "Téléphone",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    gdpr: {
      title: "RGPD & Confidentialité",
      subtitle: "Traitement des données candidates",
      items: [
        "Les données partagées via le formulaire sont utilisées uniquement pour organiser un échange professionnel.",
        "Aucune cession commerciale des données personnelles n'est réalisée.",
        "Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment par email.",
      ],
    },
    availabilityPage: {
      eyebrow: "Réservation",
      title: "Disponibilités",
      intro: "Choisissez un créneau de 30 minutes. Ouvert aux opportunités à Monaco, Nice et environs. Objectif : comprendre votre besoin, présenter mon approche et valider une collaboration possible rapidement.",
      listTitle: "Créneaux disponibles",
    },
    booking: {
      loading: "Chargement...",
      loadError: "Impossible de charger les disponibilités.",
      empty: "Aucun créneau disponible pour le moment.",
      selectedSlot: "Créneau sélectionné",
      close: "Fermer",
      bookingError: "Erreur de réservation.",
      success: "Réservation confirmée ! Vous recevrez un email de confirmation.",
      fullName: "Nom complet",
      email: "Email professionnel",
      message: "Message (optionnel)",
      submitIdle: "Confirmer la réservation",
      submitLoading: "Envoi en cours...",
      gdprConsentLabel: "J'accepte que mes données soient utilisées pour traiter ma demande de rendez-vous.",
      gdprConsentHint: "Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment.",
      privacyLink: "Consulter la politique de confidentialité",
    },
    footer: {
      privacyLink: "Politique de confidentialité",
      rights: "Tous droits réservés.",
    },
    privacyPage: {
      title: "Politique de confidentialité",
      intro: "Cette page explique quelles données sont collectées via le portfolio, pourquoi elles sont traitées et comment exercer vos droits.",
      sections: [
        {
          heading: "Données collectées",
          content: "Le formulaire de réservation collecte votre nom, votre email professionnel et, si vous le souhaitez, un message contextuel.",
        },
        {
          heading: "Finalité du traitement",
          content: "Ces données sont utilisées uniquement pour organiser et confirmer un entretien professionnel.",
        },
        {
          heading: "Conservation et droits",
          content: "Vous pouvez demander l'accès, la correction ou la suppression de vos données à tout moment en écrivant à l'adresse email de contact.",
        },
      ],
    },
    api: {
      invalidRequest: "Requête invalide.",
      slotUnavailable: "Ce créneau n'est plus disponible.",
    },
  },
  en: {
    nav: {
      portfolio: "Portfolio",
      availability: "Availability",
      privacy: "Privacy",
    },
    hero: {
      eyebrow: "Portfolio · Technical profile",
      viewCv: "Resume Preview",
      scheduleCall: "Schedule an interview · 30 min",
      titleLabel: "Position",
      availabilityLabel: "Availability",
      availabilityValue: "Open to opportunities · Monaco, Nice and surrounding area",
      availabilityDate: "Available from July 2026",
      modeLabel: "Mode",
      modeValue: "Remote · Hybrid · On-site",
    },
    sections: {
      strengths: "Strengths",
      strengthsCount: "core skills",
      stack: "Stack",
      stackCount: "technologies",
      experience: "Experience",
      experienceCount: "roles",
      cvContact: "Resume & Contact",
      contactDetails: "Contact details",
      contactMe: "Contact me",
      contactVerification: "Anti-spam check",
      contactVerificationHint: "A discreet check helps keep bots away.",
      educationLanguages: "Education & Languages",
      education: "Education",
      languages: "Languages",
    },
    stats: [
      { value: 23, suffix: "+", label: "years of experience" },
      { value: 3, suffix: "", label: "geographical areas" },
      { value: 15, suffix: "+", label: "delivered projects" },
    ],
    cvCard: {
      title: "Download my resume",
      subtitle: "Choose the format that fits your workflow.",
      pdfMissing: "PDF (missing URL)",
      docxMissing: "DOCX (missing URL)",
    },
    contact: {
      email: "Email",
      phone: "Phone",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    gdpr: {
      title: "GDPR & Privacy",
      subtitle: "Candidate data processing",
      items: [
        "Data shared through the booking form is used only to organize a professional call.",
        "No personal data is sold or shared for commercial purposes.",
        "You can request access, correction, or deletion of your data at any time by email.",
      ],
    },
    availabilityPage: {
      eyebrow: "Booking",
      title: "Availability",
      intro: "Choose a 30-minute time slot. Open to opportunities in Monaco, Nice, and the surrounding area. Use this call to discuss your needs, review my approach, and validate a potential collaboration quickly.",
      listTitle: "Available slots",
    },
    booking: {
      loading: "Loading...",
      loadError: "Unable to load available slots.",
      empty: "No available slots at the moment.",
      selectedSlot: "Selected slot",
      close: "Close",
      bookingError: "Booking error.",
      success: "Booking confirmed! You will receive a confirmation email.",
      fullName: "Full name",
      email: "Work email",
      message: "Message (optional)",
      submitIdle: "Confirm booking",
      submitLoading: "Submitting...",
      gdprConsentLabel: "I agree that my data can be used to process my meeting request.",
      gdprConsentHint: "In compliance with GDPR, you can request data deletion at any time.",
      privacyLink: "Read the privacy policy",
    },
    footer: {
      privacyLink: "Privacy policy",
      rights: "All rights reserved.",
    },
    privacyPage: {
      title: "Privacy policy",
      intro: "This page explains what data is collected through this portfolio, why it is processed, and how to exercise your rights.",
      sections: [
        {
          heading: "Collected data",
          content: "The booking form collects your name, work email address, and an optional context message.",
        },
        {
          heading: "Purpose",
          content: "This data is used only to organize and confirm a professional meeting.",
        },
        {
          heading: "Retention and rights",
          content: "You can request access, correction, or deletion of your data at any time by contacting the portfolio email address.",
        },
      ],
    },
    api: {
      invalidRequest: "Invalid request.",
      slotUnavailable: "This slot is no longer available.",
    },
  },
};

export function resolveLocale(input?: string | null): Locale {
  return input === "en" ? "en" : "fr";
}
