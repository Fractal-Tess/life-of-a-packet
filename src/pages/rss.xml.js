import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { title, description } from '../data/landing.json';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: title,
    description: description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}/`,
    })),
  });
}
