import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useCommentStore } from '@/store/useCommentStore ';
import { Loader, Loader2 } from 'lucide-react';

const CommentList = ({ postId, comments }) => {

  const {
    repliesByComment,
    fetchCommentByPost,
    fetchRepliesByComment,
    isRepliesLoading,
    isCommentLoading,
  } = useCommentStore();
  
  const [openReplies, setOpenReplies] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchCommentByPost(postId, 0).then((res) => {
      setTotalPages(res.totalPages);
    });
  }, [postId]);

  const handleViewReplies = (commentId) => {
    const isOpen = openReplies[commentId];

    if (!isOpen) {
      fetchRepliesByComment(commentId);
    }

    setOpenReplies((prev) => ({
      ...prev, [commentId]: !isOpen,
    }));
  }

  const handleLoadMore = () => {
    if (page + 1 < totalPages) {
      const nextPage = page + 1;
      fetchCommentByPost(postId, nextPage).then((res) => {
        setPage(nextPage);
      });
    }
  }

  if (isCommentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  

  return (
    <ScrollArea className="flex-1 p-4 space-y-4 overflow-y-auto">
      {comments?.map((cmt) => {
        const repliesData = repliesByComment?.[cmt.id];
        const replies = repliesData?.items || [];

        const totalReplies = cmt.countReplies || 0;

        const showReplies = openReplies[cmt.id] || false;

        return (
          <div key={cmt.id} className="space-y-2">
            <div className="flex items-start space-x-3 space-y-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={cmt.authorAvatar} alt={cmt.authorName} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
                  {cmt.authorName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {cmt.authorName}
                  </span>
                  <span className="text-sm text-gray-800 break-words">
                    {cmt.content}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(cmt.createdAt), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </span>
                  <button className="text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors">
                    Phản hồi
                  </button>
                </div>

                {totalReplies > 0 && (
                  <button
                    className="flex items-center space-x-2 mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => handleViewReplies(cmt.id)}
                  >
                    <div className="w-6 h-px bg-gray-300"></div>
                    <span className="font-medium">
                      {showReplies
                        ? "Ẩn câu trả lời"
                        : `Xem ${totalReplies} câu trả lời`}
                    </span>
                    {isRepliesLoading ? (
                      <>
                        <Loader className="size-5 animate-spin" />
                      </>
                    ) : (
                      ""
                    )}
                  </button>
                )}
              </div>
            </div>

            {showReplies && replies.length > 0 && (
              <div className="ml-11 space-y-2">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-3">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage
                        src={reply.authorAvatar}
                        alt={reply.authorName}
                      />
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs font-medium">
                        {reply.authorName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-sm text-gray-900">
                          {reply.authorName}
                        </span>
                        <span className="text-sm text-gray-800 break-words">
                          {reply.content}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                        <button className="text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors">
                          Phản hồi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {page + 1 < totalPages && (
        <button
          onClick={handleLoadMore}
          className="text-blue-500 hover:underline mt-2"
        >
          + Xem thêm
        </button>
      )}
    </ScrollArea>
  );
}

export default CommentList
