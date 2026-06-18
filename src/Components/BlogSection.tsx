// BlogSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
}

const allPosts: BlogPost[] = [
  {
    id: 1,
    title: "Ridely Shines at Techstars Hackathon",
    description:
      "Our team showcased the Ridely platform at the Techstars Hackathon and earned 2nd place with a polished prototype that impressed judges and attendees alike.",
    image: "/images/Techstars1.jpg",
    author: "Trust Williams",
    date: "May 10, 2025",
  },
  {
    id: 2,
    title: "Building Ridely in 3 Hours",
    description:
      "The journey to build a working version of Ridely in under three hours — from registration to real-time tracking, under intense hackathon pressure.",
    image: "/images/Techstars2.jpg",
    author: "Precious Obi",
    date: "May 11, 2025",
  },
  {
    id: 3,
    title: "Teamwork That Delivered",
    description:
      "At the heart of our Hackathon success was a team that communicated, collaborated, and delivered under pressure — here's how we did it.",
    image: "/images/Techstars3.jpg",
    author: "Ridely Team",
    date: "May 12, 2025",
  },
];

const POSTS_PER_PAGE = 2;

const BlogSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedPosts, setPaginatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const start = (currentPage - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      setPaginatedPosts(allPosts.slice(start, end));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [currentPage]);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <section
      className="py-20 px-6 md:px-16"
      id="Blogs"
      style={{ background: "#0a0a0f" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Ridely <span className="text-gradient">Blog</span>
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#a0a0b0" }}>
            Stories, milestones, and moments from our journey building Nigeria&apos;s
            next-generation delivery platform.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-4 border-opacity-50"
              style={{ borderColor: "#175aff", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {paginatedPosts.map((post) => (
                <motion.article
                  key={post.id}
                  className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-[rgba(23,90,255,0.4)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 50%)",
                      }}
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#4d7dff] transition-colors">
                      {post.title}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-relaxed flex-grow"
                      style={{ color: "#a0a0b0" }}
                    >
                      {post.description}
                    </p>
                    <div
                      className="text-sm mt-5 pt-4 flex justify-between"
                      style={{
                        color: "#a0a0b0",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="mt-5 inline-flex items-center gap-1 font-semibold text-sm transition-colors hover:text-[#4d7dff]"
                      style={{ color: "#175aff" }}
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={
                    currentPage === i + 1
                      ? {
                          background: "linear-gradient(135deg, #175aff, #4d7dff)",
                          color: "#ffffff",
                          border: "1px solid transparent",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          color: "#a0a0b0",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
