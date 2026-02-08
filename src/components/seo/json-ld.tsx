export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ТОО Ferrum Link',
    url: 'https://ferrumlink.kz',
    email: 'info@ferrumlink.kz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Циолковского 11, офис 305',
      addressLocality: 'Астана',
      addressCountry: 'KZ',
    },
    description:
      'Поставщик металлопроката и промышленных материалов в Казахстане.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
