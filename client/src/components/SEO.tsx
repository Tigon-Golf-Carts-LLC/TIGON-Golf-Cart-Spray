import { useEffect } from 'react';

const SITE_URL = 'https://tigonspray.com';
const SITE_NAME = 'TIGON Spray';
const TWITTER_HANDLE = '@tigonspray';
const FACEBOOK_PAGE = 'https://facebook.com/tigonspray';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article';
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  product?: {
    name: string;
    price: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    sku?: string;
    brand?: string;
    category?: string;
    image?: string;
    description?: string;
    reviewCount?: number;
    ratingValue?: number;
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image,
  keywords = [],
  noIndex = false,
  product,
  article,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  
  // Compute canonical URL - handles both absolute and relative URLs
  const computeCanonicalUrl = () => {
    // If canonical is provided
    if (canonical) {
      // Check if it's already an absolute URL
      if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
        return canonical;
      }
      // Ensure single slash at the start
      const normalizedPath = canonical.startsWith('/') ? canonical : `/${canonical}`;
      return `${SITE_URL}${normalizedPath}`;
    }
    
    // Fallback to current pathname (only in browser)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      return `${SITE_URL}${currentPath}`;
    }
    
    // Default to homepage for SSR context
    return SITE_URL;
  };
  
  const canonicalUrl = computeCanonicalUrl();
  
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) 
    : `${SITE_URL}/favicon.png`;
  
  // Default keywords for golf cart cleaning
  const defaultKeywords = [
    'golf cart spray cleaner',
    'golf cart cleaning',
    'golf cart protectant',
    'golf cart maintenance',
    'TIGON Spray',
    'golf cart care products',
  ];
  
  const allKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', allKeywords.join(', '));
    
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // Open Graph tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:type', type === 'product' ? 'product' : type === 'article' ? 'article' : 'website', true);
    updateMeta('og:image', imageUrl, true);
    updateMeta('og:image:alt', title, true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', imageUrl);
    updateMeta('twitter:site', TWITTER_HANDLE);
    updateMeta('twitter:creator', TWITTER_HANDLE);

    // Additional Open Graph tags
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:image:type', 'image/png', true);
    updateMeta('article:publisher', FACEBOOK_PAGE, true);

    // Article-specific meta tags
    if (article) {
      if (article.publishedTime) {
        updateMeta('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMeta('article:modified_time', article.modifiedTime, true);
      }
      if (article.author) {
        updateMeta('article:author', article.author, true);
      }
      if (article.section) {
        updateMeta('article:section', article.section, true);
      }
    }

    // Product-specific Open Graph
    if (product) {
      updateMeta('product:price:amount', product.price, true);
      updateMeta('product:price:currency', product.currency || 'USD', true);
      updateMeta('og:price:amount', product.price, true);
      updateMeta('og:price:currency', product.currency || 'USD', true);
    }
  }, [title, description, canonicalUrl, imageUrl, type, noIndex, product, article, allKeywords, fullTitle]);

  // Generate JSON-LD structured data
  const jsonLdScripts: object[] = [];

  // Organization schema (always include)
  jsonLdScripts.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/tigonspray',
      'https://www.instagram.com/tigonspray',
      'https://twitter.com/tigonspray',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-TIGON-SP',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  });

  // LocalBusiness schema
  jsonLdScripts.push({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    description: 'Premium golf cart cleaning and protection products',
    url: SITE_URL,
    telephone: '+1-800-TIGON-SP',
    priceRange: '$25-$50',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  });

  // Product schema
  if (product) {
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || description,
      image: product.image ? (product.image.startsWith('http') ? product.image : `${SITE_URL}${product.image}`) : imageUrl,
      brand: {
        '@type': 'Brand',
        name: product.brand || SITE_NAME,
      },
      sku: product.sku,
      category: product.category || 'Golf Cart Cleaning Supplies',
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
        seller: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
        url: canonicalUrl,
      },
      ...(product.reviewCount && product.ratingValue ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.ratingValue,
          reviewCount: product.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      } : {}),
    });
  }

  // Article schema
  if (article) {
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl,
      author: {
        '@type': 'Organization',
        name: article.author || SITE_NAME,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
      },
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      ...(article.tags ? { keywords: article.tags.join(', ') } : {}),
    });
  }

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
      })),
    });
  }

  // WebPage schema for non-product/article pages
  if (type === 'website') {
    jsonLdScripts.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    });
  }

  useEffect(() => {
    // Remove old JSON-LD scripts
    const oldScripts = document.querySelectorAll('script[data-seo-jsonld]');
    oldScripts.forEach(script => script.remove());

    // Add new JSON-LD scripts
    jsonLdScripts.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', `schema-${index}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-seo-jsonld]');
      scripts.forEach(script => script.remove());
    };
  }, [JSON.stringify(jsonLdScripts)]);

  return null; // This component only manages head tags
}

// Preset SEO configurations for common pages
export const seoPresets = {
  home: {
    title: 'Premium Golf Cart Spray Cleaner & Protectant',
    description: 'TIGON Spray offers premium golf cart cleaning and protection products. Our professional-grade formulas clean, shine, and protect your golf cart. Free shipping on all orders.',
    keywords: ['golf cart spray cleaner', 'golf cart cleaning products', 'golf cart protectant', 'best golf cart cleaner', 'professional golf cart care'],
    canonical: '/',
  },
  products: {
    title: 'Golf Cart Cleaning Products - All Formulas',
    description: 'Shop our complete line of golf cart cleaning sprays. From Original Formula to Elite Protection, find the perfect cleaner for your golf cart. Professional-grade formulas.',
    keywords: ['golf cart spray', 'golf cart cleaning products', 'buy golf cart cleaner', 'golf cart spray bottle'],
    canonical: '/products',
  },
  blog: {
    title: 'Golf Cart Care Tips & Maintenance Blog',
    description: 'Expert tips, guides, and advice for golf cart cleaning and maintenance. Learn how to keep your golf cart looking new with our professional insights.',
    keywords: ['golf cart maintenance tips', 'how to clean golf cart', 'golf cart care guide', 'golf cart cleaning tips'],
    canonical: '/blog',
  },
  cart: {
    title: 'Shopping Cart',
    description: 'Review your TIGON Spray golf cart cleaning products before checkout. Free shipping on all orders.',
    canonical: '/cart',
    noIndex: true,
  },
  checkout: {
    title: 'Secure Checkout',
    description: 'Complete your order for premium golf cart cleaning products. Secure payment processing.',
    canonical: '/checkout',
    noIndex: true,
  },
  affiliateSignup: {
    title: 'Join Affiliate Program - Earn 10% Commission',
    description: 'Join the TIGON Spray affiliate program and earn 10% commission on every sale. Promote premium golf cart cleaning products and track your earnings.',
    keywords: ['affiliate program', 'golf cart products affiliate', 'earn commission', 'affiliate marketing'],
    canonical: '/affiliate-signup',
  },
  affiliateDashboard: {
    title: 'Affiliate Dashboard',
    description: 'Track your affiliate sales, commissions, and performance. Generate affiliate links for TIGON Spray products.',
    canonical: '/affiliate',
    noIndex: true,
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'TIGON Spray admin dashboard for managing orders, products, and affiliates.',
    canonical: '/admin',
    noIndex: true,
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found.',
    noIndex: true,
  },
};
