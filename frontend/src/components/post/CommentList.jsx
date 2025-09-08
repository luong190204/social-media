import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { usePostStore } from '@/store/usePostStore';

const CommentList = ({ comments }) => {

  const { repliesByComment, fetchRepliesByComment } = usePostStore();
  
  const [openReplies, setOpenReplies] = useState({});

  const handleViewReplies = (commentId) => {
    const isOpen = openReplies[commentId];

    console.log(
      `Handling replies for comment ${commentId}, currently open: ${isOpen}`
    );

    if (!isOpen) {
      fetchRepliesByComment(commentId);
    }

    setOpenReplies((prev) => ({
      ...prev, [commentId]: !isOpen,
    }));
  }

  useEffect(() => {
    console.log("RepliesByComment updated:", repliesByComment);
  }, [repliesByComment]);

  if (!comments || comments.length === 0) {
    return (
      <div className="flex-1 p-3">
        <p className="text-gray-500 text-center">No comments yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-3 space-y-4 overflow-y-auto">
      {comments.map((cmt) => {
        const repliesData = repliesByComment?.[cmt.id];
        const replies = repliesData?.items || [];
        const totalReplies = repliesData?.total || 0;

        const showReplies = openReplies[cmt.id] || false;

        console.log(
          `Comment ${cmt.id}: totalReplies=${totalReplies}, showReplies=${showReplies}, replies.length=${replies.length}`
        );

        return (
          <div key={cmt.id} className="flex items-start space-x-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={cmt.authorAvatar} alt={cmt.authorName} />
              <AvatarFallback>{cmt.authorName[0]}</AvatarFallback>
            </Avatar>
            <button onClick={() => console.log("replies: ", repliesByComment)}>
              Click
            </button>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold mr-2">{cmt.authorName}</span>
                {cmt.content}
              </p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>
                  {formatDistanceToNow(new Date(cmt.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
                <button className="font-medium hover:underline">Reply</button>
              </div>

              {totalReplies > 0 && (
                <div className="ml-2 flex items-center space-x-2">
                  <div className="w-6 h-px bg-gray-300"></div>
                  <button
                    className="text-xs text-gray-500 py-2 hover:text-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleViewReplies(cmt.id)}
                  >
                    {showReplies[cmt.id]
                      ? "Ẩn câu trả lời"
                      : `Xem ${totalReplies} câu trả lời`}
                  </button>
                </div>
              )}
            </div>

            {showReplies && (
              <div className="ml-10 mt-2">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-2 mb-1">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={reply.authorAvatar}
                        alt={reply.authorName}
                      />
                      <AvatarFallback>{reply.authorName[0]}</AvatarFallback>
                    </Avatar>

                    <div>
                      <span className="font-semibold">{reply.authorName}</span>{" "}
                      {reply.content}
                      <div className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </ScrollArea>
  );
}

export default CommentList
