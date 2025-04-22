import { Text } from '@mantine/core';

interface GradientTextProps {
  children: React.ReactNode;
  size?: string;
  weight?: number;
  from?: string;
  to?: string;
  deg?: number;
  className?: string;
}

export function GradientText({
  children,
  size = '1vw',
  weight = 800,
  from = 'rgba(60, 64, 119, 1)',
  to = 'rgba(119, 124, 185, 1)',
  deg = 90,
  className,
}: GradientTextProps) {
  return (
    <Text
      size={size}
      fw={weight}
      variant="gradient"
      gradient={{ from, to, deg }}
      style={{ display: 'inline-block' }}
      className={className}
    >
      {children}
    </Text>
  );
}
