package com.social.socialmedia.repository;

import com.social.socialmedia.entity.Comment;
import com.social.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface CommentPostRepository extends MongoRepository<Comment, String> {
    Page<Comment> findByPostIdAndParentId(String postId, String parentId, Pageable pageable);
    Page<Comment> findByParentId(String parentId);

    // New methods needed
    // 1. Lấy top 3 replies cho nhiều parents cùng lúc
    @Query("{ 'parentId': { $in: ?0 } }")
    List<Comment> findByParentIdIn(List<String> parentIds, Sort sort);

    default List<Comment> findTop3RepliesByParentIds(List<String> parentIds) {
        return findByParentIdIn(parentIds, Sort.by(Sort.Direction.ASC, "createdAt"))
                .stream()
                .collect(Collectors.groupingBy(Comment::getParentId))
                .values()
                .stream()
                .flatMap(replies -> replies.stream().limit(3))
                .toList();
    }

    // 2. Cursor-based phân trang cho cuộn vô hạn
    @Query("{ 'parentId': ?0, 'createdAt': { $lt: ?1 } }")
    List<Comment> findByParentIdAndCreatedAtBefore  (String parentId, Instant cursor, Pageable pageable);

    // 3. Count replies
    Long countByParentId(String parentId);

    // 4. Batch lấy users
    @Query("{ '_id': { $in: ?0 } }")
    List<User> findByIdIn(Set<String> userIds);
}
