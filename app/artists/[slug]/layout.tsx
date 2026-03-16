// Generate static params for all artist pages
export function generateStaticParams() {
  return [
    { slug: 'marcus-chen' },
    { slug: 'sofia-andersson' },
    { slug: 'amara-okonkwo' },
    { slug: 'james-whitmore' },
    { slug: 'elena-vasquez' },
    { slug: 'kai-tanaka' },
    { slug: 'olivia-reed' },
    { slug: 'david-okafor' },
  ]
}

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
