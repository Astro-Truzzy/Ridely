// BlogDetail.tsx
import React, { useState,useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";




interface BlogPostDetail {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags?: string[];
}

const blogDetails: BlogPostDetail[] = [
  {
    id: 1,
    title: "Ridely Shines at Techstars Hackathon",
    content: `The Techstars Hackathon was a whirlwind of innovation, pressure, and breakthroughs — and Ridely made its mark in style. Competing alongside dozens of forward-thinking startups, our team delivered a polished prototype that caught the attention of judges and attendees alike.

From real-time rider tracking to seamless delivery booking, we demonstrated how Ridely is reimagining last-mile logistics for individuals and small businesses. The feedback was overwhelmingly positive, with particular praise for our clean UX, practical value, and potential to scale.

Participating in this hackathon wasn’t just about visibility — it was a catalyst. It validated our idea, stress-tested our execution under pressure, and connected us to a broader network of tech leaders and potential partners.

As we continue building, the momentum from this event pushes us forward. Ridely isn’t just a delivery app — it’s a movement toward simpler, smarter, and safer logistics.`,
    author: "Trust Williams",
    date: "May 10, 2025",
    image: "/images/Techstars1.jpg",
    tags: ["Hackathon", "Tech", "Ridely", "Startup"],
  },
  {
    id: 2,
    title: "Building Ridely in 3 Hours",
    content: `What can you really build in 3 hours? Turns out — quite a lot. With a clear vision and a focused team, Ridely’s prototype was developed in just a few intense hours at the Techstars Hackathon.

Starting from scratch, we built the core of the Ridely app — user registration, package booking, distance-based cost calculation, and a responsive dashboard. It wasn’t perfect, but it was powerful.

Every decision, from UI to backend logic, was driven by one goal: solve a real problem with as little friction as possible. By the end of the build, we had something that worked. And more importantly — something that felt like Ridely.

This rapid build reminded us that startup success doesn’t always come from having all the answers, but from being willing to start small and iterate fast. The foundation was laid — and it’s only up from here.`,
    author: "Precious Obi",
    date: "May 11, 2025",
    image: "/images/Techstars2.jpg",
    tags: ["Development", "Startup", "Prototype", "Ridely"],
  },
  {
    id: 3,
    title: "Teamwork That Delivered",
    content: `At the core of Ridely’s Hackathon success wasn’t just code — it was collaboration.

Our diverse team — spanning frontend, backend, product design, and business strategy — worked together with the synergy of a seasoned startup. Despite the time pressure and high stakes, our shared clarity, mutual respect, and focus on solving real problems fueled our performance.

Williams Trust, Ridely’s founder and team lead, set the tone with a compelling first pitch that anchored our direction. Unity Ekeoba, our full-stack developer, built our landing page from the ground up, translating vision into a functional, user-friendly experience. Lily Aikhomu, our business strategist, crafted a pitch deck that communicated both our solution and its potential with precision. And guiding us throughout the day was our mentor, Mr. Osinachi, whose insight into best practices helped us stay focused and aligned.

This experience wasn’t just about delivering a project — it was about building a team. As we continue developing Ridely beyond the hackathon, we carry forward this same spirit of purpose-driven collaboration. Because in the end, it's not just about what we're building — but who we're building it with.

`,
    author: "Ridely Team",
    date: "May 12, 2025",
    image: "/images/Techstars3.jpg",
    tags: ["Teamwork", "Culture", "Startup", "Ridely"],
  },
];

// Helper function to create share URLs
const createShareUrl = (platform: string, url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    default:
      return "#";
  }
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
const postId = parseInt(id || "", 10);
const post = blogDetails.find((p) => String(p.id) === id);

console.log("Blog ID from URL:", id);



const [comments, setComments] = useState<{ name: string; comment: string }[]>(
  []
);
const [commentInput, setCommentInput] = useState({ name: "", comment: "" });
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Fake loading delay
  const timeout = setTimeout(() => setLoading(false), 500);
  return () => clearTimeout(timeout);
}, [postId]);

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

