import LegalDocumentScreen from '@/components/legal/LegalDocumentScreen';
import {
  privacyPolicyFooter,
  privacyPolicyIntro,
  privacyPolicySections,
} from '@/constants/legalDocuments';
import React from 'react';

export default function PrivacyPolicyScreen() {
  return (
    <LegalDocumentScreen
      title="개인정보처리방침"
      updatedAt="2026-03-18"
      intro={privacyPolicyIntro}
      sections={privacyPolicySections}
      footer={privacyPolicyFooter}
    />
  );
}
