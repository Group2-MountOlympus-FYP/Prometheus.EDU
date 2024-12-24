'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Container, Grid, rem, SimpleGrid, Skeleton } from '@mantine/core';
import { CommentHtml } from '@/components/CommentHtml/CommentHtml';
import { Item } from '@/types/interfaces';

// 1. Define the Item interface

interface LeadGridProps {
  items: Item[];
  loadingMore: boolean;
  end: boolean;
  fetchMoreItems: () => void;
}

const PRIMARY_COL_HEIGHT = rem(300);
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

export function LeadGrid({ items, loadingMore, end, fetchMoreItems }: LeadGridProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (end) {
      // 如果已经到达末尾，不需要再设置观察者
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreItems();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMoreItems, end]);
  // Hook to detect when the observer target is in view
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  // Effect to load more data when the observer target comes into view
  useEffect(() => {
    if (inView && !loadingMore && !end) {
      fetchMoreItems();
    }
  }, [inView, loadingMore, fetchMoreItems, end]);

  return (
    <Container my="md">
      <SimpleGrid cols={1} spacing="md">
        {/* Render the loaded items */}
        {items.map((item) => (
          <Grid key={item.id} gutter="md">
            <Grid.Col>
              {' '}
              {/* 占据整行 */}
              <CommentHtml
                textname={item.chinesename.replace(/_compressed\.pdf$/, '')}
                content={item.description}
                url={"/pdf/" + item.chinesename}
              />
            </Grid.Col>
          </Grid>
        ))}
        {/* Display skeleton placeholders while loading more data */}
        {!end && loadingMore &&
          Array.from({ length: 7 }).map((_, index) => (
            <Grid key={`placeholder-${index}`} gutter="md">
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
              <Grid.Col>
                <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
              </Grid.Col>
            </Grid>
          ))}

        {/* Intersection Observer target */}
        <div ref={ref} style={{ height: 1 }} />
      </SimpleGrid>
    </Container>
  );
}
