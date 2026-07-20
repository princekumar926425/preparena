export type AptitudeCategory = "Quantitative" | "Logical" | "Verbal";

export type AptitudeQuestion = {
  id: number;
  category: AptitudeCategory;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export const aptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 1,
    category: "Quantitative",
    prompt: "What is 25% of 240?",
    options: ["40", "50", "60", "70"],
    answer: "60",
    explanation: "25% of 240 is 60."
  },
  {
    id: 2,
    category: "Logical",
    prompt: "If all cats are animals and some animals are pets, which statement is definitely true?",
    options: ["All cats are pets", "Some cats are pets", "Some animals are cats", "All pets are cats"],
    answer: "Some animals are cats",
    explanation: "From the given statements, only 'Some animals are cats' is supported."
  },
  {
    id: 3,
    category: "Verbal",
    prompt: "Choose the most appropriate synonym of 'Brisk'.",
    options: ["Slow", "Lively", "Weak", "Heavy"],
    answer: "Lively",
    explanation: "Brisk means lively or energetic."
  }
];

export const aptitudeCategories: AptitudeCategory[] = ["Quantitative", "Logical", "Verbal"];
