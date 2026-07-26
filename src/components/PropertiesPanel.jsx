import React from 'react';

export default function PropertiesPanel({
  isOpen,
  openPanel,
  closePanel,
  config,
  setConfig,
  onAddGraphicToTimeline
}) {
  const { text, font, isBold, isItalic, mode, fillOutColor, fillInColor, alignment } = config;

  const handleModeToggle = (selectedMode) => {
    setConfig(prev => ({
      ...prev,
      mode: selectedMode
    }));
  };

  const handleColorChange = (colorType, newColor) => {
    setConfig(prev => ({
      ...prev,
      [colorType]: newColor,
      mode: colorType === 'fillOutColor' ? 'fillOut' : 'fillIn'
    }));
  };

  const activeColor = mode === 'fillOut' ? fillOutColor : fillInColor;

  // Shrinks the mini-preview text to fit as the typed overlay text gets
  // longer, instead of overflowing the fixed-size preview box/viewBox.
  const previewText = text || 'SHIPPING';
  const previewFontSize = Math.max(8, Math.min(20, 180 / (previewText.length * 0.6)));

  return (
    <div className="panel panel-props">
      <div className="panel-hd">
        <span className="active">Properties</span>
        <span>Effect Controls</span>
        <span>Lumetri</span>
      </div>

      {!isOpen ? (
        /* Default View */
        <div className="props-body" id="props-default-view">
          <div className="props-clip">🎬 4V8PYzxEurVcxOqM</div>
          <div className="props-placeholder">
            Select a clip in the timeline<br />to view properties.
          </div>
          <button className="props-btn primary-btn" onClick={openPanel}>
            Create new graphic
          </button>
        </div>
      ) : (
        /* New Graphic Customization View */
        <div className="props-body graphic-view">
          <div className="graphic-form-content">
            {/* Header */}
            <div className="panel-subhead">
              <span className="title">New Graphic</span>
              <button className="close-btn" onClick={closePanel}>✕</button>
            </div>

            {/* Type Selector (Text / Shape) */}
            <div className="type-selector">
              <button className="type-btn active">T Text</button>
              <button className="type-btn">⬚ Shape</button>
            </div>

            {/* Live Mini-Preview Panel */}
            <div className="mini-preview-container">
              <div className="mini-preview-box">
                {mode === 'fillOut' ? (
                  <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
                    <defs>
                      <mask id="mini-preview-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <text
                          x="50%"
                          y="54%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontFamily={font}
                          fontWeight={isBold ? 'bold' : 'normal'}
                          fontStyle={isItalic ? 'italic' : 'normal'}
                          fontSize={previewFontSize}
                          fill="black"
                        >
                          {previewText}
                        </text>
                      </mask>
                    </defs>
                    <rect width="100%" height="100%" fill={fillOutColor} mask="url(#mini-preview-mask)" rx="4" />
                  </svg>
                ) : (
                  <span
                    className="mini-preview-text"
                    style={{
                      fontFamily: font,
                      fontWeight: isBold ? 'bold' : 'normal',
                      fontStyle: isItalic ? 'italic' : 'normal',
                      color: fillInColor,
                      textAlign: alignment,
                      fontSize: (previewFontSize * 1.1) + 'px'
                    }}
                  >
                    {previewText}
                  </span>
                )}
              </div>
            </div>

            {/* Controls Form */}
            <div className="controls-form">
              {/* Text Input */}
              <div className="form-row">
                <input
                  type="text"
                  className="text-input"
                  value={text}
                  onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                  placeholder='type "shipping" here'
                />
              </div>

              {/* Font & Formatting Line */}
              <div className="form-row font-line">
                <select
                  className="font-select"
                  value={font}
                  onChange={(e) => setConfig(prev => ({ ...prev, font: e.target.value }))}
                >
                  <option value="sans-serif">Inter / Sans</option>
                  <option value="serif">Georgia / Serif</option>
                  <option value="monospace">Courier / Mono</option>
                  <option value="Impact">Impact / Heavy</option>
                  <option value="'Outfit', sans-serif">Outfit</option>
                </select>

                <button
                  className={`fmt-btn ${isBold ? 'active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, isBold: !prev.isBold }))}
                >
                  B
                </button>
                <button
                  className={`fmt-btn ${isItalic ? 'active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, isItalic: !prev.isItalic }))}
                >
                  I
                </button>
                <button
                  className={`fmt-btn ${alignment === 'left' ? 'active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, alignment: 'left' }))}
                >
                  ≡
                </button>
                <button
                  className={`fmt-btn ${alignment === 'center' ? 'active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, alignment: 'center' }))}
                >
                  ≡
                </button>
                <button
                  className={`fmt-btn ${alignment === 'right' ? 'active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, alignment: 'right' }))}
                >
                  ≡
                </button>
              </div>

              {/* Appearance Cards */}
              <div className="appearance-section">
                <div className="section-title">APPEARANCE</div>
                <div className="appearance-cards">
                  {/* Fill In Card */}
                  <div
                    className={`card ${mode === 'fillIn' ? 'active' : ''}`}
                    onClick={() => handleModeToggle('fillIn')}
                  >
                    <span>Fill In</span>
                    <div className="swatch" style={{ backgroundColor: fillInColor }}>
                      <input
                        type="color"
                        value={fillInColor}
                        onChange={(e) => handleColorChange('fillInColor', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Fill Out Card */}
                  <div
                    className={`card ${mode === 'fillOut' ? 'active' : ''}`}
                    onClick={() => handleModeToggle('fillOut')}
                  >
                    <span>Fill Out</span>
                    <div className="swatch" style={{ backgroundColor: fillOutColor }}>
                      <input
                        type="color"
                        value={fillOutColor}
                        onChange={(e) => handleColorChange('fillOutColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Timeline Action Button */}
          <div className="add-graphic-footer">
            <button className="add-graphic-btn" onClick={onAddGraphicToTimeline}>
              Add Graphic to Timeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
