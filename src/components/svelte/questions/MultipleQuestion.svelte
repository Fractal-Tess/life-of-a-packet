<script lang="ts">
  import { slide } from 'svelte/transition';
  import { getDriver } from '../driver.svelte';

  export let label: string = '';
  export let content: string = '';
  export let choices: string[] = [];
  export let correct: number[] = [];
  export let explanation: string = '';

  let selected: number[] = [];
  let showExplanation = false;
  let isCorrect = false;
  let hasChecked = false;
  let shouldShake = false;

  const driver = getDriver?.();

  function selectChoice(idx: number) {
    if (selected.includes(idx)) {
      selected = selected.filter((i) => i !== idx);
    } else {
      selected = [...selected, idx];
    }
  }

  function checkAnswer() {
    const arr = [...selected].sort();
    const corr = [...correct].sort();
    isCorrect = JSON.stringify(arr) === JSON.stringify(corr);
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
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {#each choices as choice, i}
      <button
        class="w-full p-4 text-left border-2 border-surface-3 rounded-md bg-surface-1 text-text-1 cursor-pointer transition-all duration-200 ease-in-out hover:border-brand hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        class:border-brand={selected.includes(i)}
        class:bg-surface-2={selected.includes(i)}
        class:font-bold={selected.includes(i)}
        class:scale-105={selected.includes(i)}
        class:border-success={isCorrect && correct.includes(i)}
        class:bg-success-subtle={isCorrect && correct.includes(i)}
        class:border-error={hasChecked &&
          !isCorrect &&
          selected.includes(i) &&
          !correct.includes(i)}
        class:bg-error-subtle={hasChecked &&
          !isCorrect &&
          selected.includes(i) &&
          !correct.includes(i)}
        onclick={() => selectChoice(i)}
        disabled={hasChecked && isCorrect}
      >
        {#if selected.includes(i)}
          <svg
            class="w-5 h-5 text-brand mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            /></svg
          >
        {/if}
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
      onclick={checkAnswer}
      disabled={selected.length === 0 || (hasChecked && isCorrect)}
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