if (!post) {
  return (
    <div className="p-10 text-center bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Post Not Found</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Sorry, the blog post you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/blog")}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Blog
      </button>
    </div>
  );
}

if (loading) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50" />
    </div>
  );
}

// Related posts (exclude current post, show max 2)
const relatedPosts = blogDetails
  .filter(
    (p) => p.id !== postId && p.tags?.some((tag) => post.tags?.includes(tag))
  )
  .slice(0, 2);

// Use clean canonical URL without query params or fragments
const siteUrl = "https://ridelyapp.vercel.app";
const currentUrl = `${siteUrl}/blog/${id}`;

const handleCommentSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (commentInput.name.trim() && commentInput.comment.trim()) {
    setComments([...comments, { ...commentInput }]);
    setCommentInput({ name: "", comment: "" });
  }
};


  return (
    <>
      <Helmet>
        <title>{post.title} | Ridely Blog</title>
        <meta name="description" content={post.content.slice(0, 160) + "..."} />
        <meta name="keywords" content={post.tags?.join(", ") || "Ridely, delivery, logistics"} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.slice(0, 160) + "..."} />
        <meta property="og:image" content={window.location.origin + post.image} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Ridely" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
        {post.tags && post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.slice(0, 160) + "..."} />
        <meta name="twitter:image" content={window.location.origin + post.image} />
        
        {/* Canonical URL - Always use clean URL without query params or fragments */}
        <link rel="canonical" href={currentUrl || `${siteUrl}/blog/${id}`} />
        
        {/* Structured Data for Blog Post */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.content.slice(0, 160) + "...",
            "image": window.location.origin + post.image,
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Ridely",
              "logo": {
                "@type": "ImageObject",
                "url": window.location.origin + "/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": currentUrl
            }
          })}
        </script>
      </Helmet>
      <motion.section
        className="max-w-4xl mx-auto p-6 md:p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg my-10 transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-md mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-[#175aff] mb-4">
          {post.title}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-col md:flex-row md:justify-between">
          <span>By {post.author}</span>
          <span>{post.date}</span>
        </div>
        <article className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed mb-10 text-base md:text-lg">
          {post.content}
        </article>

        {/* Pagination - Next/Previous */}
        <div className="flex justify-between mt-10">
          {postId > 1 && (
            <Link
              to={`/blog/${postId - 1}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Previous Post
            </Link>
          )}
          {postId < blogDetails.length && (
            <Link
              to={`/blog/${postId + 1}`}
              className="text-blue-600 hover:underline ml-auto"
            >
              Next Post →
            </Link>
          )}
        </div>

        {/* Social Sharing */}
        <div className="mb-10 mt-6">
          <h3 className="text-lg font-semibold mb-3">Share this article:</h3>
          <div className="flex space-x-4">
            <a
              href={createShareUrl("twitter", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition flex items-center space-x-2"
            >
              <FaXTwitter className="text-2xl" />
              <span>X (Twitter)</span>
            </a>

            <a
              href={createShareUrl("linkedin", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 transition flex items-center space-x-2"
            >
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </a>

            <a
              href={createShareUrl("facebook", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-900 transition flex items-center space-x-2"
            >
              <FaFacebookSquare className="text-2xl" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Comments */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>

          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={commentInput.name}
              onChange={(e) =>
                setCommentInput({ ...commentInput, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Your Comment"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              value={commentInput.comment}
              onChange={(e) =>
                setCommentInput({ ...commentInput, comment: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Comment
            </button>
          </form>

          <div>
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {c.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-10">
            <div className="mt-14">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Related Posts</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((related) => (
                  <motion.div
                    key={related.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4 transition-colors duration-200"
                  >
                    <Link to={`/blog/${related.id}`}>
                      <img
                        src={related.image}
                        alt={related.title}
                        className="rounded-md mb-3 h-40 object-cover w-full"
                      />
                      <h4 className="text-xl font-bold text-[#175aff] dark:text-blue-400">
                        {related.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {related.date}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </motion.section>
    </>
  );
};

export default BlogDetail;
