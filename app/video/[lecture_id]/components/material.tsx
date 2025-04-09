"use client";

import React, { useEffect, useState } from "react";
import { Title, List, Anchor, Loader, Text } from "@mantine/core";
import {getLectureDetailsById} from "@/app/api/Lecture/router";

interface Resource {
  id: number;
  lecture: number;
  name: string;
  url: string;
}

interface MaterialProps {
  lectureId: number;
}

const Material: React.FC<MaterialProps> = ({ lectureId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLectureDetailsById(lectureId,1,10)
      .then((data) => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("加载资源失败", err);
        setLoading(false);
      });
  }, [lectureId]);

  if (loading) return <Loader />;

  if (resources.length === 0) {
    return <Text>No materials available for this lecture.</Text>;
  }

  return (
    <div>
      <Title order={3} mb="md">Course Materials</Title>
      <List spacing="sm" size="sm" center>
        {resources.map((resource) => {
          // 解析 URL 中的实际文件地址和显示名
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
