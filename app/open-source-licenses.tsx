import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  openSourceFooter,
  openSourceIntro,
  openSourcePackages,
} from '@/constants/legalDocuments';

export default function OpenSourceLicensesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>오픈 라이선스</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updatedAt}>최종 업데이트: 2026-03-18</Text>
        {openSourceIntro.map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>직접 의존성</Text>
          <Text style={styles.summaryValue}>{openSourcePackages.length}개</Text>
          <Text style={styles.summaryText}>현재 설치된 런타임 패키지 기준</Text>
        </View>

        {openSourcePackages.map((pkg) => (
          <TouchableOpacity
            key={`${pkg.name}-${pkg.version}`}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(pkg.homepage)}
            style={styles.packageCard}
          >
            <View style={styles.packageHeader}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packageLicense}>{pkg.license}</Text>
            </View>
            <Text style={styles.packageMeta}>버전 {pkg.version}</Text>
            <Text style={styles.packageLink}>{pkg.homepage}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          {openSourceFooter.map((paragraph) => (
            <Text key={paragraph} style={styles.footerText}>
              {paragraph}
            </Text>
          ))}
        </View>
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
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: '#374151',
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d9dce3',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  summaryText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d9dce3',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  packageName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  packageLicense: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  packageMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
  },
  packageLink: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 6,
  },
  footer: {
    marginTop: 20,
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
