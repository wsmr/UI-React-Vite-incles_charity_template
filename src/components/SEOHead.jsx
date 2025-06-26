import { useEffect } from 'react'

const SEOHead = ({ 
  title = "Incles - Modern Charity Platform | Making a Difference Since 1999",
  description = "Join Incles in creating positive change worldwide. Support education, healthcare, and environmental initiatives. 98% of donations go directly to programs. Donate now and make a difference.",
  keywords = "charity, donation, nonprofit, education, healthcare, environment, volunteer, fundraising, community development, social impact",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl = "https://incles.org",
  structuredData = null
}) => {
  
  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Basic SEO meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', 'Incles Charity Platform')
    updateMetaTag('robots', 'index, follow')
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0')

    // Open Graph meta tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', ogImage, true)
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:url', canonicalUrl, true)
    updateMetaTag('og:site_name', 'Incles Charity Platform', true)
    updateMetaTag('og:locale', 'en_US', true)

    // Twitter Card meta tags
    updateMetaTag('twitter:card', twitterCard)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', ogImage)
    updateMetaTag('twitter:site', '@InclesCharity')
    updateMetaTag('twitter:creator', '@InclesCharity')

    // Additional meta tags for charity organizations
    updateMetaTag('theme-color', '#3B82F6')
    updateMetaTag('msapplication-TileColor', '#3B82F6')
    updateMetaTag('application-name', 'Incles')
    updateMetaTag('apple-mobile-web-app-title', 'Incles')
    updateMetaTag('apple-mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default')

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(structuredData)
    }

    // RSS Feed link
    let rss = document.querySelector('link[type="application/rss+xml"]')
    if (!rss) {
      rss = document.createElement('link')
      rss.setAttribute('rel', 'alternate')
      rss.setAttribute('type', 'application/rss+xml')
      rss.setAttribute('title', 'Incles News & Updates')
      rss.setAttribute('href', '/rss.xml')
      document.head.appendChild(rss)
    }

    // Preconnect to external domains for performance
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ]

    preconnectDomains.forEach(domain => {
      let preconnect = document.querySelector(`link[href="${domain}"]`)
      if (!preconnect) {
        preconnect = document.createElement('link')
        preconnect.setAttribute('rel', 'preconnect')
        preconnect.setAttribute('href', domain)
        if (domain.includes('gstatic')) {
          preconnect.setAttribute('crossorigin', '')
        }
        document.head.appendChild(preconnect)
      }
    })

  }, [title, description, keywords, ogImage, ogType, twitterCard, canonicalUrl, structuredData])

  return null // This component doesn't render anything
}

// Default structured data for the organization
export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Incles",
  "alternateName": "Incles Charity Platform",
  "url": "https://incles.org",
  "logo": "https://incles.org/logo.png",
  "description": "A global charity organization dedicated to creating positive change in communities worldwide through education, healthcare, and environmental initiatives.",
  "foundingDate": "1999",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Charity Street",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10001",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service",
    "email": "info@incles.org"
  },
  "sameAs": [
    "https://www.facebook.com/incles",
    "https://www.twitter.com/incles",
    "https://www.instagram.com/incles",
    "https://www.linkedin.com/company/incles",
    "https://www.youtube.com/c/incles"
  ],
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Education",
    "Healthcare",
    "Environmental Conservation",
    "Poverty Relief",
    "Community Development"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Independent Sector"
  },
  "award": [
    "GuideStar Platinum Seal of Transparency",
    "Charity Navigator 4-Star Rating",
    "Better Business Bureau Accredited Charity"
  ]
})

// Structured data for donation actions
export const getDonationStructuredData = (cause) => ({
  "@context": "https://schema.org",
  "@type": "DonateAction",
  "agent": {
    "@type": "NGO",
    "name": "Incles"
  },
  "recipient": {
    "@type": "NGO",
    "name": "Incles"
  },
  "object": {
    "@type": "MonetaryGrant",
    "name": cause?.title || "General Donation",
    "description": cause?.description || "Support our mission to create positive change worldwide"
  },
  "result": {
    "@type": "Thing",
    "name": "Positive Social Impact"
  }
})

// Structured data for events
export const getEventStructuredData = (event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.location?.name,
    "address": event.location?.address
  },
  "organizer": {
    "@type": "NGO",
    "name": "Incles",
    "url": "https://incles.org"
  },
  "offers": {
    "@type": "Offer",
    "price": event.price || "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
})

// Structured data for articles/blog posts
export const getArticleStructuredData = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Organization",
    "name": "Incles"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Incles",
    "logo": {
      "@type": "ImageObject",
      "url": "https://incles.org/logo.png"
    }
  },
  "datePublished": article.publishDate,
  "dateModified": article.modifiedDate || article.publishDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
})

export default SEOHead

