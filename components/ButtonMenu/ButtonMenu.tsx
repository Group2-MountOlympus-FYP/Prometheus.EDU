'use client';

import { IconCalendar, IconChevronDown, IconPackage } from '@tabler/icons-react';
import { Button, Menu, rem, Text, useMantineTheme } from '@mantine/core';

export function ButtonMenu() {
  const theme = useMantineTheme();
  return (
    <Menu
      transitionProps={{ transition: 'pop-top-right' }}
      position="top-end"
      width={220}
      withinPortal
    >
      <Menu.Target>
        <Button
          rightSection={
            <IconChevronDown style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          }
          pr={12}
        >
          Create new
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconPackage
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.blue[6]}
              stroke={1.5}
            />
          }
          rightSection={
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              Ctrl + P
            </Text>
          }
        >
          Project
        </Menu.Item>

        <Menu.Item
          leftSection={
            <IconCalendar
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.violet[6]}
              stroke={1.5}
            />
          }
          rightSection={
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              Ctrl + E
            </Text>
          }
        >
          Event
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
