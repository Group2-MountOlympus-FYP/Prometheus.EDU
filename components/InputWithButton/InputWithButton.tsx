'use client';

import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, rem, TextInput, TextInputProps, useMantineTheme } from '@mantine/core';

export function InputWithButton(props: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      radius="xl"
      size="md"
      placeholder="Search questions"
      rightSectionWidth={42}
      leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
      rightSection={
        <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
          <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      }
      style={{ margin: '30px' }}
      {...props}
    />
  );
}
