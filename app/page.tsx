'use client';

import { ChartBox } from '@/components/Chart/ChartBox';
import { ZhhqChartBox } from "@/components/Chart/zhhqChart";
import { JhzlChartBox } from '@/components/Chart/JhzlChart';
import { ChatbotWindow } from '@/components/Chatbot/Chatbot';
import { FeaturesCards } from '@/components/FeaturesCards/FeaturesCards';
import { FooterSimple } from '@/components/FooterSimple/FooterSimple';
import { StatsGrid } from '@/components/StatsGrid/StatsGrid';
import { Welcome } from '@/components/Welcome/Welcome';
import { VideoPlayer } from '@/components/VideoPlayPanel/VideoPlayer';

export default function HomePage() {


  return (
    <>
      <Welcome />
      <StatsGrid />
      <ChartBox postfix="sshqt/quotshow.html" />
      <ZhhqChartBox />
      {/* <JhzlChartBox /> */}
      <FeaturesCards />
      <FooterSimple />
      <ChatbotWindow />
      <VideoPlayer />
    </>
  );
}
