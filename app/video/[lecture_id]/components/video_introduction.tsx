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
    <Container size="lg" style={{ padding: '20px 5px 0 5px'}}>
      <Title order={3} fw={500} style={{
        textAlign: 'left',
        marginBottom: '18px',
        color: "#666666",
      }}>
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
