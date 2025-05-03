<script lang="ts">
  import { getDriver } from './driver.svelte';

  const driver = getDriver();
</script>

<button
  class="fixed bottom-4 max-w-3xl w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={!driver.CanContinue}
  onclick={() => {
    if (driver.IsLastSection) {
      driver.finish();
    } else {
      driver.continue();
    }
  }}
>
  {driver.IsLastSection ? 'Finish' : 'Continue'}
</button>
