import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useCommentStore } from '@/store/useCommentStore ';
import CommentList from './CommentList';

const CommentDialog = ({ post, open, onClose }) => {

    const { commentsByPost, isCommentPostLoading, fetchCommentByPost } =
      useCommentStore();
    const [mediaUrls, setMediaUrls] = useState(post?.mediaUrls || "");
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [input, setInput] = useState("");

    const nextMedia = () => {
        if (currentMediaIndex < mediaUrls.length - 1) {
            setCurrentMediaIndex(currentMediaIndex + 1);
        }
    }   

    const prevMedia = () => {
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(currentMediaIndex - 1);
        }
    }  

    useEffect(() => {
      fetchCommentByPost(post.id);
    }, [post.id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 flex h-[85vh]">
        {/* left */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          {mediaUrls.length > 0 && (
            <>
              <div className="relative w-full h-full flex items-center justify-center">
                {mediaUrls[currentMediaIndex]?.endsWith(".mp4") ? (
                  <video
                    src={mediaUrls[currentMediaIndex]}
                    controls
                    className="max-w-full max-h-full object-contain"
                    key={currentMediaIndex}
                  />
                ) : (
                  <img
                    src={mediaUrls[currentMediaIndex]}
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                {mediaUrls.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        type="button"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                        onClick={prevMedia}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    {currentMediaIndex < mediaUrls.length - 1 && (
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                        onClick={nextMedia}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}

                {mediaUrls.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentMediaIndex + 1} / {mediaUrls.length}
                  </div>
                )}

                {mediaUrls.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                    {mediaUrls.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                          currentMediaIndex === index
                            ? "border-white"
                            : "border-transparent opacity-60"
                        }`}
                        onClick={() => setCurrentMediaIndex(index)}
                      >
                        {url.endsWith(".mp4") ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* right */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center gap-2 border-b p-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post?.author?.profilePic} />
              <AvatarFallback>{post?.author?.username?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm pl-1">
              {post?.author?.username}
            </span>
          </div>

          <div className="p-3 border-b">
            <p>{post?.content}</p>
          </div>

          {/* comment list */}
          <CommentList comments={commentsByPost[post.id] || []}/>

          <div className="border-t flex items-center p-3 gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Viết bình luận..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              Gửi
            </Button>
            <button onClick={() => console.log("comment: ", comments)
            }>
              CLick
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog
