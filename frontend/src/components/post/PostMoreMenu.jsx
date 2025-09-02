import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import UpdatePostForm from './UpdatePostForm ';

const PostMoreMenu = ({ post, isOpen, onClose, onDelete }) => {
    const [openUpdate, setOpenUpdate] = useState(false);

    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
        return () => {
          document.body.style.overflow = "";
        };
    }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={onClose} className="absolute inset-0 bg-black/50"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-white w-80 rounded-2xl overflow-hidden shadow-lg z-50"
          >
            <button
              onClick={onDelete}
              className="w-full py-4 text-red-500 font-semibold border-b hover:bg-gray-50"
            >
              Xóa bài viết
            </button>

            <div>
              <button
                onClick={() => {
                  setOpenUpdate(true);
                }}
                className="w-full py-4 font-semibold border-b hover:bg-gray-50"
              >
                Chỉnh sửa
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 font-semibold hover:bg-gray-50"
            >
              Hủy
            </button>
          </motion.div>
        </div>
      )}

      {openUpdate && 
        <UpdatePostForm post={post} onClose={() => setOpenUpdate(false)}/>}
    </AnimatePresence>
  );
}

export default PostMoreMenu
