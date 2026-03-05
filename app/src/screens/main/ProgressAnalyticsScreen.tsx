import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Header, Card, ProgressRing } from '@components';
import { theme } from '@constants/theme';
import { useAnalyticsStore, useCheckInStore } from '@store';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;
const RADAR_SIZE = 220;

type TimePeriod = '7d' | '30d' | '90d';

interface MetricData {
  label: string;
  value: number;
  change: number;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

// Sample data - in production this would come from store/API
const SAMPLE_TREND_DATA = {
  '7d': [
    { date: 'Mon', energy: 6, mood: 7, clarity: 5 },
    { date: 'Tue', energy: 7, mood: 6, clarity: 6 },
    { date: 'Wed', energy: 7, mood: 8, clarity: 7 },
    { date: 'Thu', energy: 8, mood: 7, clarity: 7 },
    { date: 'Fri', energy: 6, mood: 6, clarity: 6 },
    { date: 'Sat', energy: 8, mood: 8, clarity: 8 },
    { date: 'Sun', energy: 9, mood: 9, clarity: 8 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}`,
    energy: Math.round(5 + Math.random() * 4),
    mood: Math.round(5 + Math.random() * 4),
    clarity: Math.round(4 + Math.random() * 5),
  })),
  '90d': Array.from({ length: 12 }, (_, i) => ({
    date: `W${i + 1}`,
    energy: Math.round(5 + Math.random() * 4),
    mood: Math.round(5 + Math.random() * 4),
    clarity: Math.round(4 + Math.random() * 5),
  })),
};

const RADAR_DATA = {
  nutrition: 7,
  sleep: 8,
  stress: 6,
  exercise: 7,
  brain: 8,
  mindset: 9,
};

export const ProgressAnalyticsScreen: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'energy' | 'mood' | 'clarity' | null>(null);

  const trendData = SAMPLE_TREND_DATA[period];

  const metrics: MetricData[] = useMemo(() => [
    {
      label: 'Energy',
      value: 7.5,
      change: 12,
      color: theme.colors.chart.orange,
      icon: 'flash-on',
    },
    {
      label: 'Mood',
      value: 8.2,
      change: 8,
      color: theme.colors.chart.green,
      icon: 'emoji-emotions',
    },
    {
      label: 'Clarity',
      value: 7.0,
      change: -3,
      color: theme.colors.chart.purple,
      icon: 'psychology',
    },
  ], []);

  const overallScore = useMemo(() => {
    return Math.round((7.5 + 8.2 + 7.0) / 3 * 10);
  }, []);

  // Generate SVG path for trend line
  const generateTrendPath = (data: typeof trendData, metric: 'energy' | 'mood' | 'clarity') => {
    const padding = 30;
    const chartW = CHART_WIDTH - padding * 2;
    const chartH = CHART_HEIGHT - 60;
    const maxValue = 10;

    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartW;
      const y = (CHART_HEIGHT - 30) - ((point[metric] / maxValue) * chartH);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Radar chart calculations
  const radarPoints = useMemo(() => {
    const categories = Object.keys(RADAR_DATA);
    const center = RADAR_SIZE / 2;
    const maxRadius = (RADAR_SIZE / 2) - 30;
    
    return categories.map((cat, index) => {
      const angle = (index / categories.length) * Math.PI * 2 - Math.PI / 2;
      const value = RADAR_DATA[cat as keyof typeof RADAR_DATA];
      const radius = (value / 10) * maxRadius;
      
      return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        labelX: center + Math.cos(angle) * (maxRadius + 20),
        labelY: center + Math.sin(angle) * (maxRadius + 20),
      };
    });
  }, []);

  const radarPath = radarPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header title="Progress Analytics" showBack />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Overall Score Card */}
          <Card variant="elevated" style={styles.overallCard}>
            <View style={styles.overallContent}>
              <ProgressRing 
                progress={overallScore / 100} 
                size={100} 
                strokeWidth={8}
                color={theme.colors.primary}
              />
              <View style={styles.overallInfo}>
                <Text style={styles.overallLabel}>Overall Wellness</Text>
                <Text style={styles.overallScore}>{overallScore}%</Text>
                <View style={styles.overallChange}>
                  <MaterialIcons 
                    name="trending-up" 
                    size={16} 
                    color={theme.colors.semantic.success} 
                  />
                  <Text style={styles.overallChangeText}>+8% this week</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Metric Cards Row */}
          <View style={styles.metricsRow}>
            {metrics.map((metric) => (
              <Card key={metric.label} variant="filled" style={styles.metricCard}>
                <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                  <MaterialIcons name={metric.icon} size={20} color={metric.color} />
                </View>
                <Text style={styles.metricValue}>{metric.value.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricChange}>
                  <MaterialIcons 
                    name={metric.change >= 0 ? 'arrow-upward' : 'arrow-downward'} 
                    size={12} 
                    color={metric.change >= 0 ? theme.colors.semantic.success : theme.colors.semantic.error} 
                  />
                  <Text style={[
                    styles.metricChangeText,
                    { color: metric.change >= 0 ? theme.colors.semantic.success : theme.colors.semantic.error }
                  ]}>
                    {Math.abs(metric.change)}%
                  </Text>
                </View>
              </Card>
            ))}
          </View>

          {/* Time Period Selector */}
          <View style={styles.periodSelector}>
            {(['7d', '30d', '90d'] as TimePeriod[]).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodButton,
                  period === p && styles.periodButtonActive,
                ]}
              >
                <Text style={[
                  styles.periodText,
                  period === p && styles.periodTextActive,
                ]}>
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Trend Chart */}
          <Card variant="elevated" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Daily Metrics Trend</Text>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <SvgGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={theme.colors.chart.orange} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={theme.colors.chart.orange} stopOpacity="0" />
                </SvgGradient>
                <SvgGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={theme.colors.chart.green} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={theme.colors.chart.green} stopOpacity="0" />
                </SvgGradient>
              </Defs>
              
              {/* Grid lines */}
              {[2, 4, 6, 8, 10].map((val) => {
                const y = (CHART_HEIGHT - 30) - ((val / 10) * (CHART_HEIGHT - 60));
                return (
                  <G key={val}>
                    <Line 
                      x1={30} 
                      y1={y} 
                      x2={CHART_WIDTH - 30} 
                      y2={y} 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth={1}
                    />
                    <SvgText 
                      x={15} 
                      y={y + 4} 
                      fill={theme.colors.textSecondary}
                      fontSize={10}
                    >
                      {val}
                    </SvgText>
                  </G>
                );
              })}

              {/* Energy line */}
              <Path
                d={generateTrendPath(trendData, 'energy')}
                stroke={theme.colors.chart.orange}
                strokeWidth={2}
                fill="none"
              />

              {/* Mood line */}
              <Path
                d={generateTrendPath(trendData, 'mood')}
                stroke={theme.colors.chart.green}
                strokeWidth={2}
                fill="none"
              />

              {/* Clarity line */}
              <Path
                d={generateTrendPath(trendData, 'clarity')}
                stroke={theme.colors.chart.purple}
                strokeWidth={2}
                fill="none"
              />

              {/* X-axis labels */}
              {trendData.filter((_, i) => period === '7d' || i % Math.ceil(trendData.length / 7) === 0).map((point, index, arr) => {
                const x = 30 + (trendData.indexOf(point) / (trendData.length - 1)) * (CHART_WIDTH - 60);
                return (
                  <SvgText 
                    key={index}
                    x={x} 
                    y={CHART_HEIGHT - 8} 
                    fill={theme.colors.textSecondary}
                    fontSize={10}
                    textAnchor="middle"
                  >
                    {point.date}
                  </SvgText>
                );
              })}
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.chart.orange }]} />
                <Text style={styles.legendText}>Energy</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.chart.green }]} />
                <Text style={styles.legendText}>Mood</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.chart.purple }]} />
                <Text style={styles.legendText}>Clarity</Text>
              </View>
            </View>
          </Card>

          {/* Radar Chart - Life Areas */}
          <Card variant="elevated" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Life Area Balance</Text>
            <View style={styles.radarContainer}>
              <Svg width={RADAR_SIZE} height={RADAR_SIZE}>
                {/* Background circles */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                  <Circle
                    key={i}
                    cx={RADAR_SIZE / 2}
                    cy={RADAR_SIZE / 2}
                    r={((RADAR_SIZE / 2) - 30) * scale}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                  />
                ))}

                {/* Radar area */}
                <Path
                  d={radarPath}
                  fill="rgba(19, 164, 236, 0.2)"
                  stroke={theme.colors.primary}
                  strokeWidth={2}
                />

                {/* Data points */}
                {radarPoints.map((point, i) => (
                  <Circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={theme.colors.primary}
                  />
                ))}

                {/* Labels */}
                {radarPoints.map((point, i) => (
                  <SvgText
                    key={`label-${i}`}
                    x={point.labelX}
                    y={point.labelY}
                    fill={theme.colors.text}
                    fontSize={11}
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {point.label}
                  </SvgText>
                ))}
              </Svg>
            </View>
          </Card>

          {/* Insights Section */}
          <Card variant="elevated" style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <MaterialIcons name="lightbulb" size={24} color={theme.colors.accent.yellow} />
              <Text style={styles.insightsTitle}>AI Insights</Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightText}>
                Your energy peaks on weekends. Consider shifting some intensive tasks to Saturday mornings.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightText}>
                Mood correlates strongly with sleep quality. Focus on your sleep routine for quick wins.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightText}>
                Brain clarity improved 15% since starting coherent breathing. Keep it up!
              </Text>
            </View>
          </Card>

          {/* Streak & Consistency */}
          <Card variant="filled" style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={styles.streakIcon}>
                <MaterialIcons name="local-fire-department" size={32} color={theme.colors.chart.orange} />
              </View>
              <View>
                <Text style={styles.streakValue}>12 Day Streak</Text>
                <Text style={styles.streakLabel}>Keep the momentum going!</Text>
              </View>
            </View>
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>85%</Text>
                <Text style={styles.streakStatLabel}>Completion Rate</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>24</Text>
                <Text style={styles.streakStatLabel}>Check-ins</Text>
              </View>
              <View style={styles.streakStat}>
                <Text style={styles.streakStatValue}>18</Text>
                <Text style={styles.streakStatLabel}>Sessions</Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  overallCard: {
    marginBottom: theme.spacing.md,
  },
  overallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  overallInfo: {
    flex: 1,
  },
  overallLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  overallScore: {
    fontSize: 42,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
    marginVertical: 4,
  },
  overallChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallChangeText: {
    fontSize: 14,
    color: theme.colors.semantic.success,
    fontFamily: 'Lexend-Medium',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: 22,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: 2,
  },
  metricChangeText: {
    fontSize: 11,
    fontFamily: 'Lexend-Medium',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.full,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Medium',
  },
  periodTextActive: {
    color: theme.colors.text,
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  radarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  insightsCard: {
    marginBottom: theme.spacing.lg,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  insightsTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  insightItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  insightText: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: 'Lexend-Regular',
    lineHeight: 20,
  },
  streakCard: {
    marginBottom: theme.spacing.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  streakLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: theme.spacing.md,
  },
  streakStat: {
    alignItems: 'center',
  },
  streakStatValue: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.primary,
  },
  streakStatLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
});

export default ProgressAnalyticsScreen;
