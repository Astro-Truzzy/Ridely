// BlogDetail.tsx
import React, { useState,useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { SITE_URL } from "../Lib/site";
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
    <div
      className="p-10 text-center min-h-[60vh] flex flex-col items-center justify-center"
      style={{ background: "#0a0a0f", color: "#ffffff" }}
    >
      <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
      <p className="mb-6" style={{ color: "#a0a0b0" }}>
        Sorry, the blog post you are looking for does not exist.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="gradient-blue px-6 py-3 rounded-full font-semibold"
      >
        Back to Home
      </button>
    </div>
  );
}

if (loading) {
  return (
    <div
      className="flex items-center justify-center h-[60vh]"
      style={{ background: "#0a0a0f" }}
    >
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-4 border-opacity-50"
        style={{ borderColor: "#175aff", borderTopColor: "transparent" }}
      />
    </div>
  );
}

// Related posts (exclude current post, show max 2)
const relatedPosts = blogDetails
  .filter(
    (p) => p.id !== postId && p.tags?.some((tag) => post.tags?.includes(tag))
  )
  .slice(0, 2);

const currentUrl = window.location.href;

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
        <meta name="description" content={post.content.slice(0, 150)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.slice(0, 150)} />
        <meta
          property="og:image"
          content={window.location.origin + post.image}
        />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.id}`} />
        <meta property="og:url" content={`${SITE_URL}/blog/${post.id}`} />
      </Helmet>
      <div style={{ background: "#0a0a0f" }} className="min-h-screen py-10 px-4">
      <motion.section
        className="max-w-4xl mx-auto p-6 md:p-10 glass-card rounded-2xl my-6"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>
        <div
          className="text-sm mb-8 flex flex-col md:flex-row md:justify-between gap-1"
          style={{ color: "#a0a0b0" }}
        >
          <span>By {post.author}</span>
          <span>{post.date}</span>
        </div>
        <article
          className="whitespace-pre-line leading-relaxed mb-10 text-base md:text-lg"
          style={{ color: "#d0d0dc" }}
        >
          {post.content}
        </article>

        {/* Pagination - Next/Previous */}
        <div className="flex justify-between mt-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {postId > 1 && (
            <Link
              to={`/blog/${postId - 1}`}
              className="font-medium transition-colors hover:text-[#4d7dff]"
              style={{ color: "#175aff" }}
            >
              ← Previous Post
            </Link>
          )}
          {postId < blogDetails.length && (
            <Link
              to={`/blog/${postId + 1}`}
              className="font-medium ml-auto transition-colors hover:text-[#4d7dff]"
              style={{ color: "#175aff" }}
            >
              Next Post →
            </Link>
          )}
        </div>

        {/* Social Sharing */}
        <div className="mb-10 mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-lg font-semibold mb-4 text-white">Share this article</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href={createShareUrl("twitter", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-2 hover:text-white"
              style={{ color: "#a0a0b0" }}
            >
              <FaXTwitter className="text-xl" />
              <span>X (Twitter)</span>
            </a>

            <a
              href={createShareUrl("linkedin", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-2 hover:text-white"
              style={{ color: "#a0a0b0" }}
            >
              <FaLinkedin className="text-xl" />
              <span>LinkedIn</span>
            </a>

            <a
              href={createShareUrl("facebook", currentUrl, post.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="transition flex items-center gap-2 hover:text-white"
              style={{ color: "#a0a0b0" }}
            >
              <FaFacebookSquare className="text-xl" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Comments */}
        <section className="mb-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-xl font-semibold mb-4 text-white">Comments</h3>

          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#175aff]"
              style={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
              }}
              value={commentInput.name}
              onChange={(e) =>
                setCommentInput({ ...commentInput, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Your Comment"
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#175aff]"
              style={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
              }}
              rows={3}
              value={commentInput.comment}
              onChange={(e) =>
                setCommentInput({ ...commentInput, comment: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="gradient-blue px-5 py-2.5 rounded-full font-semibold"
            >
              Submit Comment
            </button>
          </form>

          <div>
            {comments.length === 0 ? (
              <p style={{ color: "#a0a0b0" }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="mb-4 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="whitespace-pre-line mt-1" style={{ color: "#a0a0b0" }}>
                    {c.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-6 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 className="text-2xl font-semibold mb-6 text-white">Related Posts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Link to={`/blog/${related.id}`}>
                    <img
                      src={related.image}
                      alt={related.title}
                      className="mb-0 h-40 object-cover w-full"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-white">{related.title}</h4>
                      <p className="text-sm mt-1" style={{ color: "#a0a0b0" }}>
                        {related.date}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </motion.section>
      </div>
    </>
  );
};

export default BlogDetail;
