import { IconCertificate, IconCoin, IconTruck } from '@tabler/icons-react';
import { Container, rem, SimpleGrid, Text } from '@mantine/core';
import classes from './FeaturesAsymmetrical.module.css';

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: React.FC<any>;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description, className, ...others }: FeatureProps) {
  return (
    <div className={classes.feature} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon style={{ width: rem(38), height: rem(38) }} className={classes.icon} stroke={1.5} />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const mockdata = [
  {
    icon: IconTruck,
    title: '我有碳资源',
    description: '树林、太阳能、风电、水电、新能源等CCER碳减排资源',
  },
  {
    icon: IconCertificate,
    title: '收购碳指标',
    description: '我是卖家',
  },
  {
    icon: IconCoin,
    title: '出售碳指标',
    description: '我是买家',
  },
];

export function FeaturesAsymmetrical() {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={100} mb={100} size="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
