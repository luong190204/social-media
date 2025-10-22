import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useCommentStore } from '@/store/useCommentStore ';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

const CommentDialog = ({ post, open, onClose }) => {

    const { commentsByPost } = useCommentStore();

    
    const [mediaUrls, setMediaUrls] = useState(post?.mediaUrls || "");
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [editingComment, setEditingComment] = useState(null);
    const [replyTo, setReplyTo] = useState(null); 

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
    
    

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 flex h-[85vh]">
        {/* left */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          {mediaUrls.length > 0 && (
            <>
              <div className="relative w-full -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-950">
                <div className="relative w-full">
                  {post.mediaUrls[currentMediaIndex].match(
                    /\.(mp4|webm|ogg)$/i
                  ) ? (
                    <video
                      src={post.mediaUrls[currentMediaIndex]}
                      controls
                      className="w-full h-auto max-h-[600px] object-contain"
                      style={{ aspectRatio: "auto" }}
                    />
                  ) : (
                    <img
                      src={post.mediaUrls[currentMediaIndex]}
                      alt={`post-media-${currentMediaIndex}`}
                      className="w-full h-auto max-h-[600px] object-contain"
                      style={{ aspectRatio: "auto" }}
                    />
                  )}
                </div>

                {mediaUrls.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        onClick={prevMedia}
                        className="absolute top-1/2 left-3 -translate-y-1/2 group"
                        aria-label="Previous image"
                      >
                        <div className="p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:scale-110">
                          <ChevronLeft />
                        </div>
                      </button>
                    )}

                    {currentMediaIndex < post.mediaUrls.length - 1 && (
                      <button
                        onClick={nextMedia}
                        className="absolute top-1/2 right-3 -translate-y-1/2 group"
                        aria-label="Next image"
                      >
                        <div className="p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:scale-110">
                          <ChevronRight />
                        </div>
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
        <div className="w-1/2 flex flex-col border-l border-gray-300">
          <div className="flex items-center gap-2 border-b pt-3 px-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post?.author?.profilePic} />
              <AvatarFallback>{post?.author?.username?.[0]}</AvatarFallback>
            </Avatar>

            <span className="font-semibold text-sm pl-1">
              {post?.author?.username}
            </span>
            <div className="text-gray-500 text-xs pt-1">
              <span className="text-gray-500 mx-1 pr-1">•</span>
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
          </div>

          <div className="p-3 border-b">
            <p>{post?.content}</p>
          </div>

          {/* comment list */}
          <CommentList
            comments={commentsByPost?.[post.id] || []}
            post={post}
            onEditComment={(c) => setEditingComment(c)}
            setReplyTo={setReplyTo}
          />

          <CommentInput
            postId={post.id}
            editingComment={editingComment}
            onSubmitSuccess={() => setEditingComment(null)}
            replyTo={replyTo}
            onClearReply={() => setReplyTo(null)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog
