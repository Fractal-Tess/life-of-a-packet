<script lang="ts">
  import { slide } from 'svelte/transition';
  import { getDriver } from '../driver.svelte';
  import { CircleHelp } from '@lucide/svelte';

  const { label, content, choices, correct, explanation } = $props();

  let selected: number | null = $state(null);
  let showExplanation = $state(false);
  let isCorrect = $state(false);
  let hasChecked = $state(false);
  let shouldShake = $state(false);
  let shouldFlashError = $state(false);
  let disabledChoices: boolean[] = $state([]);

  const driver = getDriver();

  function selectChoice(idx: number) {
    selected = idx;
  }

  function checkAnswer() {
    if (selected === null) return;

    isCorrect = selected === correct;
    hasChecked = true;
    if (isCorrect) {
      driver.unblock();
    }
    if (!isCorrect) {
      disabledChoices[selected] = true;
      selected = null;

      shouldShake = true;
      shouldFlashError = true;
      setTimeout(() => (shouldShake = false), 500);
      setTimeout(() => (shouldFlashError = false), 300);
    }
  }
</script>

<div
  class="relative bg-surface-2 rounded-lg p-6 transition-all duration-300 ease-in-out bg-primary/80 border-2 border-accent shadow-2xl my-20"
  class:scale-95={isCorrect}
  class:shadow-lg={isCorrect}
  class:border-accent={isCorrect}
  class:border-edge={!isCorrect}
  class:flash-error={shouldFlashError}
>
  <CircleHelp class="w-8 h-8 text-edge absolute top-4 right-4" />
  {#if label}
    <div class="text-xl font-semibold text-text-1 mb-4">{label}</div>
  {/if}
  {#if content}
    <div class="mb-6 prose prose-invert max-w-none">{@html content}</div>
  {/if}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    {#each choices as choice, i}
      <button
        tabindex="-1"
        class="w-full p-4 text-left border-2 border-edge rounded-md bg-surface-1 text-text-1 cursor-pointer transition-all duration-200 ease-in-out hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
        class:border-accent={hasChecked && isCorrect && i === correct}
        class:border-white={selected === i}
        class:border-error={hasChecked && !isCorrect && selected === i}
        class:bg-accent={hasChecked && isCorrect && i === correct}
        class:text-white={hasChecked && isCorrect && i === correct}
        class:text-error={hasChecked && !isCorrect && selected === i}
        class:opacity-60={hasChecked && !isCorrect && selected === i}
        class:bg-surface-2={selected === i}
        class:font-bold={selected === i}
        disabled={disabledChoices[i]}
        onclick={() => selectChoice(i)}
      >
        <span class="block">{choice}</span>
      </button>
    {/each}
  </div>
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"
  >
    <button
      class="ml-auto sm:w-auto px-6 py-3 bg-brand text-white rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed border-2"
      class:shake={shouldShake}
      onclick={checkAnswer}
      disabled={selected === null || (hasChecked && isCorrect)}
    >
      {hasChecked && isCorrect ? 'Correct!' : 'Check Answer'}
    </button>
    {#if hasChecked && isCorrect && explanation}
      <button
        class="w-full min-w-32 sm:w-auto px-6 py-3 bg-transparent text-text-2 border border-surface-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-surface-2 hover:text-text-1"
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

<style>
  .shake {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  @keyframes shake {
    10%,
    90% {
      transform: translateX(-2px);
    }
    20%,
    80% {
      transform: translateX(4px);
    }
    30%,
    50%,
    70% {
      transform: translateX(-8px);
    }
    40%,
    60% {
      transform: translateX(8px);
    }
  }
  .flash-error {
    animation: flash-error 0.3s linear;
  }
  @keyframes flash-error {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    50% {
      box-shadow: 0 0 16px 4px rgba(239, 68, 68, 0.7);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
</style>
