'use client';

import React from 'react';
import { Title, List, Anchor, Loader, Text } from '@mantine/core';

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
    return <Text>No materials available for this lecture.</Text>;
  }

  return (
    <div>
      <Title order={3} mb="md">Course Materials</Title>
      <List spacing="sm" size="sm" center>
        {resources.map((resource) => {
          const matches = resource.url.match(/\(([^,]+),\"([^\"]+)\"\)/);
          const fileUrl = matches?.[1] || "#";
          const fileName = matches?.[2] || resource.name;

          return (
            <List.Item key={resource.id}>
              <Anchor href={fileUrl} download target="_blank">
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
