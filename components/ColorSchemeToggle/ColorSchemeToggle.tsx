'use client';

import { Button, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      <Button variant="filled" color="teal" onClick={() => setColorScheme('light')}>Light</Button>
      <Button variant="filled" color="teal" onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button variant="filled" color="teal" onClick={() => setColorScheme('auto')}>Auto</Button>
    </Group>
  );
}
