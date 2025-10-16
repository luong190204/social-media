
import PostCard from '@/components/post/PortCard';
import { useFeedStore } from '@/store/useFeedStore';
import React, { useEffect } from 'react'

const FeedPage = () => {

    const { feedPosts, fetchFeedPosts } = useFeedStore();

    useEffect(() => {
        fetchFeedPosts();
    }, [])

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-2xl mx-auto">
        {feedPosts.map((post) => (
            <PostCard key={post.id} post={post}/>
        ))}
      </div>
    </div>
  );
}

export default FeedPage
