<script lang="ts">
  type Props = {
    progress: {
      proxy: number;
    };
  };
  let { progress }: Props = $props();
  console.log(progress);
</script>

<button
  class="bg-blue-500 text-white px-4 py-2 rounded-md"
  onclick={() => progress.proxy++}
>
  {progress.proxy}
</button>
