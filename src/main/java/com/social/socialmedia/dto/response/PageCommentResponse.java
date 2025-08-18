package com.social.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageCommentResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    public static <T> PageCommentResponse<T> empty() {
        return PageCommentResponse.<T>builder()
                .content(Collections.emptyList())
                .page(0).size(0).totalElements(0).totalPages(0)
                .hasNext(false).hasPrevious(false)
                .build();
    }
}
