import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  tags?: string[];
}

/**
 * SEO Component for dynamic meta tags
 * Use this component in pages that need custom SEO
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  tags,
}) => {
  const siteUrl = "https://ridelyapp.vercel.app"; // Replace with your actual domain
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : siteUrl);
  const ogImage = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : defaultImage;

  const structuredData = type === "article" && publishedTime
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        image: ogImage,
        datePublished: publishedTime,
        dateModified: publishedTime,
        author: {
          "@type": "Person",
          name: author || "Ridely",
        },
        publisher: {
          "@type": "Organization",
          name: "Ridely",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": currentUrl,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
        url: currentUrl,
      };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title} | Ridely</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Ridely" />
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
