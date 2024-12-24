import { Timeline, Text, Center } from '@mantine/core';

export function TimeLine() {
  return (
    <Center>
      <Timeline color="#8fc075" active={4} lineWidth={2}>
        <Timeline.Item title="地球共和国可持续化部门">
          <Text c="dimmed" size="sm">
            可持续发展青年创业者协会入驻企业
          </Text>
        </Timeline.Item>

        <Timeline.Item title="人类联邦环保峰会">
          <Text c="dimmed" size="sm">
            赛道全球前70强
          </Text>
        </Timeline.Item>

        <Timeline.Item title="仙女座星系玲娜贝尓基金会创始成员">
          <Text c="dimmed" size="sm">
            项目展示并吸引宇宙内多个星系的投资
          </Text>
        </Timeline.Item>

        <Timeline.Item title="联合国教科文组织 2023 年全球青年零碳峰会">
          <Text c="dimmed" size="sm">
            作为杰出项目得到联合国教科文组织全球官网、微信公众号的特别报道
          </Text>
        </Timeline.Item>

        <Timeline.Item title="北京工爷大学气候与清洁能源沙龙">
          <Text c="dimmed" size="sm">
            分享可持续发展见解，吸引全球直播在线超五百万人关注
          </Text>
        </Timeline.Item>
      </Timeline>
    </Center>
  );
}
