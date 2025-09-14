import { motion, AnimatePresence } from "framer-motion";
import React from 'react'

const CommentMoreMenu = ({ isOpen, onClose, onEdit, canEdit, onDelete }) => {
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
              onClick={() => {}}
              className="w-full py-4 text-red-500 font-semibold border-b hover:bg-gray-50"
            >
              Xóa bình luận
            </button>

            {canEdit && (
              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="w-full py-4 font-semibold border-b hover:bg-gray-50"
              >
                Chỉnh sửa
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-4 font-semibold hover:bg-gray-50"
            >
              Hủy
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommentMoreMenu
