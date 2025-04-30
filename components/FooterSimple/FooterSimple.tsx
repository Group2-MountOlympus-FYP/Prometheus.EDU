'use client';

import { Anchor, Container, Group, Text } from '@mantine/core';
import classes from './FooterSimple.module.css';

export function FooterSimple() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div style={{ textAlign: 'center' }}>
          <Text c="dimmed" size="sm">
            MountOlympus Software © 2025. All rights reserved.
          </Text>
          <Group className={classes.links} justify="center" gap="xs">
            <Text c="dimmed" size="sm">
              Address: Beijing University of Technology, Pingleyuan 1, Chaoyang District, Beijing
            </Text>
            <Anchor<'a'>
              c="dimmed"
              size="sm"
              href="mailto:yuxin.tian@ucdconnect.ie"
            >
              Email: yuxin.tian@ucdconnect.ie
            </Anchor>
          </Group>
        </div>
      </Container>
    </footer>
  );
}

