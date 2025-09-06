import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CommentList = ({ comments }) => {
  return (
    <ScrollArea className="flex-1 p-3 space-y-4">
      {comments.map((cmt) => (
        <div key={cmt.id} className="flex items-start space-x-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={cmt.authorAvatar} alt={cmt.authorName} />
            <AvatarFallback>{cmt.authorName[0]}</AvatarFallback>
          </Avatar>

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

            {cmt.replies && c.replies.length > 0 && (
              <div className="mt-2 pl-6 space-y-2 border-1 border-gray-200">
                {cmt.replies.map((r) => (
                  <div key={r.id} className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={r.authorAvatar} alt={r.authorName} />
                      <AvatarFallback>{r.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm">
                      <span className="font-semibold mr-2">{r.authorName}</span>
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}

export default CommentList
