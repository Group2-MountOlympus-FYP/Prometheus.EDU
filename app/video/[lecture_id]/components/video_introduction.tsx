import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import { getText } from "./language";

interface VideoInfoComponentProps {
  lectureData: {
    description: string;
  }

}

const VideoInfoComponent: React.FC<VideoInfoComponentProps> = ({ lectureData }) => {
  return (
    <Container size="lg" style={{ paddingTop: '20px' }}>
      <Title order={1} style={{ textAlign: 'left', marginBottom: '20px' }}>
        {getText('Lecture_Overview')}
      </Title>
      <div>
        <Text size="md" style={{ marginBottom: '20px' }}>
          {lectureData.description}
        </Text>
      </div>
    </Container>
  );
};

export default VideoInfoComponent;
