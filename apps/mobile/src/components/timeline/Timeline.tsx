import {
  applyEventFilters,
  createViewport,
  eventStart,
  formatDate,
  generateTicks,
  latestEventAt,
  parseDateString,
  ratioToTime,
  resolveLocalized,
  timelineEventMarkers,
  timeToRatio,
  toDateString,
  type AtlasEvent,
  type Timeline as AtlasTimeline,
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
import { useI18n } from '../../hooks/useI18n';
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
  const setCurrentTime = useAtlasStore((state) => state.setCurrentTime);
  const selectEvent = useAtlasStore((state) => state.selectEvent);

  usePlayback();
  const { locale, t, dateLocale } = useI18n();

  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const [dateDraft, setDateDraft] = useState('');

  const viewport = useMemo(
    () => (timeline ? createViewport(timeline, 0) : null),
    [timeline],
  );

  const viewportRef = useRef<AtlasTimeline | null>(viewport);
  viewportRef.current = viewport;

  const seekFromX = (x: number) => {
    const vp = viewportRef.current;
    if (!vp || widthRef.current <= 0) return;
    setCurrentTime(ratioToTime(Math.min(1, Math.max(0, x / widthRef.current)), vp));
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
    if (!viewport) return [];
    return generateTicks(viewport, width || 340, { minLabelPx: 56, locale: dateLocale });
  }, [viewport, width, dateLocale]);

  const currentEvent = useMemo(() => {
    if (!dataset) return undefined;
    const events = applyEventFilters(dataset.events, filters).filter(
      (event) =>
        event.entityIds.some((id) => activeEntityIds.has(id)) &&
        parseDateString(event.date) <= currentTime,
    );
    return latestEventAt(events, currentTime);
  }, [dataset, filters, activeEntityIds, currentTime]);

  const markers = useMemo(() => {
    if (!dataset || !viewport) return [];
    const events = applyEventFilters(dataset.events, filters).filter((event) =>
      event.entityIds.some((id) => activeEntityIds.has(id)),
    );
    return timelineEventMarkers(events, viewport).filter(
      (marker) => marker.ratio >= 0 && marker.ratio <= 1,
    );
  }, [dataset, filters, activeEntityIds, viewport]);

  const eventNodes = useMemo(() => {
    if (!dataset || !timeline) return [];
    return applyEventFilters(dataset.events, filters)
      .filter((event) => {
        const start = eventStart(event);
        return (
          start >= timeline.start &&
          start <= timeline.end &&
          event.entityIds.some((id) => activeEntityIds.has(id))
        );
      })
      .sort(
        (a, b) => eventStart(a) - eventStart(b) || a.id.localeCompare(b.id),
      );
  }, [dataset, filters, activeEntityIds, timeline]);

  const { previousEvent, nextEvent } = useMemo(() => {
    let previous: AtlasEvent | undefined;
    let next: AtlasEvent | undefined;
    for (const event of eventNodes) {
      const start = eventStart(event);
      if (start < currentTime) {
        if (!previous || start > eventStart(previous)) previous = event;
      } else if (start > currentTime) {
        next = event;
        break;
      }
    }
    return { previousEvent: previous, nextEvent: next };
  }, [eventNodes, currentTime]);

  const jumpToEvent = (event: AtlasEvent | undefined) => {
    if (!event) return;
    pause();
    setCurrentTime(eventStart(event));
    selectEvent(event.id);
  };

  const ratio = viewport ? timeToRatio(currentTime, viewport) : 0;
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
            accessibilityLabel={playing ? t('timeline.pause') : t('timeline.play')}
          >
            <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
          </Pressable>

          <View style={styles.eventNav}>
            <Pressable
              onPress={() => jumpToEvent(previousEvent)}
              disabled={!previousEvent}
              style={[styles.navButton, !previousEvent && styles.navButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel={t('event.previous')}
              accessibilityHint={
                previousEvent ? resolveLocalized(previousEvent.name, locale) : undefined
              }
            >
              <Text style={styles.navButtonText}>‹</Text>
            </Pressable>
            <Pressable
              onPress={() => jumpToEvent(nextEvent)}
              disabled={!nextEvent}
              style={[styles.navButton, !nextEvent && styles.navButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel={t('event.next')}
              accessibilityHint={nextEvent ? resolveLocalized(nextEvent.name, locale) : undefined}
            >
              <Text style={styles.navButtonText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.main}>
            <View style={styles.labelRow}>
              <Text style={styles.dateLabel}>{formatDate(currentTime, dateLocale)}</Text>
              <Text
                style={styles.eventLabel}
                numberOfLines={1}
                accessibilityLiveRegion="polite"
              >
                {currentEvent ? resolveLocalized(currentEvent.name, locale) : t('timeline.hint')}
              </Text>
            </View>

            <View style={styles.markerLane}>
              {markers
                .filter((marker) => marker.endRatio > marker.ratio)
                .map((marker) => {
                  const active = marker.event.id === currentEvent?.id;
                  const past = eventStart(marker.event) <= currentTime;
                  return (
                    <View
                      key={`bar-${marker.event.id}`}
                      style={[
                        styles.markerBar,
                        active
                          ? styles.markerBarActive
                          : past
                            ? styles.markerBarPast
                            : styles.markerBarFuture,
                        {
                          left: `${marker.ratio * 100}%`,
                          width: `${Math.max(0.2, (marker.endRatio - marker.ratio) * 100)}%`,
                        },
                      ]}
                    />
                  );
                })}
              {markers.map((marker) => {
                const active = marker.event.id === currentEvent?.id;
                const past = eventStart(marker.event) <= currentTime;
                return (
                  <Pressable
                    key={marker.event.id}
                    onPress={() => {
                      pause();
                      setCurrentTime(eventStart(marker.event));
                      selectEvent(marker.event.id);
                    }}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${resolveLocalized(marker.event.name, locale)}，${formatDate(
                      eventStart(marker.event),
                      dateLocale,
                    )}`}
                    style={[
                      styles.marker,
                      past ? styles.markerPast : styles.markerFuture,
                      active && styles.markerActive,
                      { left: `${marker.ratio * 100}%` },
                    ]}
                  />
                );
              })}
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
            accessibilityLabel={t('timeline.jumpToDate')}
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
  eventNav: { flexDirection: 'row', gap: 4 },
  navButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink + '26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: { opacity: 0.35 },
  navButtonText: { fontSize: 14, lineHeight: 16, color: colors.inkSoft },
  main: { flex: 1 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  dateLabel: { fontSize: 11, color: colors.ink, fontWeight: '600' },
  eventLabel: { flex: 1, textAlign: 'right', fontSize: 10, color: colors.inkSoft },
  markerLane: { height: 14, marginTop: 2 },
  markerBar: {
    position: 'absolute',
    top: 5,
    height: 3,
    borderRadius: 2,
    minWidth: 2,
  },
  markerBarPast: { backgroundColor: colors.cinnabar + '33' },
  markerBarFuture: { backgroundColor: colors.ink + '18' },
  markerBarActive: { backgroundColor: colors.cinnabar + '66' },
  marker: {
    position: 'absolute',
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
  markerPast: { backgroundColor: colors.cinnabar + 'B3' },
  markerFuture: { backgroundColor: colors.ink + '33' },
  markerActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    top: 2,
    backgroundColor: colors.cinnabar,
    borderWidth: 2,
    borderColor: colors.ochre,
  },
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
