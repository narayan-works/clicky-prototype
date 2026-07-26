import React, { useRef, useState, useEffect } from 'react';

const clipDurations = [2.53, 1.10, 0.20, 3.03, 1.60, 1.80, 4.00, 3.83, 2.43, 1.83, 1.53, 4.43, 1.53, 7.40, 1.97, 0.50, 0.53, 1.63, 2.60, 5.60, 3.00];

let runningTime = 0;
const v1Clips = clipDurations.map((dur, idx) => {
  const clip = {
    i: idx + 1,
    name: idx === 6 ? '4V8PYzxEurVcxOqM.mp4 [V]' : '4V8PY...',
    startSec: runningTime,
    durSec: dur,
    timeOffset: (runningTime + 0.5) % 50
  };
  runningTime += dur;
  return clip;
});

const TOTAL_SEC = runningTime;

export default function Timeline({ currentTime, onScrub, v2Clips, setV2Clips }) {
  const innerRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // ResizeObserver to calculate dynamic pxPerSec so clips span 100% full width!
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const pxPerSec = Math.max(24, containerWidth / TOTAL_SEC);
  const timelineWidthPx = Math.max(containerWidth, TOTAL_SEC * pxPerSec);

  // Timeline scrub click/drag handler
  const handleTimelineMouseDown = (e) => {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const sec = Math.max(0, Math.min(TOTAL_SEC, clickX / pxPerSec));
    onScrub(sec);

    const onMouseMove = (moveEvent) => {
      const moveX = moveEvent.clientX - rect.left;
      const moveSec = Math.max(0, Math.min(TOTAL_SEC, moveX / pxPerSec));
      onScrub(moveSec);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // V2 Graphic Clip Dragging & Trimming Handler
  const handleClipMouseDown = (e, clipId, mode) => {
    e.stopPropagation();
    const clip = v2Clips.find(c => c.id === clipId);
    if (!clip) return;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - e.clientX;
      const dSec = dx / pxPerSec;

      setV2Clips(prevClips => prevClips.map(c => {
        if (c.id !== clipId) return c;

        if (mode === 'move') {
          const newStart = Math.max(0, Math.min(TOTAL_SEC - c.durSec, clip.startSec + dSec));
          return { ...c, startSec: newStart };
        } else if (mode === 'resize-l') {
          const maxStart = clip.startSec + clip.durSec - 0.5;
          const newStart = Math.max(0, Math.min(maxStart, clip.startSec + dSec));
          const newDur = clip.durSec - (newStart - clip.startSec);
          return { ...c, startSec: newStart, durSec: newDur };
        } else if (mode === 'resize-r') {
          const newDur = Math.max(0.5, Math.min(TOTAL_SEC - c.startSec, clip.durSec + dSec));
          return { ...c, durSec: newDur };
        }
        return c;
      }));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="panel panel-timeline">
      <div className="tracks-wrap">
        {/* Vertical Tools Strip on the left of the timeline panel */}
        <div className="left-tools-strip">
          <span className="tool-icon active" title="Selection Tool (V)">↖</span>
          <span className="tool-icon" title="Track Select Forward (A)">⇥</span>
          <span className="tool-icon" title="Ripple Edit Tool (B)">⇇</span>
          <span className="tool-icon" title="Razor Tool (C)">✂</span>
          <span className="tool-icon" title="Slip Tool (Y)">⇎</span>
          <span className="tool-icon" title="Pen Tool (P)">✒</span>
          <span className="tool-icon" title="Hand Tool (H)">✋</span>
          <span className="tool-icon" title="Type Tool (T)">T</span>
          <span className="tool-icon" title="Zoom Tool (Z)">🔍</span>
        </div>

        {/* Track Headers Column */}
        <div className="track-headers">
          <div className="th-cell header-ruler"></div>
          <div className="th-cell">V3</div>
          <div className="th-cell v2-head">V2</div>
          <div className="th-cell v1-head">V1</div>
          <div className="th-cell">A1</div>
          <div className="th-cell">A2</div>
          <div className="th-cell">A3</div>
        </div>

        {/* Scrollable Track Lanes */}
        <div className="track-lanes" ref={containerRef}>
          <div
            className="timeline-inner"
            ref={innerRef}
            style={{ width: `${timelineWidthPx}px` }}
            onMouseDown={handleTimelineMouseDown}
          >
            {/* Top Ruler with Gold Highlight Line */}
            <div className="ruler" style={{ width: `${timelineWidthPx}px` }}>
              <div className="ruler-gold-line"></div>
              {Array.from({ length: Math.ceil(TOTAL_SEC / 8) + 1 }).map((_, idx) => {
                const secMark = idx * 8;
                const mm = Math.floor(secMark / 60);
                const ss = secMark % 60;
                const tcStr = `00:${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}:00`;
                return (
                  <div className="ruler-tick" key={idx} style={{ left: `${secMark * pxPerSec}px` }}>
                    <span>{tcStr}</span>
                  </div>
                );
              })}
            </div>

            {/* V3 Lane */}
            <div className="lane v3-lane" style={{ width: `${timelineWidthPx}px` }}></div>

            {/* V2 Graphic Clip Lane */}
            <div className="lane v2-lane" style={{ width: `${timelineWidthPx}px` }}>
              {v2Clips.map((clip) => (
                <div
                  key={clip.id}
                  className="v2-chip-block"
                  style={{
                    left: `${clip.startSec * pxPerSec}px`,
                    width: `${clip.durSec * pxPerSec}px`,
                    backgroundColor: clip.color || '#7000ff'
                  }}
                  onMouseDown={(e) => handleClipMouseDown(e, clip.id, 'move')}
                >
                  <div
                    className="chip-handle handle-l"
                    onMouseDown={(e) => handleClipMouseDown(e, clip.id, 'resize-l')}
                  ></div>
                  <span className="chip-label">{clip.text.toUpperCase()}</span>
                  <div
                    className="chip-handle handle-r"
                    onMouseDown={(e) => handleClipMouseDown(e, clip.id, 'resize-r')}
                  ></div>
                </div>
              ))}
            </div>

            {/* V1 Video Clip Lane */}
            <div className="lane v1-lane" style={{ width: `${timelineWidthPx}px` }}>
              {v1Clips.map((clip) => {
                const isHot = currentTime >= clip.startSec && currentTime < clip.startSec + clip.durSec;
                const clipW = Math.max(2, clip.durSec * pxPerSec - 1);
                return (
                  <div
                    key={clip.i}
                    className={`v1-clip-block ${isHot ? 'hot' : ''}`}
                    style={{
                      left: `${clip.startSec * pxPerSec}px`,
                      width: `${clipW}px`
                    }}
                  >
                    <div className="clip-thumb-box">
                      <video
                        src={`/4V8PYzxEurVcxOqM.mp4#t=${clip.timeOffset}`}
                        muted
                        preload="metadata"
                      />
                    </div>
                    {clipW > 45 && (
                      <span className="clip-title">{clip.name}</span>
                    )}
                    {clipW > 25 && <span className="fx-badge">fx</span>}
                  </div>
                );
              })}
            </div>

            {/* A1 Audio Track Lane */}
            <div className="lane a1-lane" style={{ width: `${timelineWidthPx}px` }}>
              {v1Clips.map((clip) => {
                const clipW = Math.max(2, clip.durSec * pxPerSec - 1);
                return (
                  <div
                    key={`a1-${clip.i}`}
                    className="a1-clip-block"
                    style={{
                      left: `${clip.startSec * pxPerSec}px`,
                      width: `${clipW}px`
                    }}
                  >
                    {clipW > 28 && <span className="mic-icon">🎙</span>}
                    {clipW > 25 && <span className="fx-badge">fx</span>}
                    <div className="audio-wave-container">
                      <div className="center-baseline"></div>
                      <div className="audio-wave-bars"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* A2 & A3 Lanes */}
            <div className="lane a2-lane" style={{ width: `${timelineWidthPx}px` }}></div>
            <div className="lane a3-lane" style={{ width: `${timelineWidthPx}px` }}></div>

            {/* Interactive Playhead Line */}
            <div
              className="playhead"
              style={{ left: `${currentTime * pxPerSec}px` }}
            ></div>
          </div>
        </div>

        {/* Far Right Track Zoom Controls Column */}
        <div className="track-right-controls">
          <div className="zoom-handle"></div>
          <div className="zoom-handle"></div>
        </div>
      </div>
    </div>
  );
}
