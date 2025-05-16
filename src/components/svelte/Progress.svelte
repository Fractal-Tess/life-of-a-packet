<script lang="ts">
  import { getDriver } from './driver.svelte';

  const driver = getDriver();
</script>

<div
  class="fixed top-0 left-0 w-full md:w-16 h-16 md:h-screen flex md:flex-col items-center justify-center gap-2 p-3 border-b md:border-b-0 md:border-r border-edge bg-primary/95 backdrop-blur-sm z-10"
>
  <a
    href="/"
    class="absolute p-2 top-0 mx-auto text-accent cursor-pointer transition-colors duration-200 z-20"
    title="Back to home"
    aria-label="Back to home"
  >
    <svg
      class="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>

  {#each driver.sections as _, i}
    <button
      class="relative w-2 h-2 md:w-2 md:h-6 rounded-lg {i <= driver.progress
        ? 'bg-accent cursor-pointer'
        : 'bg-edge/30 cursor-not-allowed'}"
      onclick={() => driver.scrollTo(i)}
      disabled={i > driver.sections.length - 1}
      title={i <= driver.progress
        ? `Jump to section ${i + 1}`
        : 'Not available yet'}
      aria-label={i <= driver.progress
        ? `Jump to section ${i + 1}`
        : 'Not available yet'}
    >
      <div
        class="absolute inset-0 rounded-full transition-all duration-200 hover:scale-150
        {i <= driver.progress
          ? 'bg-accent hover:brightness-125'
          : 'bg-edge/30'}"
      ></div>
    </button>
  {/each}

  <button
    onclick={() => driver.reset()}
    class="absolute bottom-0 left-0 right-0 p-2 text-edge hover:text-accent transition-colors duration-200"
    title="Reset progress"
    aria-label="Reset progress"
  >
    <svg
      class="w-6 h-6 mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</div>
