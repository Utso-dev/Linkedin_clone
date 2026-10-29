// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/careers/_mock/careersData.ts

export interface CareerSubSection {
  id: string;
  heading: string;
  bulletPoints: string[];
}

export interface CareerSection {
  id: string;
  category: string;
  titleParts: {
    text: string;
    isHighlighted: boolean;
  }[];
  subSections: CareerSubSection[];
}

export const careersData: CareerSection[] = [
  {
    id: "1",
    category: "Undergraduate Degree",
    titleParts: [
      { text: "Undergraduate Degree", isHighlighted: true },
      { text: " (BS, BA, Sc.B., A.B., and BAS)", isHighlighted: false },
    ],
    subSections: [
      {
        id: "1-1",
        heading: "Healthcare and Research",
        bulletPoints: [
          "Research Assistant",
          "Laboratory Technician",
          "Clinical Research Coordinator",
          "Forensic Science Technician",
          "Psychometrist",
          "Residential Counselor",
          "Physician Assistant or Occupational Therapist",
          "Pharmaceutical Sales Representative",
          "Biotechnologist",
          "Regulatory Affairs Specialist",
        ],
      },
      {
        id: "1-2",
        heading: "Other Roles",
        bulletPoints: [
          "Science Writer",
          "Natural Sciences Manager",
          "Entry into Government Roles",
        ],
      },
    ],
  },
  {
    id: "2",
    category: "Graduate Degree",
    titleParts: [
      { text: "Graduate Degree", isHighlighted: true },
      {
        text: " (MS, MA, MRes, M.Ed., MSEd, MSP, MASS and EdS)",
        isHighlighted: false,
      },
    ],
    subSections: [
      {
        id: "2-1",
        heading: "Research & Development",
        bulletPoints: [
          "Research Assistant",
          "Clinical Research Coordinator",
          "Neuroimaging Analyst",
          "Neuroinformatics Specialist",
          "Speech-Language Pathologist/Audiologist",
          "Physician Assistant",
          "Genetic Counselor",
          "Occupational or Physical Therapist",
        ],
      },
      {
        id: "2-2",
        heading: "Industry and Science Communication",
        bulletPoints: [
          "Pharmaceutical/Biotechnology Industry",
          "Medical or Science Writer",
          "Biostatistician",
          "Neuroscience Account Manager",
        ],
      },
      {
        id: "2-3",
        heading: "Education and Policy",
        bulletPoints: [
          "Educator/Professor",
          "Public Policy Specialist",
          "Grant Reviewer",
        ],
      },
    ],
  },

  {
    id: "3",
    category: "Medical Degree",
    titleParts: [
      { text: "Doctor of Medicine", isHighlighted: true },
      { text: " (MD) & ", isHighlighted: false },
      { text: "Doctor of Osteopathic Medicine", isHighlighted: true },
      { text: " (DO) and (MD-PhD)", isHighlighted: false },
    ],
    subSections: [
      {
        id: "3-1",
        heading: "Counseling & Clinical Roles",
        bulletPoints: [
          "Professor or Lecturer",
          "Principal Investigator",
          "Behavioral Medicine Specialist",
          "Postdoctoral Researcher",
          "Biotechnology and Pharmaceutical Industry",
          "Senior Research Scientist",
          "Data Scientist/AI",
          "Scientific Consultant",
          "Clinical Neuroscientist",
          "Neuropsychologist",
        ],
      },
      {
        id: "3-2",
        heading: "Other Fields",
        bulletPoints: [
          "Science Policy Writer",
          "Science Writer/Editor",
          "Patent Law",
          "Entrepreneur",
        ],
      },
    ],
  },
];
