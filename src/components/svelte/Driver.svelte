<script lang="ts">
  import { Driver, setDriver } from './driver.svelte';
  import Progress from './Progress.svelte';
  import ContinueButton from './ContinueButton.svelte';

  const driver = new Driver();
  setDriver(driver);
</script>

<Progress />

<ContinueButton />
