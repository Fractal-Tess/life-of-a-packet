<script lang="ts">
  import { fade } from 'svelte/transition';

  interface Props {
    errors: string[];
  }

  const { errors }: Props = $props();

  function formatError(error: string): { title: string; details: string[] } {
    const [title, ...details] = error.split('\n');
    return {
      title,
      details: details.map((detail) => detail.trim()),
    };
  }
</script>

{#if errors.length > 0}
  <div
    class="bg-red-50 border border-red-400 rounded-lg p-4 mb-4"
    transition:fade
  >
    <h3 class="text-red-700 font-semibold mb-2">Content Validation Errors</h3>
    <div class="space-y-4">
      {#each errors as error}
        {@const { title, details } = formatError(error)}
        <div class="bg-white/50 rounded p-3">
          <h4 class="text-red-600 font-medium">{title}</h4>
          {#if details.length > 0}
            <ul class="list-disc pl-6 mt-2 space-y-1">
              {#each details as detail}
                <li class="text-red-800 text-sm">{detail}</li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
