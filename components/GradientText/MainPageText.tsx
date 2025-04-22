import { Text } from '@mantine/core';

interface GradientTextProps {
  children: React.ReactNode;
  size?: string;
  weight?: number;
  from?: string;
  to?: string;
  deg?: number;
}

export function GradientText({
  children,
  size = '2.5vw',
  weight = 900,
  from = 'rgba(254, 111, 78, 1)',
  to = 'rgba(225, 218, 101, 1)',
  deg = 120,
}: GradientTextProps) {
  return (
    <Text
      size={size}
      fw={weight}
      variant="gradient"
      gradient={{ from, to, deg }}
      lh={1.4}
    >
      {children}
    </Text>
  );
}
