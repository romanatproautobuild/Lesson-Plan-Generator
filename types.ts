export enum ClassSize {
  Small = "0-5 students",
  Medium = "5-12 students",
  Large = "12-20 students",
  ExtraLarge = "20+ students"
}

export enum AgeGroup {
  Kindergarten = "Kindergarten (0-5 years)",
  Primary = "Primary School (6-11 years)",
  Secondary = "Secondary School (12-15 years)",
  HighSchool = "High School (16-18 years)",
  Adult = "University / Adult"
}

export enum CEFRLevel {
  PreA1 = "Pre-A1 (Starter)",
  A1 = "A1 (Beginner)",
  A2 = "A2 (Elementary)",
  B1 = "B1 (Intermediate)",
  B2 = "B2 (Upper Intermediate)",
  C1 = "C1 (Advanced)"
}

export enum LessonDuration {
  Min15 = "15 mins",
  Min30 = "30 mins",
  Min45 = "45 mins",
  Min60 = "60 mins",
  Min90 = "90 mins"
}

export enum LessonFocus {
  Vocabulary = "Vocabulary",
  Speaking = "Speaking",
  Listening = "Listening",
  Reading = "Reading",
  Writing = "Writing",
  Grammar = "Grammar",
  Pronunciation = "Pronunciation"
}

export interface FileData {
  mimeType: string;
  data: string; // base64 encoded
  fileName: string;
}

export interface LessonRequest {
  topic: string;
  classSize: string;
  age: string;
  level: string;
  focus: string[];
  duration: string;
  context: string;
  fileData?: FileData;
}

export interface LessonActivity {
  time: string;
  activityName: string;
  procedure: string;
  interaction: "T-S" | "S-S" | "Individual" | "Group";
}

export interface Game {
  name: string;
  materialsNeeded: string;
  instructions: string;
}

export interface LessonPlanResponse {
  title: string;
  objectives: string[];
  warmUp: string;
  schedule: LessonActivity[];
  games: Game[];
  homework: string;
  worksheetContent: string; // Text content for a handout
  teacherNotes: string;
}