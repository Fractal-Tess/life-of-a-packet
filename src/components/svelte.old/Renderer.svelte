<script lang="ts">
  import { fade } from 'svelte/transition';
  import Question from './Question.svelte';
  import { getDriver } from './driver.svelte';

  const driver = getDriver();
</script>

{#each driver.ShownSections as section (section.index)}
  <div transition:fade>
    {#if section.type === 'section'}
      {@html section.content}
    {:else if section.type === 'question'}
      <Question {section} />
    {/if}
  </div>
{/each}
