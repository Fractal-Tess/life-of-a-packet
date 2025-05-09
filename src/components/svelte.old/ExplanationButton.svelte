<script lang="ts">
  interface Props {
    explanation: string;
    isVisible: boolean;
    onToggle: () => void;
  }

  const { explanation, isVisible, onToggle }: Props = $props();
</script>

<div>
  <button
    class="mt-4 w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    onclick={onToggle}
  >
    {isVisible ? 'Hide Explanation' : 'Show Explanation'}
  </button>
  {#if isVisible}
    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
      {explanation}
    </div>
  {/if}
</div>
