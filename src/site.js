// Business details used across every page, the meta tags and the structured data.
// Edit here once and the whole site (and what search engines read) updates on the next build.
export const SITE = {
  name: 'Sande Technologies',
  alternateName: 'Sande Tech',
  url: 'https://sandetechnologies.com', // official address, no trailing slash
  email: 'sandetechnologiesmw@gmail.com',
  phone: '+265 996 534 912',
  phoneE164: '+265996534912',
  whatsapp: 'https://wa.me/265996534912',
  city: 'Lilongwe',
  country: 'Malawi',
  countryCode: 'MW',
  lang: 'en',
  locale: 'en_MW',
  founder: 'Kelvin Sande',
  hours: 'Monday to Friday, 08:00–17:00 CAT (UTC+2)',
  // No public office: the business serves Lilongwe, Malawi and clients remotely.
  areaServed: ['Malawi', 'Africa', 'United Kingdom', 'Europe', 'United States'],

  // Paste the verification codes from Google Search Console and Bing Webmaster Tools here
  // (only the content="..." value), then rebuild. Leave empty if you verify by DNS instead.
  googleSiteVerification: '',
  bingSiteVerification: '',

  // Add your public profile links (LinkedIn, Facebook, X, Instagram, GitHub…). They feed the
  // "sameAs" field that helps Google connect these profiles to the business.
  social: [],
};

export const abs = (path = '/') => SITE.url + path;
