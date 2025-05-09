'use client';

import React from 'react';
import { Title, List, Anchor, Text } from '@mantine/core';
import { getText } from './language'; //  引入多语言方法

interface Resource {
  id: number;
  lecture: number;
  name: string;
  url: string;
}

interface LectureDataWithResources {
  resources: Resource[];
}

interface MaterialProps {
  lectureData: LectureDataWithResources;
}

const Material: React.FC<MaterialProps> = ({ lectureData }) => {
  const resources = lectureData.resources || [];

  if (!resources || resources.length === 0) {
    return <Text>{getText('No_materials')}</Text>;
  }

  return (
    <div>
      <Title order={3} mb="md">{getText('Course_Materials')}</Title>
      <List spacing="sm" size="sm" center>
        {resources.map((resource) => {
          let fileUrl = resource.url;
          let fileName = resource.name;

          // 如果 resource.url 是形如 "(url,\"filename\")"，则解析
          const matches = resource.url.match(/\(([^,]+),\"([^\"]+)\"\)/);
          if (matches) {
            fileUrl = matches[1].replace(/^"|"$/g, ""); // 去除引号
            fileName = matches[2];
          }

          return (
            <List.Item key={resource.id}>
              <Anchor href={fileUrl} download>
                {fileName}
              </Anchor>
            </List.Item>
          );
        })}

      </List>
    </div>
  );
};

export default Material;
