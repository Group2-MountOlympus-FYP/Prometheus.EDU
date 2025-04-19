// components/CommentThread.tsx
import {Paper, Stack} from '@mantine/core';
import { Comment } from '@/app/post/[post_id]/Components/Comment';
import classes from "@/app/post/[post_id]/Components/CommentHtml.module.css";

interface CommentThreadProps {
    comments: any[];                            // ← 维持原来的 any，或换成你的 CommentType
    onReplyAdded: (c: any) => void;             // 向上回调
    depth?: number;                             // 递归层级，用来控制缩进
}

export function CommentThread({
                                  comments,
                                  onReplyAdded,
                                  depth = 0,
                              }: CommentThreadProps) {
    return (
        <Stack pl={depth * 20 /* px */}  pt='5' gap={Math.max(20-depth*10,0)}>
            {comments.map((comment,index) => (
                <div key={comment.id}>
                    {/* 渲染当前这条评论 */}
                    <Paper withBorder radius="md" className={classes.comment}>
                    <Comment author_id={comment.author} created_at={comment.created_at} content={comment.content} id={comment.id} key={index} onReplyAdded={onReplyAdded}></Comment>

                    {/* 如果还有子评论，递归渲染 */}
                    {comment.children?.length > 0 && (
                        <CommentThread
                            comments={comment.children}
                            onReplyAdded={onReplyAdded}
                            depth={depth + 1}
                        />
                    )}
                    </Paper>
                </div>
            ))}
        </Stack>
    );
}