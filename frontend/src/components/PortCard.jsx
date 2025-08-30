import React from 'react'
import { Button } from './ui/button'
import { Heart, MessageCircle } from 'lucide-react'

const PortCard = ({ post }) => {
  return (
    <div className='bg-white shadow rounded-2xl p-4 mb-6'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-3'>
            <img 
                src={post.author?.profilePic} 
                alt="avatar"
                className='w-10 h-10 rounded-full object-cover' 
            />
            <span className='font-semibold'>{post.author?.username}</span>
        </div>

        {/* Content */}
        {post.content && <p className='mb-3'>{post.content}</p>}

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className='space-y-3 mb-3'>
                {post.mediaUrls.map((url, index) => (
                    <img 
                        key={index}
                        src={url} 
                        alt={`post-media-${index}`}
                        className="w-full rounded-xl"
                    />
                ))}
            </div>
        )}

        {/* Footer */}
        <div className='flex items-center gap-6 text-gray-600'>
            <Button className="flex items-center gap-1 hover:text-red-500">
                <Heart size={20}/>
            </Button>
            <Button className="flex items-center gap-1 hover:text-blue-500">
                <MessageCircle size={20} /> 0
            </Button>
        </div>
    </div>
  )
}

export default PortCard
