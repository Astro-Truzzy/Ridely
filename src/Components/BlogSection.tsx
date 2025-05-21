// BlogSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Simulated blog data
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
      "Our team showcased the Ridely platform at the Techstars Hackathon...",
    image: "/images/Techstars1.jpg",
    author: "Trust Williams",
    date: "May 10, 2025",
  },
  {
    id: 2,
    title: "Building Ridely in 3 Hours",
    description:
      "The journey to build a working version of Ridely in under two days...",
    image: "/images/Techstars2.jpg",
    author: "Precious Obi",
    date: "May 11, 2025",
  },
  {
    id: 3,
    title: "Teamwork That Delivered",
    description:
      "At the heart of our Hackathon success was a team that communicated...",
    image: "/images/Techstars3.jpg",
    author: "Ridely Team",
    date: "May 12, 2025",
  },
  // Add more posts as needed
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
    }, 800); // simulate delay

    return () => clearTimeout(timeout);
  }, [currentPage]);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50 text-black" id="Blogs">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Ridely <span className="text-[#175aff]"> Blog </span>
        </h2>
        <p className="text-gray-600 mt-2">
          Stories, milestones, and moments from our journey.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {paginatedPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[#175aff]">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm flex-grow">
                    {post.description}
                  </p>
                  <div className="text-sm text-gray-500 mt-4">
                    <p>By {post.author}</p>
                    <p>{post.date}</p>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-4 inline-block text-blue-600 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                } hover:bg-blue-600 hover:text-white transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default BlogSection;
