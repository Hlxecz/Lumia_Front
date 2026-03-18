import LegalDocumentScreen from '@/components/legal/LegalDocumentScreen';
import {
  termsOfUseFooter,
  termsOfUseIntro,
  termsOfUseSections,
} from '@/constants/legalDocuments';
import React from 'react';

export default function TermsOfUseScreen() {
  return (
    <LegalDocumentScreen
      title="이용약관"
      updatedAt="2026-03-18"
      intro={termsOfUseIntro}
      sections={termsOfUseSections}
      footer={termsOfUseFooter}
    />
  );
}
