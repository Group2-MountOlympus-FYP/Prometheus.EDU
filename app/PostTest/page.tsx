'use client';

import { useEffect, useState } from 'react';
import { WritingPostPanel } from '@/components/WritingPost/WritingPostPanel';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';

export default function PostTest() {
  const [opened, {open, close}] = useDisclosure(false)
  return(
    <div>
      <WritingPostPanel opened={opened} onClose={close}></WritingPostPanel>
      <Button size='xl' radius={'xl'} onClick={open}>Open to write a post</Button>
    </div>
  )
}