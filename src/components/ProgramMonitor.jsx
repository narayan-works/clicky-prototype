import React, { useRef, useEffect } from 'react';

export default function ProgramMonitor({ currentTime, isPlaying, togglePlayPause, activeGraphic, formattedTimecode, movePlayhead }) {
  const videoRef = useRef(null);

  // Sync video element time & playback state
  useEffect(() => {
    if (videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.3) {
        videoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Determine text parameters for active graphic overlay
  const textStr = activeGraphic ? activeGraphic.text.toUpperCase() : '';
  const fontFam = activeGraphic ? activeGraphic.font : 'monospace';
  const isBold = activeGraphic ? activeGraphic.isBold : true;
  const isItalic = activeGraphic ? activeGraphic.isItalic : false;
  const mode = activeGraphic ? activeGraphic.mode : 'fillOut';
  const color = activeGraphic ? activeGraphic.color : '#AA0101';

  const useFont = (fontFam && fontFam !== 'sans-serif' && fontFam !== 'serif' && fontFam !== 'monospace') 
    ? fontFam 
    : "Impact, 'Arial Black', sans-serif";

  const styleStr = isItalic ? 'italic' : 'normal';

  return (
    <div className="panel panel-monitor">
      <div className="monitor-tabs">
        <span>Source: (no clips)</span>
        <span className="active">Program: 4V8PYzxEurVcxOqM</span>
      </div>

      <div className="monitor-screen">
        <div className="video-viewport">
          {/* Real HTML5 Video Element */}
          <video
            ref={videoRef}
            src="/4V8PYzxEurVcxOqM.mp4"
            muted
            playsInline
            className="monitor-video-element"
          />

          {/* Full-Screen Video Overlay (Fill Out Cutout vs Fill In Solid Text) */}
          {activeGraphic && (
            <div className="monitor-overlay-container">
              {mode === 'fillOut' ? (
                /* Fill Out: Solid Color Block with Video Showing Through Letter Cutouts */
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 280" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <defs>
                      <mask id="mon-cutout-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="central"
                          textAnchor="middle"
                          fontFamily={useFont}
                          fontWeight={isBold ? '900' : 'normal'}
                          fontStyle={styleStr}
                          fontSize="185"
                          textLength="496"
                          letterSpacing="-6"
                          lengthAdjust="spacingAndGlyphs"
                          transform="scale(1, 1.88)"
                          transformOrigin="250 140"
                          fill="black"
                        >
                          {textStr}
                        </text>
                      </mask>
                    </defs>
                    <rect width="100%" height="100%" fill={color} mask="url(#mon-cutout-mask)" />
                  </svg>
                </div>
              ) : (
                /* Fill In: Giant Solid Text Colored in Selected Fill In Color over Live Video */
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 280" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="central"
                      textAnchor="middle"
                      fontFamily={useFont}
                      fontWeight={isBold ? '900' : 'normal'}
                      fontStyle={styleStr}
                      fontSize="185"
                      textLength="496"
                      letterSpacing="-6"
                      lengthAdjust="spacingAndGlyphs"
                      transform="scale(1, 1.88)"
                      transformOrigin="250 140"
                      fill={color || '#ffffff'}
                      style={{ filter: 'drop-shadow(0px 4px 14px rgba(0,0,0,0.8))' }}
                    >
                      {textStr}
                    </text>
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scrub & Timecode Bar */}
      <div className="monitor-scrub">
        <div className="scrub-top">
          <span className="timecode-display">{formattedTimecode}</span>
          <span>Fit ▾ · 1/2 · 00:00:53:03</span>
        </div>
        <div className="scrub-bar">
          <div className="fill" style={{ width: `${Math.max(0.5, (currentTime / 53.05) * 100)}%` }}></div>
        </div>
      </div>

      {/* Transport Button Controls */}
      <div className="transport">
        <span onClick={() => movePlayhead && movePlayhead(0)} title="First Frame">⏮</span>
        <span onClick={() => movePlayhead && movePlayhead(Math.max(0, currentTime - 5))} title="Step Back">◀◀</span>
        <span onClick={togglePlayPause} className="play-btn" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? '❚❚' : '▶'}
        </span>
        <span onClick={() => movePlayhead && movePlayhead(Math.min(53.05, currentTime + 5))} title="Step Forward">▶▶</span>
        <span onClick={() => movePlayhead && movePlayhead(53.05)} title="Last Frame">⏭</span>
      </div>
    </div>
  );
}
