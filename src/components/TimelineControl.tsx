import { useEffect, useRef, useCallback } from 'react';
import { Timeline, DataSet } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

interface TimelineControlProps {
  min: number;
  max: number;
  height?: string;
  customTimeColor?: string;
  currentTime: number;
  onTimeChange: (time: number) => void;
}

export const TimelineControl = ({
  min,
  max,
  height = '100px',
  customTimeColor = '#ffee00',
  currentTime,
  onTimeChange,
}: TimelineControlProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<Timeline | null>(null);
  // min, maxの値をuseRefに保存して不要な再レンダリングを防止
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const heightRef = useRef(height);
  const customTimeColorRef = useRef(customTimeColor);
  const currentTimeRef = useRef(currentTime);

  // Unix timestamp (秒)をJavaScript Dateオブジェクトに変換する関数
  const createDate = useCallback((unixTimestamp: number) => {
    // Unix timestampは1970年1月1日からの経過秒数なので、
    // JavaScriptのDateオブジェクトで使用するには1000倍してミリ秒に変換する
    return new Date(unixTimestamp * 1000);
  }, []);

  // タイムラインのデータセットを作成する関数
  const createTimelineItems = useCallback(() => {
    return new DataSet([
      {
        id: 1,
        content: 'レース進行',
        start: createDate(minRef.current),
        end: createDate(maxRef.current),
      },
    ]);
  }, [createDate]);

  // タイムラインのオプションを設定する関数
  const getTimelineOptions = useCallback(() => {
    return {
      //   min: createDate(minRef.current),
      //   max: createDate(maxRef.current),
      start: createDate(minRef.current),
      end: createDate(maxRef.current),
      // zoomMin: 0,
      // zoomMax: 86400000, // 1日分（ミリ秒）
      // zoomable: false,
      showCurrentTime: true,
      showMajorLabels: true,
      showMinorLabels: true,
      // format: {
      //     minorLabels: {
      //         minute: 'HH:mm',
      //         hour: 'HH:mm'
      //     },
      //     majorLabels: {
      //         hour: 'HH:mm',
      //         day: 'M/D'
      //     }
      // },
      // 目盛線を非表示にする設定
      showGrid: false,
      // 横スクロールを無効化する設定
      moveable: false,
      selectable: true,
      // timeAxis: { scale: 'minute' as const, step: 1 },
      width: '100%',
      height: heightRef.current,
      snap: function (date: Date) {
        // snapの値をセットする事で、目盛線の移動をスムーズにできる
        const hour = 60 * 1000;
        const snapvalue = Math.round(date.getTime() / hour) * hour;
        // console.log('snapvalue', snapvalue);
        return snapvalue;
      },
    };
  }, [createDate]);

  // カスタムCSSスタイルを追加する関数
  const addCustomTimelineStyle = useCallback(() => {
    // すでに存在する場合は追加しない
    if (document.querySelector('style[data-timeline-style]')) return;

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-timeline-style', 'true');
    styleElement.textContent = `
            .vis-custom-time {
                background-color: ${customTimeColorRef.current};
            }
            .vis-timeline {
                border: 1px solid #575757;
            }
            .vis-panel.vis-center {
                border: 1px solid #575757;
            }
            .vis-panel {
                border-color: #575757;
            }
            .vis-grid.vis-horizontal {
                border-bottom: 1px solid #575757;
            }
            .vis-time-axis .vis-grid.vis-minor {
                border-color: #575757;
            }
            .vis-time-axis .vis-text {
                color: #575757;
            }
            .vis-time-axis .vis-grid.vis-major {
                border-color: #575757;
            }
     `;
    document.head.appendChild(styleElement);
  }, [customTimeColorRef]);

  // タイムラインのイベントリスナーを設定する関数
  const setupTimelineEventListeners = useCallback(
    (timelineInstance: Timeline) => {
      const customTimeId = 'current';
      timelineInstance.addCustomTime(
        createDate(currentTimeRef.current),
        customTimeId
      );

      //   timelineInstance.setCustomTimeMarker(
      //     'Enter some text',
      //     customTimeId,
      //     true
      //   );

      // イベントリスナーが重複しないように一度削除してから追加
      timelineInstance.off('timechange');
      timelineInstance.on('timechange', function (props: any) {
        if (props.id === customTimeId) {
          const timeInSeconds = Math.floor(props.time.getTime() / 1000);
          onTimeChange(timeInSeconds);
        }
      });
    },
    [createDate, onTimeChange]
  );

  // タイムラインを初期化する関数
  const initializeTimeline = useCallback(() => {
    if (!timelineRef.current) return;

    // すでにタイムラインが存在する場合は再初期化しない
    if (timeline.current) return;

    try {
      // Create a DataSet with items
      const items = createTimelineItems();

      // Configuration for the Timeline
      const options = getTimelineOptions();

      // Add custom CSS
      addCustomTimelineStyle();

      // Create a Timeline
      timeline.current = new Timeline(timelineRef.current, items, options);

      // Setup event listeners
      setupTimelineEventListeners(timeline.current);
    } catch (error) {
      console.error('Timeline initialization error:', error);
    }
  }, [
    createTimelineItems,
    getTimelineOptions,
    addCustomTimelineStyle,
    setupTimelineEventListeners,
  ]);

  // タイムラインをクリーンアップする関数
  const cleanupTimeline = useCallback(() => {
    if (timeline.current) {
      timeline.current.destroy();
      timeline.current = null;
    }

    // スタイル要素を削除
    const styleElement = document.querySelector('style[data-timeline-style]');
    if (styleElement) {
      styleElement.remove();
    }
  }, []);

  // タイムラインを更新する関数
  const updateTimelinePosition = useCallback(() => {
    if (!timeline.current) {
      // タイムラインが存在しない場合は初期化
      initializeTimeline();
      return;
    }

    try {
      const customTimeId = 'current';
      timeline.current.setCustomTime(
        createDate(currentTimeRef.current),
        customTimeId
      );
    } catch (error) {
      console.error('Timeline update error:', error);
      // エラーが発生した場合、タイムラインを再初期化
      cleanupTimeline();
      initializeTimeline();
    }
  }, [createDate, initializeTimeline, cleanupTimeline]);

  // コンポーネントのマウント時に一度だけ実行
  useEffect(() => {
    // propsの値をrefに保存
    minRef.current = min;
    maxRef.current = max;
    heightRef.current = height;
    customTimeColorRef.current = customTimeColor;
    currentTimeRef.current = currentTime;

    // タイムラインを初期化
    initializeTimeline();

    // コンポーネントのアンマウント時にクリーンアップ
    return () => {
      cleanupTimeline();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存配列で一度だけ実行

  // min, maxが変更されたときにタイムラインを更新
  useEffect(() => {
    minRef.current = min;
    maxRef.current = max;
    
    if (timeline.current) {
      try {
        // タイムラインの開始と終了時間を更新
        const startTime = createDate(min);
        const endTime = createDate(max);
        
        timeline.current.setWindow(startTime, endTime, { animation: false });
      } catch (error) {
        console.error('Timeline window update error:', error);
      }
    }
  }, [min, max, createDate]);

  // currentTimeが変更されたときにタイムラインを更新
  useEffect(() => {
    currentTimeRef.current = currentTime;
    updateTimelinePosition();
  }, [currentTime, updateTimelinePosition]);

  return <div ref={timelineRef}></div>;
};
