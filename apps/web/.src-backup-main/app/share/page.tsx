import { redirect } from 'next/navigation';

type ShareSearchParams = {
  title?: string;
  text?: string;
  url?: string;
};

export default async function SharePage({
  searchParams,
}: {
  // Next.js 15+ 起 searchParams 为 Promise
  searchParams: Promise<ShareSearchParams>;
}) {
  const { title, text, url } = await searchParams;

  // Process shared content (save to database, etc.)
  console.log('Shared content:', { title, text, url });

  // Redirect to appropriate page
  // For now, redirect to knowledge base with shared content as query params
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (text) params.set('text', text);
  if (url) params.set('url', url);

  redirect(`/kb?${params.toString()}`);
}
