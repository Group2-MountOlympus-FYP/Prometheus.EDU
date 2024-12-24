// src/components/CommentHtml/CommentHtml.tsx

import React, { forwardRef } from 'react';
import { Group, Paper, Text, TypographyStylesProvider } from '@mantine/core';
import classes from './CommentHtml.module.css';

interface CommentHtmlProps {
  textname: string;
  content: string;
  url?: string;
  height?: string | number;
  time?: string;
}

export const CommentHtml = forwardRef<HTMLDivElement, CommentHtmlProps>(
  ({ textname, content, url, height, time }, ref) => (
    <Paper
      ref={ref} // 将 ref 附加到 Paper 组件
      withBorder
      radius="md"
      className={classes.comment}
      component={url ? 'a' : 'div'}
      href={url}
      target="_blank"
      style={{
        cursor: url ? 'pointer' : 'default',
        height: height || 'auto',
        overflow: 'hidden', // 确保溢出内容隐藏
      }}
    >
      <Group>
        <div>
          <Text fz="xl" style={{ fontWeight: 'bold', color: 'teal' }}>
            {textname}
          </Text>
          <Text fz="xs" c="dimmed">
            {time}
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body} ref={ref} style={{ color:'grey' }}>
        {content}
      </TypographyStylesProvider>
    </Paper>
  )
);
