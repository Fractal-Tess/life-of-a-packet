<script lang="ts">
  import { Driver, setDriver } from './driver.svelte';
  import ContinueButton from './ContinueButton.svelte';
  import Renderer from './Renderer.svelte';
  import Progress from './Progress.svelte';

  interface Props {
    content: string;
  }

  const { content }: Props = $props();

  const driver = new Driver(content);
  setDriver(driver);
</script>

<Progress />
<Renderer />
<ContinueButton />
