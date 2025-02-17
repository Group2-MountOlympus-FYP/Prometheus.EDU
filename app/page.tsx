'use client';

import { ChatbotWindow } from '@/components/Chatbot/Chatbot';
import { FeaturesCards } from '@/components/FeaturesCards/FeaturesCards';
import { FooterSimple } from '@/components/FooterSimple/FooterSimple';
import { StatsGrid } from '@/components/StatsGrid/StatsGrid';
import { Welcome } from '@/components/Welcome/Welcome';
import { VideoPlayer } from '@/components/VideoPlayPanel/VideoPlayer';
import { RegisterPanel } from '@/components/RegisterPanel/Register';
import { LoginPanel } from '@/components/LoginPanel/Login';

export default function HomePage() {


  return (
    <>
      <RegisterPanel/>
      <LoginPanel/>
      <Welcome />
      <StatsGrid />
      <FeaturesCards />
      <FooterSimple />
      <ChatbotWindow />
      <VideoPlayer />
    </>
  );
}
