'use client';

import { useState } from 'react'; // 导入 useState 钩子
import { IconCookie, IconGauge, IconUser } from '@tabler/icons-react';
import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  rem,
  Text,
  Flex,
  useMantineTheme,
} from '@mantine/core';
import { GetInTouch } from '../GetInTouch/GetInTouch';
import classes from './FeaturesCards.module.css';

const mockdata = [
  {
    title: '简介',
    description: 'CarbonElla提供碳资产交易全流程服务，建立控排企业集成化社群，搭建低碳绿色业务一站式服务平台',
    icon: IconGauge,
    buttons: [],
  },
  {
    title: '碳交易市场',
    description: '集国内外最有实力的买家/卖家让您易碳无忧',
    icon: IconCookie,
    buttons: ['预约买碳', '预约卖碳'],
  },
  {
    title: '碳交易指标',
    description: '量化您的绿色贡献，优化碳资产管理',
    icon: IconUser,
    buttons: ['收购碳指标', '出售碳指标'],
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false); // 控制弹窗的状态

  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl" mb="xl" style={{ width: '650px' }}>
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.teal[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
      <Group mt="md" className="buttonStyle">
        {feature.buttons.map((buttonText) => (
          <Button
            key={buttonText}
            variant="outline"
            color="teal"
            className="buttonStyle"
            onClick={() => setModalOpened(true)} // 点击按钮时打开弹窗
          >
            {buttonText}
          </Button>
        ))}
      </Group>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Flex direction="column" align="center">
        {features}
      </Flex>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)} // 关闭弹窗
      >
        <GetInTouch></GetInTouch>
      </Modal>
    </Container>
  );
}
