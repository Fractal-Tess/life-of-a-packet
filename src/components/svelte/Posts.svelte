<script lang="ts">
  import { type CollectionEntry } from 'astro:content';

  interface Props {
    allPosts: CollectionEntry<'posts'>[];
  }

  const { allPosts }: Props = $props();
  let sortedPosts: CollectionEntry<'posts'>[] = $state(allPosts);

  function getIntersectionLength(a: any[], b: any[]): number {
    const intersection = a.filter((value) => b.includes(value));
    return intersection.length;
  }

  function sortPosts(filters: string[]) {
    if (!filters || filters.length == 0) {
      sortedPosts = allPosts.sort(
        (a: any, b: any) => b.data.order - a.data.order
      );
      return;
    }

    sortedPosts = allPosts.sort(
      (a: any, b: any) =>
        getIntersectionLength(b.data.tags, filters) -
        getIntersectionLength(a.data.tags, filters)
    );
  }
</script>

{#snippet postCard(post: CollectionEntry<'posts'>)}
  <a
    href={`/posts/${post.id}`}
    class="flex flex-col justify-between gap-2 min-h-40 h-full p-2 hover:border-accent border rounded-interactive border-edge bg-linear-to-b from-secondary to-secondary/60 pointer-events-auto duration-200 relative overflow-hidden group"
  >
    {#if post.data.thumbnail}
      <div class="absolute inset-0 w-full">
        <img
          src={post.data.thumbnail}
          alt={post.data.title}
          class="w-full h-full object-cover mask-l-from-0% [mask-image:none]:bg-gradient-to-r"
        />
      </div>
    {/if}

    <div class="flex flex-col justify-between gap-2 h-full relative z-10">
      <span
        class="text text-primary-foreground/75 not-supports-[mask-composite:intersect]:text-black/80"
      >
        <time datetime={post.data.date.toISOString()}>
          {post.data.date.toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </span>
      <h2
        class="text-xl font-bold not-supports-[mask-composite:intersect]:text-black"
      >
        {post.data.title}
      </h2>
    </div>
  </a>
{/snippet}

<div
  class="group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-interactive pointer-events-none hover:border-edge duration-200"
>
  {#each sortedPosts as post}
    {@render postCard(post)}
  {/each}
</div>
