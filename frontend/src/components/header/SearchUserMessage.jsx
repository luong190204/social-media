import { useChatStore } from '@/store/useChatStore';
import React from 'react'

const SearchUserMessage = () => {
    const { searchResult, searchUsers, isSearching } = useChatStore();
  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="relative">
        {/* Input Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-full text-sm focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />

          {searchTerm && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleClear}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popup search */}
        {isFocused && (
          <div
            className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl mt-2 z-50 border 
          border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Popular Searches - Hiển thị khi chưa nhập gì */}
            {!searchTerm && (
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                  Gợi ý tìm kiếm
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Tìm kiếm bạn bè
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                    <User className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      Khám phá người dùng mới
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results - Hiển thị khi có nhập */}
            {searchTerm && (
              <div className="max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-3 text-gray-500 text-sm">
                      Đang tìm kiếm...
                    </p>
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
                      Kết quả ({searchResults.length})
                    </p>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-all duration-150 group"
                      >
                        <div className="relative">
                          <img
                            src={user.profilePic || "/assets/avatar.jpg"}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`;
                            }}
                          />

                          {/* TODO: Online indicator - Nếu có trường isOnline */}
                          {/* {user.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )} */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {user.fullName || user.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            @{user.username}
                          </p>
                        </div>
                        <User className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      Không tìm thấy người dùng
                    </p>
                    <p className="text-gray-400 text-sm">
                      Thử tìm kiếm với tên khác
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchUserMessage
