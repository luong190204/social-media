import React, { useState } from 'react'
import { Button } from '../ui/button';

const LikeButton = ({ postId, initialLiked, initialCount, onToggle }) => {

    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);

    const handleClick = async () => {

        const nextLiked = !liked;
        const nextCount = nextLiked ? count + 1 : count - 1;

        setLiked(nextLiked);
        setCount(nextCount);
        
        try {
            
            if (onToggle) {
                await onToggle({
                  postId,
                  liked: nextLiked,
                  count: nextCount,
                });
            }
        } catch (error) {
          // rollback nếu API fail
          setLiked(liked);
          setCount(count);
        }
    }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleClick}
        variant="ghost"
        className={`flex items-center gap-1 border-none [&_svg]:!w-6 [&_svg]:!h-6 px-0 py-0 ${
          liked ? "text-red-500" : "text-gray-600 "
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-6 h-6 transition-colors duration-200"
          fill={liked ? "red" : "none"}
          stroke={liked ? "red" : "currentColor"}
          strokeWidth="2"
        >
          <title>Like</title>
          <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z" />
        </svg>
      </Button>
      <span className="text-sm text-gray-600">{count}</span>
    </div>
  );
};

export default LikeButton
