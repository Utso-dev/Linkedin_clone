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
        heading: "Human Resources & Business",
        bulletPoints: ["Human Resources Assistant", "Market Research", "Sales"],
      },
      {
        id: "1-2",
        heading: "Social Services & Non-Profit",
        bulletPoints: [
          "Case Worker",
          "Youth Counselor",
          "Community Outreach Coordinator",
        ],
      },
      {
        id: "1-3",
        heading: "Education & Child Development",
        bulletPoints: [
          "Teacher Assistant",
          "Childcare Worker",
          "Special Education Aide",
        ],
      },
      {
        id: "1-4",
        heading: "Healthcare & Clinical Support",
        bulletPoints: [
          "Psychiatric Aide",
          "Mental Health Technician",
          "Behavioral Health Specialist",
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
        heading: "Clinical Psychology",
        bulletPoints: [
          "Licensed Professional Counselor",
          "Marriage and Family Therapist",
          "School Psychologist",
        ],
      },
      {
        id: "2-2",
        heading: "Industrial-Organizational",
        bulletPoints: [
          "HR Manager",
          "Organizational Development Specialist",
          "Training and Development Manager",
        ],
      },
      {
        id: "2-3",
        heading: "Research & Academia",
        bulletPoints: [
          "Research Coordinator",
          "Lab Manager",
          "Adjunct Professor",
        ],
      },
      {
        id: "2-4",
        heading: "Forensic Psychology",
        bulletPoints: [
          "Forensic Mental Health Specialist",
          "Victim Advocate",
          "Correctional Counselor",
        ],
      },
    ],
  },
  {
    id: "3",
    category: "Doctoral Degree",
    titleParts: [
      { text: "Doctoral Degree", isHighlighted: true },
      { text: " (PhD, PsyD, and EdD)", isHighlighted: false },
    ],
    subSections: [
      {
        id: "3-1",
        heading: "Clinical Practice",
        bulletPoints: [
          "Licensed Psychologist",
          "Clinical Director",
          "Private Practice Owner",
        ],
      },
      {
        id: "3-2",
        heading: "Academia & Research",
        bulletPoints: ["Professor", "Research Director", "Postdoctoral Fellow"],
      },
      {
        id: "3-3",
        heading: "Neuropsychology",
        bulletPoints: [
          "Neuropsychologist",
          "Clinical Neuropsychology Director",
          "Rehabilitation Psychologist",
        ],
      },
      {
        id: "3-4",
        heading: "Forensic Psychology",
        bulletPoints: [
          "Forensic Psychologist",
          "Expert Witness",
          "Correctional Psychologist",
        ],
      },
    ],
  },
  {
    id: "4",
    category: "Medical Degree",
    titleParts: [
      { text: "Doctor of Medicine", isHighlighted: true },
      { text: " (MD) & ", isHighlighted: false },
      { text: "Doctor of Osteopathic Medicine", isHighlighted: true },
      { text: " (DO) and (MD-PhD)", isHighlighted: false },
    ],
    subSections: [
      {
        id: "4-1",
        heading: "Psychiatry",
        bulletPoints: [
          "Psychiatrist",
          "Child and Adolescent Psychiatrist",
          "Addiction Psychiatrist",
        ],
      },
      {
        id: "4-2",
        heading: "Neurology",
        bulletPoints: [
          "Neurologist",
          "Behavioral Neurologist",
          "Neuropsychiatrist",
        ],
      },
      {
        id: "4-3",
        heading: "Academic Medicine",
        bulletPoints: [
          "Professor of Psychiatry",
          "Research Director",
          "Medical Director",
        ],
      },
      {
        id: "4-4",
        heading: "Specialized Practice",
        bulletPoints: [
          "Geriatric Psychiatrist",
          "Forensic Psychiatrist",
          "Consultation-Liaison Psychiatrist",
        ],
      },
    ],
  },
];
