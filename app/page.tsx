'use client';

import { ChatbotWindow } from '@/components/Chatbot/Chatbot';
import { FeaturesCards } from '@/components/FeaturesCards/FeaturesCards';
import { FooterSimple } from '@/components/FooterSimple/FooterSimple';
import { Welcome } from '@/components/Welcome/Welcome';
import { SignPanel } from '@/components/SignPanel/SignPanel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useState } from 'react';

export default function HomePage() {

  const [isSignPanelOpen, setSignPanelOpen] = useState<boolean>(false)
  const toggleSignPanel = () => {
    if(isSignPanelOpen){
      setSignPanelOpen(false)
    }else{
      setSignPanelOpen(true)
    }
  }

  return (
    <>
      
    </>
  );
}
