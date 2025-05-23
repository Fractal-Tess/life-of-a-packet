import { ChartColumnDecreasing } from '@lucide/svelte';
import { getContext, setContext } from 'svelte';
export class Driver {
  progress = $state(0);
  proseElement = $state<HTMLElement | null>(null);
  sections = $state<HTMLElement[][]>([]);
  canContinue = $state(true);
  finished = $state(false);

  constructor() {
    this.init();
    this.setProgress(0);
  }

  setProgress(progress: number) {
    this.progress = progress;
    this.onProgressChange();
  }

  private onProgressChange() {
    // Show and enable the current section
    const section = this.sections[this.progress];
    if (!section || section.length === 0) return;
    for (const element of section) {
      element.classList.remove('opacity-0');
      element.classList.add('!opacity-100');
      element.classList.add('!pointer-events-auto');
      element.classList.remove('pointer-events-none');
      element.classList.remove('[&>*]:opacity-0');
    }
    // Reset canContinue for each new section
    this.canContinue = false;
    this.scrollTo(this.progress);
    if (this.progress === this.sections.length - 1) {
      this.finished = true;
    }
  }

  private init() {
    // Wait for DOM to be ready
    if (typeof document !== 'undefined') {
      // Find all elements with a class that includes 'prose-'
      this.proseElement = document.querySelector('[content-container]');
      if (!this.proseElement) {
        console.error('No prose element found');
        return;
      }

      // Find all direct children of the prose element
      const children = Array.from(this.proseElement.children);

      let currentSection: HTMLElement[] = [];
      this.sections = [];

      // Find the section-begin element
      let beginFound = false;

      for (const child of children) {
        // Check if this is the beginning element
        if (child.hasAttribute('section-begin')) {
          beginFound = true;
          continue;
        }

        // Only process elements after the section-begin
        if (!beginFound) {
          continue;
        }

        // Check if this is a section splitter element
        if (child.hasAttribute('section-splitter')) {
          // Add the current section to the sections array
          this.sections.push([...currentSection]);
          // Reset the current section
          currentSection = [];
        } else {
          // Add the child to the current section
          if (child.tagName.toLowerCase() === 'astro-island') {
            child.classList.add('[&>*]:opacity-0');
          }
          child.classList.add('[&>*]:opacity-0');
          currentSection.push(child as HTMLElement);
        }
      }
    }
    console.log(this.sections);
  }

  public reset() {
    this.setProgress(0);
  }

  public next() {
    this.setProgress(this.progress + 1);
  }

  public scrollTo(section: number) {
    if (!this.sections[section] || this.sections[section].length === 0) return;
    const topElement = this.sections[section][0];
    const padding = 32; // px
    const rect = topElement.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - padding;
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }

  public unblock() {
    this.canContinue = true;
  }
}

export function setDriver(driver: Driver) {
  setContext('driver', driver);
}
export function getDriver() {
  return getContext('driver') as Driver;
}
