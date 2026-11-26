import { useState } from "react";
import { Outlet } from "react-router-dom";

interface LocationInfoLayoutProps {
  title?: string;
  imageUrl?: string;
}

interface CommentItem {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

// Direct CDN image URL (Unsplash webpage URLs won't render inside <img> tags)
const FALLBACK_IMAGE =
  "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8";

export function LocationInfoLayout({
  title,
  imageUrl,
}: LocationInfoLayoutProps) {
  const imageSrc = imageUrl || FALLBACK_IMAGE;
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const imgSrc = failedImageSrc === imageSrc ? FALLBACK_IMAGE : imageSrc;
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      author: "Sam K.",
      text: "Checked water quality before swimming—super clear today!",
      timestamp: "2 hours ago",
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments([
      {
        id: Date.now(),
        author: "Visitor",
        text: commentInput.trim(),
        timestamp: "Just now",
      },
      ...comments,
    ]);
    setCommentInput("");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. HERO IMAGE + TITLE OVERLAY */}
        <section className="relative w-full h-72 md:h-80 overflow-hidden rounded-2xl shadow-md bg-slate-200">
          <img
            src={imgSrc}
            alt={title}
            onError={() => {
              if (imgSrc !== FALLBACK_IMAGE) setFailedImageSrc(imageSrc);
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-left">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold uppercase tracking-wider text-sky-100 bg-sky-600/80 backdrop-blur-sm rounded-full">
              Water Quality & Location
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {title}
            </h1>
          </div>
        </section>

        {/* 2. INFO SECTION (Nested BeachInfoPage Route) */}
        <section className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 text-left">
          <Outlet />
        </section>

        {/* 3. COMMENTS SECTION */}
        <section className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Visitor Updates & Comments
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {comments.length} {comments.length === 1 ? "post" : "posts"}
            </span>
          </div>

          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Share water conditions or a quick update about ${title}...`}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
              >
                Post Update
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3.5 p-4 bg-slate-50/70 border border-slate-100 rounded-xl"
              >
                {/* Initials Avatar */}
                <div className="shrink-0 w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {comment.author}
                    </p>
                    <span className="text-xs text-slate-400">
                      • {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
