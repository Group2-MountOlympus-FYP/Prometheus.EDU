import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '50px',
        }}
      >
        <img
          src="/carbon-ella-logo.png"
          alt="CarbonElla Logo"
          style={{
            width: '115px',
            height: 'auto',
            marginRight: '20px',
          }}
        />
        <Title className={classes.title} ta="center">
          <Text inherit variant="gradient" component="span" gradient={{ from: 'green', to: 'blue' }}>
            CarbonElla
          </Text>
        </Title>
      </div>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        —— Building a better future for all ——
      </Text>
    </>
  );
}
