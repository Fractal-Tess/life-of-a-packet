<script lang="ts">
  import { fade, scale, slide } from 'svelte/transition';
  import { type SectionType } from '../../lib/types';
  import { getDriver } from './driver.svelte';

  interface Props {
    section: Extract<SectionType, { type: 'question' }>;
  }

  const { section }: Props = $props();
  const { choices, correctAnswerIdx, explanation } = section;

  let selectedAnswer: number | null = $state(null);
  let showExplanation: boolean = $state(false);
  let isAnswerCorrect: boolean = $state(false);
  let hasCheckedAnswer: boolean = $state(false);
  let hasAttempted: boolean = $state(false);
  let previousAnswers: Set<number> = $state(new Set());
  let isExpanded: boolean = $state(false);
  let shouldShake: boolean = $state(false);

  const driver = getDriver();

  function shake(_node: HTMLElement) {
    return {
      duration: 500,
      css: (t: number) => {
        const intensity = Math.sin(t * Math.PI * 3) * (1 - t);
        return `transform: translateX(${intensity * 10}px)`;
      },
    };
  }

  function selectAnswer(index: number) {
    if (selectedAnswer !== index) {
      selectedAnswer = index;
      // If this answer was previously attempted, restore its state
      if (previousAnswers.has(index)) {
        hasCheckedAnswer = true;
        isAnswerCorrect = index === correctAnswerIdx;
      } else {
        hasCheckedAnswer = false;
        isAnswerCorrect = false;
      }
    }
  }

  function checkAnswer() {
    if (selectedAnswer === null) return;

    hasCheckedAnswer = true;
    hasAttempted = true;
    isAnswerCorrect = selectedAnswer === correctAnswerIdx;
    previousAnswers.add(selectedAnswer);

    if (isAnswerCorrect) {
      // Emit event to parent that question is complete
      driver.unblock();
      // Start expansion animation

      setTimeout(() => {
        isExpanded = true;
      }, 500);
    } else {
      // Trigger shake animation
      shouldShake = true;
      setTimeout(() => {
        shouldShake = false;
      }, 500);
    }
  }
</script>

<div
  class="bg-surface-2 rounded-lg p-6 my-4 transition-all duration-300 ease-in-out"
  class:scale-105={isAnswerCorrect}
  class:shadow-lg={isAnswerCorrect}
>
  <div class="text-xl font-semibold text-text-1 mb-4">
    {section.label}
  </div>
  <div class="mb-6 prose prose-invert max-w-none">
    {@html section.content}
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {#each section.choices as choice, i}
      <button
        class="w-full p-4 text-left border-2 border-surface-3 rounded-md bg-surface-1 text-text-1 cursor-pointer transition-all duration-200 ease-in-out hover:border-brand hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        class:border-brand={selectedAnswer === i}
        class:bg-surface-2={selectedAnswer === i}
        class:border-success={isAnswerCorrect && i === correctAnswerIdx}
        class:bg-success-subtle={isAnswerCorrect && i === correctAnswerIdx}
        class:border-error={isAnswerCorrect &&
          selectedAnswer === i &&
          i !== correctAnswerIdx}
        class:bg-error-subtle={isAnswerCorrect &&
          selectedAnswer === i &&
          i !== correctAnswerIdx}
        on:click={() => selectAnswer(i)}
        disabled={hasCheckedAnswer && isAnswerCorrect}
      >
        <span class="block">{choice}</span>
      </button>
    {/each}
  </div>
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
  >
    <button
      class="w-full sm:w-auto px-6 py-3 bg-brand text-white border-none rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
      class:shake={shouldShake}
      on:click={checkAnswer}
      disabled={selectedAnswer === null ||
        (hasCheckedAnswer && isAnswerCorrect)}
    >
      {hasCheckedAnswer && isAnswerCorrect ? 'Correct!' : 'Check Answer'}
    </button>
    {#if hasCheckedAnswer && isAnswerCorrect}
      <button
        class="w-full sm:w-auto px-6 py-3 bg-transparent text-text-2 border border-surface-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-surface-2 hover:text-text-1"
        on:click={() => (showExplanation = !showExplanation)}
      >
        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
      </button>
    {/if}
  </div>
  {#if showExplanation && hasCheckedAnswer && isAnswerCorrect}
    <div
      class="mt-4 p-4 bg-surface-1 rounded-md border border-surface-3 prose prose-invert max-w-none"
      transition:slide
    >
      {@html explanation}
    </div>
  {/if}
</div>
