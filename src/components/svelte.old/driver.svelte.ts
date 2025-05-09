import { getContext, setContext } from 'svelte';
import { parseSections } from '../../lib/parser/parser';
import { type SectionType } from '../../lib/types';

const PROGRESS_KEY = 'life-of-a-packet-progress';

const isBrowser = typeof window !== 'undefined';

export class Driver {
  private sections: SectionType[] = $state([]);
  private currentSectionIndex: number = $state(1);
  private canContinue: boolean = $state(true);
  private content: string;

  constructor(content: string) {
    this.content = content;
    this.sections = [];

    console.log('Driver sections', this.sections);
    this.initializeSections(content);
  }

  private async initializeSections(content: string) {
    try {
      const parsedSections = await parseSections(content);
      this.sections = parsedSections;
      // Load saved progress only on the client side
      if (isBrowser) {
        this.loadProgress();
      }
    } catch (e) {
      console.error('Error initializing sections:', e);
    }
  }

  private loadProgress() {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const { content, currentSectionIndex } = JSON.parse(savedProgress);
        // Only restore progress if the content matches
        if (content === this.content) {
          this.currentSectionIndex = currentSectionIndex;
        }
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  }

  private saveProgress() {
    if (!isBrowser) return;
    try {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          content: this.content,
          currentSectionIndex: this.currentSectionIndex,
        })
      );
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  // Whether the user can continue to the next section
  get CanContinue() {
    return this.canContinue;
  }

  // Whether the user is on the last section
  get IsLastSection() {
    return this.currentSectionIndex === this.sections.length;
  }

  // The sections that are currently shown
  get ShownSections() {
    if (!Array.isArray(this.sections)) {
      console.error('Sections is not an array:', this.sections);
      return [];
    }
    return this.sections
      .slice(0, this.currentSectionIndex)
      .map((section, idx) => {
        return {
          ...section,
          index: idx,
        };
      });
  }

  get sectionsLength() {
    return this.sections.length;
  }

  // The current section
  get currentSection() {
    return this.sections[this.currentSectionIndex];
  }

  // The user has clicked the continue button to get to the next section
  continue() {
    if (this.currentSection.type === 'question') {
      this.canContinue = false;
    }

    // If the user can continue, increment the current section index
    this.currentSectionIndex++;
    this.saveProgress();
  }

  unblock() {
    this.canContinue = true;
  }

  // The user has finished the course
  finish() {
    console.log('The user has finished the course');
    // Clear progress when finished
    if (isBrowser) {
      localStorage.removeItem(PROGRESS_KEY);
    }
    window.location.href = '/';
  }

  // The user has clicked the back button to go to the previous section
  home() {
    window.location.href = '/';
  }

  // The user has clicked the reset button to go to the first section
  reset() {
    this.currentSectionIndex = 1;
    this.canContinue = true;
    // Clear progress when reset
    if (isBrowser) {
      localStorage.removeItem(PROGRESS_KEY);
    }
  }

  // The user has clicked the progress bar to go to a specific section
  scrollToSection(index: number) {
    if (index >= 0 && index < this.sections.length) {
      this.currentSectionIndex = index;
      this.saveProgress();
    }
  }
}

export function getDriver() {
  return getContext('driver') as Driver;
}
export function setDriver(driver: Driver) {
  setContext('driver', driver);
}
