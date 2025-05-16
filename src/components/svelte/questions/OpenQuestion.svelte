<script lang="ts">
  import { slide } from 'svelte/transition';
  import { getDriver } from '../driver.svelte';

  export let label: string = '';
  export let content: string = '';
  export let correct: string = '';
  export let explanation: string = '';

  let answer: string = '';
  let showExplanation = false;
  let isCorrect = false;
  let hasChecked = false;
  let shouldShake = false;

  const driver = getDriver?.();

  function checkAnswer() {
    isCorrect =
      answer.trim().length > 0 &&
      (correct.trim() === '' ||
        answer.trim().toLowerCase() === correct.trim().toLowerCase());
    hasChecked = true;
    if (isCorrect && driver?.unblock) {
      driver.unblock();
    }
    if (!isCorrect) {
      shouldShake = true;
      setTimeout(() => (shouldShake = false), 500);
    }
  }
</script>

<div
  class="bg-surface-2 rounded-lg p-6 my-4 transition-all duration-300 ease-in-out"
  class:scale-105={isCorrect}
  class:shadow-lg={isCorrect}
>
  {#if label}
    <div class="text-xl font-semibold text-text-1 mb-4">{label}</div>
  {/if}
  {#if content}
    <div class="mb-6 prose prose-invert max-w-none">{@html content}</div>
  {/if}
  <textarea
    class="w-full p-3 border-2 border-surface-3 rounded-md bg-surface-1 text-text-1 mb-4"
    rows="3"
    bind:value={answer}
    placeholder="Type your answer..."
    disabled={hasChecked && isCorrect}
  />
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
  >
    <button
      class="w-full sm:w-auto px-6 py-3 bg-brand text-white border-none rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
      class:shake={shouldShake}
      onclick={checkAnswer}
      disabled={answer.trim() === '' || (hasChecked && isCorrect)}
    >
      {hasChecked && isCorrect ? 'Correct!' : 'Check Answer'}
    </button>
    {#if hasChecked && isCorrect && explanation}
      <button
        class="w-full sm:w-auto px-6 py-3 bg-transparent text-text-2 border border-surface-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-surface-2 hover:text-text-1"
        onclick={() => (showExplanation = !showExplanation)}
      >
        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
      </button>
    {/if}
  </div>
  {#if showExplanation && hasChecked && isCorrect && explanation}
    <div
      class="mt-4 p-4 bg-surface-1 rounded-md border border-surface-3 prose prose-invert max-w-none"
      transition:slide
    >
      {@html explanation}
    </div>
  {/if}
</div>
