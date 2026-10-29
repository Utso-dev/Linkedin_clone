// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/_mock/psychologyData.ts

export interface PsychologyField {
  id: string;
  category: string;
  description: string;
  bulletPoints: string[];
}

export const psychologyFields: PsychologyField[] = [
  {
    id: "1",
    category: "Clinical and Counseling Psychology",
    description: "",
    bulletPoints: [
      "Clinical Psychology: Focuses on diagnosing and treating mental, emotional, and behavioral disorders.",
      "Counseling Psychology: Helps individuals cope with personal and interpersonal problems, often focusing on emotional, social, and vocational stressors.",
      "Abnormal Psychology: Looks at psychopathology and abnormal behavior. It involves the study of people's emotional, thought, and behavior patterns to identify, understand, and potentially resolve any issues that may be negatively affecting a person's life.",
    ],
  },
  {
    id: "2",
    category: "Developmental and Educational Psychology",
    description: "",
    bulletPoints: [
      " Developmental Psychology: Studies how people grow and adapt at different life stages, from infancy to old age.",
      "Educational Psychology: Investigates how people learn and the best ways to teach them.",
    ],
  },
  {
    id: "3",
    category: "Social, Behavioral, and Personality Psychology",
    description: "",
    bulletPoints: [
      "Social Psychology: Examines how individuals' thoughts and behaviors are influenced by others and social environments.",
      "Personality Psychology: Focuses on individual differences in characteristic patterns of thinking, feeling, and behaving.",
      "Behavioral Psychology: also known as behaviorism, is a theory of learning based on the idea that all behaviors are acquired through conditioning.",
      "Cross-Cultural Psychology: looks at how cultural factors influence human behavior.",
    ],
  },
  {
    id: "4",
    category: "Experimental and Biological Psychology",
    description: "",
    bulletPoints: [
      "Experimental Psychology: utilizes scientific methods to research the brain and behavior.",
      "Cognitive Psychology: Studies mental processes such a s perception, memory, thought, and decision-making.",
      "Biopsychology (Neuroscience): Explores the relationship between biological processes (like brain chemistry) and behavior.",
    ],
  },
  {
    id: "5",
    category: "Applied Fields",
    description: "",
    bulletPoints: [
      "Industrial-Organizational (I-O) Psychology: Applies psychological principles to workplace issues, such as productivity and employee morale.",
      "Forensic Psychology: Applies psychology to legal and criminal justice systems.",
      "Health Psychology: Looks at how biological, social, and psychological factors influence health and illness.",
      "Sports Psychology: studies how psychology influences sports, athletic performance, exercise, and physical activity, to improve focus, develop mental toughness, increase motivation, or reduce sports-related anxiety.",
      "School Psychology: involves working in schools to help students deal with academic, emotional, and social issues, to help create a healthy learning environment.",
    ],
  },
];
