'use client';
import { Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { CommentThread } from './CommentThread';
import {Comment} from "@/app/post/[post_id]/Components/Comment";
import {getText} from "@/components/CookieConsent/language";


/**
 * 把 newComment 插入 comments 树的正确层级，并放到该层 children 数组最前面
 * newComment.parent_id == null 表示顶层评论
 */
function insertCommentFront(
    comments: any[],
    newComment: any,
    postId: number
): any {
    // 顶层追加（放最前面）
    if (newComment.parent_target == postId) {
        return [newComment, ...comments];
    }

    // 否则递归查找 parent
    return comments.map((c) => {
        if (c.id === newComment.parent_target) {
            // 找到父节点：把新评论插到 children 最前
            return { ...c, children: [newComment, ...c.children] };
        }
        // 递归向下找
        return { ...c, children: insertCommentFront(c.children, newComment, postId) };
    });
}

export default function CommentWriteButton({ post }: { post: any }) {
    const [comments, setComments] = useState(post.children || []);

    const handleCommentAdded = (newComment: any) => {
        setComments((prev:any) => insertCommentFront(prev, newComment,post.id)); // 👈
    };

    return (
        <Stack>
            <Comment author_id={post.author} created_at={post.created_at} content={post.content} id={post.id} key={0} onReplyAdded={handleCommentAdded}></Comment>
            <Text fw={500}>{getText("comment")}</Text>

            <CommentThread
                comments={comments}
                onReplyAdded={handleCommentAdded}
            />
        </Stack>
    );
}