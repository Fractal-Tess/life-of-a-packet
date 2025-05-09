import { Section, QuestionSchema, type SectionType } from '../types';
import { processMarkdown } from './markdown';

export async function parseSections(content: string): Promise<SectionType[]> {
  const sections: SectionType[] = [];
  const lines = content.split('\n');
  let currentSection: Partial<SectionType> | null = null;
  let sectionContent = '';
  let questionContent = '';
  let questionLabel = '';
  let choices: string[] = [];
  let correctAnswerIdx = -1;
  let explanationStr = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('=s')) {
      // Start of a new section
      if (currentSection) {
        if (currentSection.type === 'section') {
          const markdownContent = sectionContent.trim();
          currentSection.content = await processMarkdown(markdownContent);
          sections.push(currentSection as SectionType);
        } else if (currentSection.type === 'question') {
          // Process question content and explanation
          const markdownContent = questionContent.trim();
          const markdownExplanation = explanationStr.trim();
          currentSection.content = await processMarkdown(markdownContent);
          currentSection.explanation = await processMarkdown(
            markdownExplanation
          );
          sections.push(currentSection as SectionType);
        }
      }

      currentSection = { type: 'section' };
      sectionContent = '';
      questionContent = '';
      questionLabel = '';
      choices = [];
      correctAnswerIdx = -1;
      explanationStr = '';
    } else if (line.startsWith('=q')) {
      // Start of a new question
      if (currentSection) {
        if (currentSection.type === 'section') {
          const markdownContent = sectionContent.trim();
          currentSection.content = await processMarkdown(markdownContent);
          sections.push(currentSection as SectionType);
        } else if (currentSection.type === 'question') {
          // Process question content and explanation
          const markdownContent = questionContent.trim();
          const markdownExplanation = explanationStr.trim();
          currentSection.content = await processMarkdown(markdownContent);
          currentSection.explanation = await processMarkdown(
            markdownExplanation
          );
          sections.push(currentSection as SectionType);
        }
      }

      currentSection = { type: 'question' };
      sectionContent = '';
      questionContent = '';
      questionLabel = '';
      choices = [];
      correctAnswerIdx = -1;
      explanationStr = '';
    } else if (line.startsWith('=l')) {
      // Question label
      questionLabel = line.slice(2).trim();
    } else if (line.startsWith('=c')) {
      // Choice
      choices.push(line.slice(2).trim());
    } else if (line.startsWith('=a')) {
      // Correct answer index
      correctAnswerIdx = parseInt(line.slice(2).trim(), 10);
    } else if (line.startsWith('=e')) {
      // Start of explanation
      explanationStr = '';
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('=/q')) {
        explanationStr += lines[j] + '\n';
        j++;
      }
      i = j;
    } else if (line.startsWith('=/s')) {
      // End of section
      if (currentSection && currentSection.type === 'section') {
        const markdownContent = sectionContent.trim();
        currentSection.content = processMarkdown(markdownContent);
        sections.push(currentSection as SectionType);
        currentSection = null;
      }
    } else if (line.startsWith('=/q')) {
      // End of question
      if (currentSection && currentSection.type === 'question') {
        // Process question content and explanation
        const markdownContent = questionContent.trim();
        const markdownExplanation = explanationStr.trim();
        currentSection.content = processMarkdown(markdownContent);
        currentSection.explanation = processMarkdown(markdownExplanation);
        sections.push(currentSection as SectionType);
        currentSection = null;
      }
    } else if (currentSection) {
      if (currentSection.type === 'section') {
        sectionContent += line + '\n';
      } else if (currentSection.type === 'question') {
        questionContent += line + '\n';
      }
    }
  }

  // Handle the last section if exists
  if (currentSection) {
    if (currentSection.type === 'section') {
      const markdownContent = sectionContent.trim();
      currentSection.content = await processMarkdown(markdownContent);
      sections.push(currentSection as SectionType);
    } else if (currentSection.type === 'question') {
      // Process question content and explanation
      const markdownContent = questionContent.trim();
      const markdownExplanation = explanationStr.trim();
      currentSection.content = await processMarkdown(markdownContent);
      currentSection.explanation = await processMarkdown(markdownExplanation);
      sections.push(currentSection as SectionType);
    }
  }

  return sections;
}

export function validateSections(sections: SectionType[]) {
  const errors: string[] = [];
  const validSections: SectionType[] = [];

  sections.forEach((section, index) => {
    try {
      if (section.type === 'question') {
        const result = QuestionSchema.safeParse(section);
        if (!result.success) {
          errors.push(
            `Question at index ${index} is invalid: ${result.error.message}`
          );
          return;
        }
      }
      validSections.push(section);
    } catch (error) {
      errors.push(
        `Section at index ${index} is invalid: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });

  return { validSections, errors };
}
