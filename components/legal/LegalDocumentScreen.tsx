import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalDocumentScreenProps {
  title: string;
  updatedAt: string;
  intro?: string[];
  sections: LegalSection[];
  footer?: string[];
}

export default function LegalDocumentScreen({
  title,
  updatedAt,
  intro = [],
  sections,
  footer = [],
}: LegalDocumentScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updatedAt}>최종 업데이트: {updatedAt}</Text>

        {intro.map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.body.map((paragraph) => (
              <Text key={`${section.title}-${paragraph}`} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        {footer.length > 0 ? (
          <View style={styles.footer}>
            {footer.map((paragraph) => (
              <Text key={paragraph} style={styles.footerText}>
                {paragraph}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9dce3',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  updatedAt: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: '#374151',
    marginBottom: 10,
  },
  footer: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d9dce3',
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6b7280',
    marginBottom: 8,
  },
});
