import { z } from 'zod';

export const QuestionSchema = z.object({
  type: z.literal('question'),
  label: z.string(),
  content: z.string(),
  choices: z.array(z.string()),
  correctAnswerIdx: z.number(),
  explanation: z.string(),
});

export const SectionSchema = z.object({
  type: z.literal('section'),
  content: z.string(),
});

export const Section = z.discriminatedUnion('type', [
  SectionSchema,
  QuestionSchema,
]);

export type SectionType = z.infer<typeof Section>;
export type QuestionType = z.infer<typeof QuestionSchema>;
export type RegularSectionType = z.infer<typeof SectionSchema>;
