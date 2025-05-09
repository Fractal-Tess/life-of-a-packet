<script lang="ts">
  import { Driver, setDriver } from './driver.svelte';
  import Progress from './Progress.svelte';

  interface Props {
    content: string;
  }

  const {}: Props = $props();

  const driver = new Driver();
  setDriver(driver);
</script>

<Progress />
<!-- <Renderer /> -->
<!-- <ContinueButton /> -->
