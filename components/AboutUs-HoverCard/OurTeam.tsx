import { Divider, Flex, Text, rem, Center } from '@mantine/core';
import { IconDeviceImac, IconSchool, IconDatabaseSearch } from '@tabler/icons-react';

export function Team() {
  return (
    <Center >
      <Flex justify="center" align="center" gap="xl">
        {/* 第一个内容块 */}
        <Flex direction="column" align="center" gap="xs" style={{ textAlign: 'center' }}>
          <IconDatabaseSearch style={{width: '50px', height:'50px', color:'#8fc075' }}  />
          <h3>
            全流程业务经验团队
          </h3>
          <Text style={{fontSize: '16px',color: '#616161'}}>
            业务团队深耕碳市场，从政策研究到企业实践全流程覆盖
          </Text>
        </Flex>
        <Divider orientation="vertical" />
        <Flex direction="column" align="center" gap="xs" style={{ textAlign: 'center' }}>
          <IconDeviceImac style={{width: '50px', height:'50px', color:'#8fc075' }}  />
          <h3>
            信息技术与 AI 支持
          </h3>
          <Text style={{fontSize: '16px',color: '#616161'}}>
            技术团队专注碳市场数字化与智能化
          </Text>
        </Flex>

        <Divider orientation="vertical" />

    

        {/* 第三个内容块 */}
        <Flex direction="column" align="center" gap="xs" style={{ textAlign: 'center' }}>
          <IconSchool style={{width: '50px', height:'50px', color:'#8fc075' }} />
          <h3>
            复合专业背景
          </h3>
          <Text style={{fontSize: '16px',color: '#616161'}}>
            拥有国际化教育背景，覆盖经济金融、环境科学与政策领域
          </Text>
        </Flex>
      </Flex>
    </Center>
  );
}
