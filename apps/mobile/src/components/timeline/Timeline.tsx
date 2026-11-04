import {
  applyEventFilters,
  formatDate,
  generateTicks,
  latestEventAt,
  parseDateString,
  resolveLocalized,
  timeToRatio,
  toDateString,
} from '@atlas/shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayback } from '../../hooks/usePlayback';
import { useAtlasStore, type PlaybackSpeed } from '../../stores/useAtlasStore';
import { colors, radii, spacing } from '../../theme';

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

export function Timeline() {
  const insets = useSafeAreaInsets();
  const dataset = useAtlasStore((state) => state.dataset);
  const timeline = useAtlasStore((state) => state.timeline);
  const currentTime = useAtlasStore((state) => state.currentTime);
  const playing = useAtlasStore((state) => state.playing);
  const speed = useAtlasStore((state) => state.speed);
  const activeEntityIds = useAtlasStore((state) => state.activeEntityIds);
  const filters = useAtlasStore((state) => state.filters);
  const togglePlay = useAtlasStore((state) => state.togglePlay);
  const pause = useAtlasStore((state) => state.pause);
  const setSpeed = useAtlasStore((state) => state.setSpeed);
  const seekRatio = useAtlasStore((state) => state.seekRatio);
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);

  usePlayback();

  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const [dateDraft, setDateDraft] = useState('');

  const seekFromX = (x: number) => {
    if (widthRef.current <= 0) return;
    seekRatio(Math.min(1, Math.max(0, x / widthRef.current)));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          pause();
          seekFromX(event.nativeEvent.locationX);
        },
        onPanResponderMove: (event) => {
          seekFromX(event.nativeEvent.locationX);
        },
        onPanResponderRelease: () => {},
      }),
    [pause],
  );

  const ticks = useMemo(() => {
    if (!timeline) return [];
    return generateTicks(timeline, width || 340, { minLabelPx: 56 });
  }, [timeline, width]);

  const currentEvent = useMemo(() => {
    if (!dataset) return undefined;
    const events = applyEventFilters(dataset.events, filters).filter(
      (event) =>
        event.entityIds.some((id) => activeEntityIds.has(id)) &&
        parseDateString(event.date) <= currentTime,
    );
    return latestEventAt(events, currentTime);
  }, [dataset, filters, activeEntityIds, currentTime]);

  const ratio = timeline ? timeToRatio(currentTime, timeline) : 0;
  const dateValue = toDateString(currentTime);

  useEffect(() => {
    setDateDraft(dateValue);
  }, [dateValue]);

  if (!dataset || !timeline) return null;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.panel}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.playButton}
            onPress={togglePlay}
            accessibilityRole="button"
            accessibilityLabel={playing ? '暂停' : '播放'}
          >
            <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
          </Pressable>

          <View style={styles.main}>
            <View style={styles.labelRow}>
              <Text style={styles.dateLabel}>{formatDate(currentTime, 'zh-CN')}</Text>
              <Text style={styles.eventLabel} numberOfLines={1}>
                {currentEvent ? resolveLocalized(currentEvent.name) : '拖动时间轴或播放'}
              </Text>
            </View>

            <View
              style={styles.track}
              onLayout={(event) => {
                const next = event.nativeEvent.layout.width;
                widthRef.current = next;
                setWidth(next);
              }}
              {...panResponder.panHandlers}
            >
              <View style={styles.trackBg} />
              <View style={[styles.trackFill, { width: `${ratio * 100}%` }]} />
              {ticks.map((tick) => (
                <View
                  key={tick.time}
                  style={[styles.tick, { left: `${tick.ratio * 100}%` }]}
                  pointerEvents="none"
                >
                  <View style={tick.major ? styles.tickMajor : styles.tickMinor} />
                  {tick.major ? <Text style={styles.tickLabel}>{tick.label}</Text> : null}
                </View>
              ))}
              <View style={[styles.thumb, { left: `${ratio * 100}%` }]} pointerEvents="none" />
            </View>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TextInput
            value={dateDraft}
            onChangeText={setDateDraft}
            onEndEditing={() => {
              try {
                pause();
                setCurrentTime(parseDateString(dateDraft));
              } catch {
                setDateDraft(dateValue);
              }
            }}
            style={styles.dateInput}
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="跳转到日期"
          />
          <View style={styles.speeds}>
            {SPEEDS.map((value) => (
              <Pressable
                key={value}
                onPress={() => setSpeed(value)}
                style={[styles.speedButton, speed === value && styles.speedButtonActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: speed === value }}
              >
                <Text
                  style={[styles.speedText, speed === value && styles.speedTextActive]}
                >
                  {value}x
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
  },
  panel: {
    backgroundColor: colors.parchment + 'F2',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.ink + '14',
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.cinnabar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: colors.parchment, fontSize: 13 },
  main: { flex: 1 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  dateLabel: { fontSize: 11, color: colors.ink, fontWeight: '600' },
  eventLabel: { flex: 1, textAlign: 'right', fontSize: 10, color: colors.inkSoft },
  track: { height: 38, marginTop: 2, justifyContent: 'center' },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ink + '18',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cinnabar + 'AA',
  },
  tick: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  tickMajor: { position: 'absolute', top: 22, height: 8, width: 1, backgroundColor: colors.ink + '55' },
  tickMinor: { position: 'absolute', top: 24, height: 5, width: 1, backgroundColor: colors.ink + '25' },
  tickLabel: {
    position: 'absolute',
    top: 2,
    fontSize: 8,
    color: colors.inkSoft,
    width: 40,
    marginLeft: -20,
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.cinnabar,
    borderWidth: 2,
    borderColor: colors.parchment,
    marginLeft: -8,
    top: 11,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.ink + '18',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    color: colors.inkSoft,
    minWidth: 100,
  },
  speeds: { flexDirection: 'row', gap: 4 },
  speedButton: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  speedButtonActive: { backgroundColor: colors.cinnabar },
  speedText: { fontSize: 10, color: colors.inkSoft },
  speedTextActive: { color: colors.parchment },
});
