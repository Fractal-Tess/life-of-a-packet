<script lang="ts">
  import { getDriver } from './driver.svelte';
  import { fly, fade } from 'svelte/transition';
  import { House } from '@lucide/svelte';

  const driver = getDriver();
</script>

<div class="relative flex items-center justify-center gap-4">
  <button
    class="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 {driver.finished
      ? 'bg-gray-400 cursor-default'
      : 'bg-accent cursor-pointer hover:scale-105'} text-white rounded-full shadow-lg w-60 transition z-50"
    on:click={() => !driver.finished && driver.next()}
  >
    {driver.finished ? 'Finished' : 'Continue'}
  </button>
  {#if driver.finished}
    <a
      href="/"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 ml-[15rem] bg-accent cursor-pointer hover:scale-105 text-white rounded-full p-3 shadow-lg transition-all z-50"
      aria-label="Go Home"
      in:fly={{ x: 40, duration: 400, opacity: 1 }}
    >
      <House class="!opacity-100" />
    </a>
  {/if}
</div>
