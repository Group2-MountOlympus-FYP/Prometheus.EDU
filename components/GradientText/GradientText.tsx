import { Text } from '@mantine/core';

export function GradientText() {
  return (
    <Text
      size="2.5vw"
      fw={900}
      variant="gradient"
      gradient={{ from: 'rgba(254, 111, 78, 1)', to: 'rgba(225, 218, 101, 1)', deg: 120 }}
    >
      Education
    </Text>
  );
}