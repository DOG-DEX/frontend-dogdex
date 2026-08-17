"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";

type Post = {
  id: string;
  author: string;
  breed: string;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
};

export function CommunityView() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      author: "Duong Van",
      breed: "Golden Retriever",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      caption: "Mochi enjoying the afternoon sunshine at West Lake! Wearing his new Smart QR Collar 💚",
      likes: 24,
      commentsCount: 3,
      timeAgo: "2 hours ago",
    },
    {
      id: "post-2",
      author: "Linh Tran",
      breed: "Shiba Inu",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      caption: "Kuro's favorite spot in the living room 🐕",
      likes: 42,
      commentsCount: 7,
      timeAgo: "5 hours ago",
    },
  ]);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    toast.success("LIKED POST", "Added your love to this cún!");
  };

  return (
    <div className="min-h-screen bg-[#F0EDE6] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 rounded-[2.5rem] border-4 border-[#232B26] bg-[#232B26] p-8 text-white shadow-[8px_8px_0px_#232B26]">
          <span className="font-mono text-xs font-black uppercase text-[#85E0C0]">
            DOGDEX COMMUNITY FEED
          </span>
          <h1 className="mt-1 text-3xl md:text-5xl font-black tracking-tight">
            CỘNG ĐỒNG CÚN CƯNG
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Share cute photos, stories, and recommendations with fellow dog owners across Vietnam!
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-[2rem] border-4 border-[#232B26] bg-white p-6 shadow-[8px_8px_0px_#232B26]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#232B26]/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border-2 border-[#232B26] bg-[#FFD6A5] grid place-items-center font-mono font-black text-sm">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#232B26]">{post.author}</h3>
                    <p className="font-mono text-[10px] text-[#232B26]/60">{post.timeAgo}</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#232B26] bg-[#85E0C0] px-3 py-0.5 font-mono text-[10px] font-black text-[#232B26]">
                  {post.breed}
                </span>
              </div>

              <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#232B26] bg-[#F0EDE6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imageUrl} alt={post.caption} className="h-full w-full object-cover" />
              </div>

              <p className="mt-4 text-sm font-medium text-[#232B26]">{post.caption}</p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#232B26]/10">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 rounded-xl border-2 border-[#232B26] bg-[#F0EDE6] px-4 py-2 font-mono text-xs font-black text-[#232B26] transition hover:bg-[#85E0C0]"
                >
                  <span>❤️ {post.likes} Likes</span>
                </button>

                <span className="font-mono text-xs font-bold text-[#232B26]/60">
                  💬 {post.commentsCount} Comments
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
