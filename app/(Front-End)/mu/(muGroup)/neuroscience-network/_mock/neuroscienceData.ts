export interface NeuroscienceField {
  id: string;
  category: string;
  description: string;
  bulletPoints: string[];
}

export const neuroscienceFields: NeuroscienceField[] = [
  {
    id: "1",
    category: "Foundational Biological Fields",
    description: "",
    bulletPoints: [
      "Molecular and Cellular Neuroscience: Explores the genes, proteins, and molecules that guide how neurons function. It studies individual cells, including their morphology and physiological properties.",
      "Neurophysiology: Describes the study of the nervous system's function, typically using electrical or optical techniques to measure cell activity.",
      "Neuroanatomy: Focuses on the physical and structural",
      "Developmental Neuroscience: Investigates how the brain forms, grows, and changes from conception through adulthood.",
    ],
  },
  {
    id: "2",
    category: "Behavioral and Cognitive Fields",
    description: "",
    bulletPoints: [
      "Cognitive Neuroscience: Examines the neural mechanisms underlying higher mental functions like thought, memory, language, and problem-solving.",
      "Behavioral Neuroscience: Also known as biological psychology, this field studies the biological basis of behavior in both humans and animals.",
      "Affective Neuroscience: Focuses specifically on how the brain creates and processes emotions.",
      "Social Neuroscience: Explores how biological systems implement social processes and behavior, such as empathy and group dynamics.",
    ],
  },
  {
    id: "3",
    category: "Computational and Applied Fields",
    description: "",
    bulletPoints: [
      "Computational Neuroscience: Uses mathematical models, computer simulations, and theoretical analysis to understand how the brain processes information.",
      "Clinical Neuroscience: A medical-focused branch that explores the causes, treatments, and prevention of neurological and psychiatric disorders.",
      "Neuroengineering: Applies engineering techniques to repair, replace, or enhance neural systems, such as developing visual prosthetics.",
      "Systems Neuroscience: Studies the function of neural circuits and large-scale networks within the central nervous system.",
    ],
  },
  {
    id: "4",
    category: "Emerging and Niche Fields",
    description: "",
    bulletPoints: [
      "Neurogenetics: The study of the genetic basis of the nervous system and inherited neurological diseases.",
      "Neurolinguistics: Investigates the neural mechanisms that control language acquisition and production.",
      "Neurolinguistics: Investigates the neural mechanisms that control language acquisition and production.",
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
