import React from 'react';

export default function ProjectBin() {
  return (
    <div className="panel panel-bin">
      <div className="panel-hd">
        <span className="active">Project: hey clicky</span>
      </div>
      <div className="bin-toolbar">
        <input type="text" placeholder="🔍 search bin" className="bin-search" readOnly value="🔍 search bin" />
        <span className="bin-count">1 of 2 items selected</span>
      </div>
      <div className="bin-grid">
        <div className="bin-tile sel">
          <div className="thumb video-thumb">
            <video src="/4V8PYzxEurVcxOqM.mp4#t=0.5" muted preload="metadata" />
          </div>
          <div className="name">4V8PYzxEurVcxOqM.mp4</div>
        </div>
        <div className="bin-tile">
          <div className="thumb video-thumb">
            <video src="/4V8PYzxEurVcxOqM.mp4#t=3.5" muted preload="metadata" />
          </div>
          <div className="name">4V8PYzxEurVcxOqM</div>
        </div>
      </div>
    </div>
  );
}
