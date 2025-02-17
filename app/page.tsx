'use client';

import { ChatbotWindow } from '@/components/Chatbot/Chatbot';
import { FeaturesCards } from '@/components/FeaturesCards/FeaturesCards';
import { FooterSimple } from '@/components/FooterSimple/FooterSimple';
import { StatsGrid } from '@/components/StatsGrid/StatsGrid';
import { Welcome } from '@/components/Welcome/Welcome';
import { BLEDisplay } from '@/components/BLEDataDisplay/HeartBeatDataTest';

export default function HomePage() {


  return (
    <>
      <Welcome />
      <StatsGrid />
      <FeaturesCards />
      <FooterSimple />
      <ChatbotWindow />
      <BLEDisplay />

    </>
  );
}
