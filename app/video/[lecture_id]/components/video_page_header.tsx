import React from 'react';
import { Container, Grid, Card, Text } from '@mantine/core';
import { format } from 'date-fns';
import { getText } from "./language";

interface VideoHeaderProps {
    lectureData: {
        id: number;
        name: string;
        created_at: string;
    };
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ lectureData }) => {
    return (
      <Container>
          <Grid>
              <Grid.Col span={6}>
                  <Card>
                      <Text>
                          {getText('Lecture_name')} {lectureData.id}: {lectureData.name || getText('Loading')}
                      </Text>
                  </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                  <Card>
                      <Text>
                          {getText('Lecture_date')}: {format(new Date(lectureData.created_at), 'yyyy-MM-dd')}
                      </Text>
                  </Card>
              </Grid.Col>
          </Grid>
      </Container>
    );
};

export default VideoHeader;