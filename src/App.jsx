import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProjectBin from './components/ProjectBin';
import ProgramMonitor from './components/ProgramMonitor';
import PropertiesPanel from './components/PropertiesPanel';
import Timeline from './components/Timeline';
import './App.css';

const clipDurations = [2.53, 1.10, 0.20, 3.03, 1.60, 1.80, 4.00, 3.83, 2.43, 1.83, 1.53, 4.43, 1.53, 7.40, 1.97, 0.50, 0.53, 1.63, 2.60, 5.60, 3.00];

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGraphicPanelOpen, setIsGraphicPanelOpen] = useState(false);

  const [graphicConfig, setGraphicConfig] = useState({
    text: '',
    font: 'monospace',
    isBold: true,
    isItalic: false,
    alignment: 'center',
    mode: null,
    fillOutColor: '#AA0101',
    fillInColor: '#ffffff'
  });

  const [v2Clips, setV2Clips] = useState([]);

  // Exposes graphic config + panel-open state to the parent marketing page's
  // guided demo script, so it can snapshot state before a step and restore it
  // on an undo (Cmd+Z or the Undo button) — this app has no undo/redo history
  // of its own, so the demo script owns the one-level-deep snapshot instead.
  useEffect(() => {
    window.__heroGetGraphicConfig = () => graphicConfig;
    window.__heroSetGraphicConfig = (cfg) => setGraphicConfig(cfg);
    window.__heroGetIsGraphicPanelOpen = () => isGraphicPanelOpen;
    window.__heroSetIsGraphicPanelOpen = (open) => setIsGraphicPanelOpen(open);
    window.__heroGetV2Clips = () => v2Clips;
    window.__heroSetV2Clips = (clips) => setV2Clips(clips);
  }, [graphicConfig, isGraphicPanelOpen, v2Clips]);

  // Video Playback Loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 53.05) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.05;
        });
      }, 50);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleScrub = (sec) => {
    setCurrentTime(sec);
  };

  const handleOpenGraphicPanel = () => {
    setIsGraphicPanelOpen(true);
  };

  const handleCloseGraphicPanel = () => {
    setIsGraphicPanelOpen(false);
  };

  const handleAddGraphicToTimeline = () => {
    const newClipColor = graphicConfig.mode === 'fillOut' ? graphicConfig.fillOutColor : graphicConfig.fillInColor;
    
    // Find clip at current playhead position or default to the first clip (clip 01: 0s → 2.53s)
    let startTime = 0;
    let targetStart = 0;
    let targetDur = clipDurations[0]; // 2.53s for clip 01

    for (let i = 0; i < clipDurations.length; i++) {
      const dur = clipDurations[i];
      if (currentTime >= startTime && currentTime < startTime + dur) {
        targetStart = startTime;
        targetDur = dur;
        break;
      }
      startTime += dur;
    }

    const newClip = {
      id: Date.now().toString(),
      text: graphicConfig.text || 'SHIPPED',
      font: graphicConfig.font,
      isBold: graphicConfig.isBold,
      isItalic: graphicConfig.isItalic,
      mode: graphicConfig.mode,
      color: newClipColor,
      startSec: targetStart,
      durSec: targetDur
    };

    setV2Clips(prev => [...prev, newClip]);
  };

  // Evaluate active graphic for monitor overlay
  const activeGraphic = v2Clips.find(c => currentTime >= c.startSec && currentTime < c.startSec + c.durSec);

  // Timecode formatter
  const fmtTC = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * 30);
    const pad = (n) => (n < 10 ? '0' : '') + n;
    return `00:${pad(m)}:${pad(s)}:${pad(f)}`;
  };

  return (
    <div className="app-container">
      <Header />

      <main className="app-workspace">
        {/* Main Central Workspace */}
        <div className="main-content-area">
          {/* Top Split Area */}
          <div className="workspace-top">
            <ProjectBin />
            <ProgramMonitor
              currentTime={currentTime}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              activeGraphic={activeGraphic}
              formattedTimecode={fmtTC(currentTime)}
              movePlayhead={handleScrub}
            />
            <PropertiesPanel
              isOpen={isGraphicPanelOpen}
              openPanel={handleOpenGraphicPanel}
              closePanel={handleCloseGraphicPanel}
              config={graphicConfig}
              setConfig={setGraphicConfig}
              onAddGraphicToTimeline={handleAddGraphicToTimeline}
            />
          </div>

          {/* Bottom Timeline Area */}
          <div className="workspace-bottom">
            <Timeline
              currentTime={currentTime}
              onScrub={handleScrub}
              v2Clips={v2Clips}
              setV2Clips={setV2Clips}
            />
          </div>
        </div>

        {/* Far Right Vertical Audio VU Meters Strip */}
        <div className="right-meters-strip">
          <div className="meter-bar"></div>
          <div className="meter-bar"></div>
        </div>
      </main>
    </div>
  );
}
