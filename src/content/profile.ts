export type Experience = {
  company: string;
  location: string;
  period: string;
  roleTitle: string;
  context: string;
  roleScope: string[];
  results: string[];
  projectNotes?: string[];
};

export type Locale = "fr" | "en";

export type Profile = {
  fullName: string;
  title: string;
  summary: string;
  contacts: {
    email: string;
    phones: string[];
    linkedin: string;
    github: string;
    cvPdf?: string;
    cvDocx?: string;
  };
  strengths: string[];
  stack: string[];
  experiences: Experience[];
  education: string[];
  languages: string[];
};

export const profiles: Record<Locale, Profile> = {
  fr: {
    fullName: "Eric Kay Hong",
    title: "Developpeur .NET senior",
    summary:
      "23+ ans d'expérience dans le logiciel métier. Je combine analyse des besoins, architecture, pilotage des livraisons et encadrement technique pour garantir la qualité et la réussite des projets.",
    contacts: {
        email: "ekayhong@hotmail.com",
        phones: ["+33 6 17 65 61 39"],
        linkedin: "https://linkedin.com/in/eric-kayhong",
        github: "",
        cvPdf: "/cv/Eric-Kay-Hong-CV.pdf",
        cvDocx: "/cv/Eric-Kay-Hong-CV.docx",
    },
    strengths: [
      "Développement .NET full-stack · C#, ASP.NET Core, Web API",
      "Architecture applicative, DDD et qualité de code",
      "Tech Lead · revue de code, mentoring et arbitrages techniques",
      "Analyse métier, cadrage et estimation",
      "DevOps · CI/CD, Azure DevOps, industrialisation delivery",
      "Conception base de données · SQL Server, PostgreSQL",
      "IA & Productivité · GitHub Copilot, Amazon Q",
    ],
    stack: [
      "C#",
      ".NET / .NET Framework",
      "ASP.NET Core",
      "Web API",
      "MVC",
      "Entity Framework",
      "SQL Server",
      "PostgreSQL",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Azure Cloud",
      "Azure DevOps",
      "Azure Cosmos DB",
      "Git",
      "TFS",
      "Docker",
      "CI/CD",
      "DDD",
      "SOLID",
      "REST API",
      "Swagger / OpenAPI",
    ],
    experiences: [
      {
        company: "Freelance",
        location: "Cagnes-sur-Mer, France",
        period: "Août 2018 - Aujourd'hui",
        roleTitle: "Développeur .NET indépendant",
        context: "Développement de produits SaaS et missions ponctuelles en parallèle de l'activité salariée.",
        roleScope: [
          "Conçu et livré un service web de conversion de documents pour le logiciel TWIMMO.",
          "Conçu et commercialisé Kayon, une SaaS immobilière multiplateformes (B2B) avec gestion complète de la stack technique et du business.",
          "Pionnier dans l'adoption de GitHub Copilot et Amazon Q, réalisant un gain de productivité estimé à +40% sur les développements.",
        ],
        results: [
          "Produit Kayon conçu, développé et commercialisé en autonomie complète.",
        ],
      },
      {
        company: "SIGMA-RH",
        location: "Montréal, Québec",
        period: "Nov 2022 - Aujourd'hui",
        roleTitle: "Développeur .NET Senior",
        context: "Logiciel RH SaaS utilisé par des entreprises internationales (1500+ utilisateurs).",
        roleScope: [
          "Participation au développement de plus de 30 fonctionnalités sur des sprints de 2 semaines.",
          "Études de faisabilité, analyses de besoins métier et chiffrages pour la planification des sprints.",
          "Revues de code et mise en place des bonnes pratiques de qualité au sein de l'équipe.",
          "Intervention dans le processus de recrutement pour l'évaluation technique des candidats.",
        ],
        results: [
          "Livraison régulière de fonctionnalités dans un contexte Agile avec standards de qualité élevés.",
        ],
      },
      {
        company: "MONACO DIGITAL",
        location: "Monaco",
        period: "Avr 2019 - Nov 2022",
        roleTitle: "Tech Lead .NET",
        context: "2 à 3 projets menés en parallèle au sein d'une équipe de 7 développeurs, pour les institutions monégasques et partenaires privés.",
        roleScope: [
          "Livré le portail de demande d'actes en ligne de la Mairie de Monaco en 8 semaines.",
          "Livré en 2 semaines le portail de prise de rendez-vous COVID pour Biogroup, opérationnel 24h/24.",
          "Tech Lead et développeur .NET sur le logiciel de gestion offshore de SBM Offshore.",
          "Contribution au développement de l'application eBanking de la Banque Edmond de Rothschild Monaco.",
          "Décisions d'architecture, accompagnement équipe et pratiques DevOps.",
        ],
        results: [
          "Projets livrés pour SBM Offshore, Novares, Mairie de Monaco, Biogroup, eBanking.",
        ],
        projectNotes: ["SBM Offshore, Novares, Mairie de Monaco, Biogroup, eBanking."],
      },
      {
        company: "FIGARO CLASSIFIEDS",
        location: "Villeneuve-Loubet, France",
        period: "Nov 2005 - Août 2018",
        roleTitle: "Développeur .NET",
        context: "Plateforme immobilière grand public utilisée par 4000+ utilisateurs (SeLoger, Logic-Immo).",
        roleScope: [
          "Dirigé le développement et le déploiement d'un logiciel de gestion de transaction immobilière complexe.",
          "Orchestré les évolutions techniques et les migrations de version avec zéro downtime critique.",
          "Conçu la base de données et participé au développement des projets transversaux Flux et Digital.",
        ],
        results: [
          "Plus de 13 ans de contribution sur une plateforme à fort trafic et à enjeux métier critiques.",
        ],
      },
      {
        company: "TANDEM INFORMATIQUE INC.",
        location: "Longueuil, Québec",
        period: "Août 1999 - Mai 2005",
        roleTitle: "Programmeur Analyste C++",
        context: "Logiciel de gestion d'entreprise déployé chez des PME québécoises.",
        roleScope: [
          "Analyse des besoins et développement de modules du logiciel Tandem RH en C++.",
          "Conception et optimisation de la base de données relationnelle, structurant les migrations et la scalabilité.",
        ],
        results: [
          "Logiciel déployé chez 50+ PME québécoises.",
        ],
      },
      {
        company: "CRYPTAG INTERNATIONAL INC.",
        location: "Longueuil, Québec",
        period: "Juin 1999 - Août 1999",
        roleTitle: "Programmeur",
        context: "Mission courte en début de carrière.",
        roleScope: [
          "Développé un logiciel de gestion de parc informatique en remplacement d'un suivi Excel.",
        ],
        results: [
          "Amélioration de la fiabilité et de la traçabilité du matériel informatique.",
        ],
      },
    ],
    education: [
      "Licence / Maîtrise en informatique - Université Nice Sophia-Antipolis",
      "DUT informatique - Université de Nice",
    ],
    languages: ["Français", "Anglais professionnel (technique)"],
  },
  en: {
    fullName: "Eric Kay Hong",
    title: "FullStack .NET Developer",
    summary:
      "23+ years of experience in business software. I combine requirements analysis, architecture, and delivery leadership to ensure quality and successful project outcomes.",
    contacts: {
        email: "ekayhong@hotmail.com",
        phones: ["+33 6 17 65 61 39"],
        linkedin: "https://linkedin.com/in/eric-kayhong",
        github: "",
        cvPdf: "/cv/Eric-Kay-Hong-CV.pdf",
        cvDocx: "/cv/Eric-Kay-Hong-CV.docx",
    },
    strengths: [
      ".NET full-stack development · C#, ASP.NET Core, Web API",
      "Application architecture, DDD and code quality",
      "Tech Lead · code reviews, mentoring and technical decisions",
      "Business analysis, scoping and estimation",
      "DevOps · CI/CD, Azure DevOps, delivery industrialization",
      "Database design · SQL Server, PostgreSQL",
      "AI & Productivity · GitHub Copilot, Amazon Q",
    ],
    stack: [
      "C#",
      ".NET / .NET Framework",
      "ASP.NET Core",
      "Web API",
      "MVC",
      "Entity Framework",
      "SQL Server",
      "PostgreSQL",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Azure Cloud",
      "Azure DevOps",
      "Azure Cosmos DB",
      "Git",
      "TFS",
      "Docker",
      "CI/CD",
      "DDD",
      "SOLID",
      "REST API",
      "Swagger / OpenAPI",
    ],
    experiences: [
      {
        company: "Freelance",
        location: "Cagnes-sur-Mer, France",
        period: "Aug 2018 - Present",
        roleTitle: "Independent .NET Developer",
        context: "SaaS product development and freelance missions alongside salaried activity.",
        roleScope: [
          "Designed and delivered a document conversion web service for the TWIMMO software.",
          "Designed and commercialized Kayon, a multi-platform real-estate SaaS (B2B) with full ownership of the tech stack and business.",
          "Early adopter of GitHub Copilot and Amazon Q, achieving an estimated +40% productivity gain.",
        ],
        results: [
          "Kayon product fully designed, developed and commercialized independently.",
        ],
      },
      {
        company: "SIGMA-RH",
        location: "Montreal, Quebec",
        period: "Nov 2022 - Present",
        roleTitle: ".NET Senior Developer",
        context: "HR SaaS software used by international companies (1500+ users).",
        roleScope: [
          "Participated in the development of 30+ features across 2-week sprints.",
          "Feasibility studies, business requirements analysis and sprint estimation.",
          "Code reviews and implementation of quality best practices within the team.",
          "Involvement in the recruitment process for technical candidate evaluation.",
        ],
        results: [
          "Consistent feature delivery in an Agile context with high quality standards.",
        ],
      },
      {
        company: "MONACO DIGITAL",
        location: "Monaco",
        period: "Apr 2019 - Nov 2022",
        roleTitle: ".NET Tech Lead",
        context: "2 to 3 projects run in parallel within a 7-developer team, for Monaco institutions and private partners.",
        roleScope: [
          "Delivered the Monaco City Hall online document request portal in 8 weeks.",
          "Delivered the Biogroup COVID appointment portal in 2 weeks, running 24/7 with 2 teams coordinated.",
          "Tech Lead and .NET developer on the SBM Offshore offshore management software.",
          "Contributed to the eBanking application for Banque Edmond de Rothschild Monaco as Tech Lead.",
          "Architecture decisions, team enablement and DevOps practices.",
        ],
        results: [
          "Projects delivered for SBM Offshore, Novares, Monaco City Hall, Biogroup, eBanking.",
        ],
        projectNotes: ["SBM Offshore, Novares, Monaco City Hall, Biogroup, eBanking."],
      },
      {
        company: "FIGARO CLASSIFIEDS",
        location: "Villeneuve-Loubet, France",
        period: "Nov 2005 - Aug 2018",
        roleTitle: ".NET Developer",
        context: "Public real-estate platform used by 4000+ users (SeLoger, Logic-Immo).",
        roleScope: [
          "Led the development and deployment of a complex real-estate transaction management software.",
          "Orchestrated technical evolutions and version migrations with zero critical downtime.",
          "Designed the database and contributed to the cross-functional Flux and Digital projects.",
        ],
        results: [
          "Over 13 years of contribution on a high-traffic platform with critical business stakes.",
        ],
      },
      {
        company: "TANDEM INFORMATIQUE INC.",
        location: "Longueuil, Quebec",
        period: "Aug 1999 - May 2005",
        roleTitle: "C++ Analyst Programmer",
        context: "Business management software deployed at Quebec SMEs.",
        roleScope: [
          "Requirements analysis and development of Tandem HR software modules in C++.",
          "Relational database design and optimization, structuring migrations and scalability.",
        ],
        results: [
          "Software deployed at 50+ Quebec SMEs.",
        ],
      },
      {
        company: "CRYPTAG INTERNATIONAL INC.",
        location: "Longueuil, Quebec",
        period: "Jun 1999 - Aug 1999",
        roleTitle: "Programmer",
        context: "Short mission at the start of career.",
        roleScope: [
          "Developed an IT asset management software replacing an Excel-based tracking system.",
        ],
        results: [
          "Improved reliability and traceability of IT hardware.",
        ],
      },
    ],
    education: [
      "Bachelor's / Master's degree in Computer Science - University of Nice Sophia-Antipolis",
      "Computer Science diploma - University of Nice",
    ],
    languages: ["French", "Professional English (technical)"],
  },
};
