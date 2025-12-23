# Changelog

All notable changes to Dash to Dock 2 - Bounce Edition will be documented in this file.

## [2.1.0] - 2025-12-23

### Added - Windows 11 Hover Preview! 🪟
- 🪟 **Windows 11 Style Hover Preview** - Auto-show window thumbnails on hover
- ⏱️ **Configurable Delay** - Adjust hover timeout (500-5000ms, default 2000ms)
- 🎛️ **GUI Toggle** - Enable/disable in preferences with switch
- 🎯 **Smart Detection** - Only shows preview for apps with running windows
- 🔄 **Auto-close** - Preview closes when mouse leaves icon
- 🎨 **Seamless Integration** - Works perfectly with all 16 bounce animations

### Technical - Hover Preview Implementation
- ➕ **Added `preview-on-hover` setting** - Boolean to enable/disable feature
- ➕ **Added `preview-hover-timeout` setting** - Integer for delay in milliseconds
- 🔧 **Hover event handler** - `notify::hover` connection in appIcons.js
- ⏲️ **GLib timeout** - Scheduled preview display after delay
- 🧹 **Proper cleanup** - Timeout removed on destroy and mouse leave
- 📋 **Settings UI** - New frame in Settings.ui with switch and spinbutton

### Modified Files
- `appIcons.js` - Added hover event handlers and preview timeout logic
- `Settings.ui` - Added preview hover settings frame with switch and delay spinner
- `prefs.js` - Bound new settings to UI controls
- `schemas/gschema.xml` - Added preview-on-hover and preview-hover-timeout keys

---

## [2.0.0] - 2024-12-19

### Added - 16 Animation Styles! 🎉
- ✨ **15 new animation variations** (total 16 including original bounce)
- 🎨 **GUI dropdown selection** - Choose your favorite style easily
- 🎯 **Top-level clone technique** - Icons never clipped, always visible
- 📋 **Animation styles:**
  1. Default (None) - No animation
  2. Bounce (macOS) - Classic 3-bounce with dash2dock-lite easing
  3. Bounce Once (Quick) - Single fast bounce
  4. Elastic (Overshoot) - Spring overshoot effect
  5. Jelly (Squash & Stretch) - Cartoon squash
  6. Pop (Scale) - Quick pop
  7. Rubber Band (Stretch) - Horizontal/vertical stretch
  8. Wobble (Shake) - Side-to-side wobble
  9. Heartbeat (Pulse) - Double pulse
  10. Swing (Pendulum) - Pendulum swing
  11. Flip (3D Rotate) - Rotation bounce
  12. Pulse (Glow) - Scale pulse
  13. Shake (Vibrate) - Rapid shake
  14. Trampoline (High Jump) - Super high bounce
  15. Twist (Spin) - 720° rotation
  16. Drop (Fall In) - Drop from above

### Enhanced - Clone Architecture
- 🔧 **Clone from `icon._iconBin`** - Only icon image bounces, not hover background
- 🚀 **Added to `Main.layoutManager.uiGroup`** - Top-level UI layer
- 💯 **Always visible** - Never clipped by panels, dock, or windows
- 🎭 **Original icon hidden** during animation (opacity=0)
- ✨ **Clean restoration** after animation completes

### Fixed - Clipping Issues
- 🔨 **Removed manual clipping** in `DashSlideContainer.allocate()`
- 🎨 **CSS overrides** with `!important` to defeat theme restrictions
- 📦 **Disabled clipping** on all container levels:
  - `dash._dashContainer`
  - `dash._scrollView`
  - `dash._boxContainer`
  - `dash._box`
  - `docking._box`
  - `DashSlideContainer`
- 🎯 **Works with WhiteSur theme** and other restrictive themes

### Technical - Easing Functions
- ➕ **Added `Linear.easeNone`** - For rise phase
- ➕ **Added `Bounce.easeOut`** - For fall phase (dash2dock-lite compatible)
- ➕ **Added `Back.easeOut`** - For elastic animations
- 🎬 **Smooth interpolation** with cubic easing for custom keyframes
- ⚡ **60fps animations** - 16ms frame time

### Modified Files
- `bounceAnimation.js` - Complete rewrite with 16 styles + easing functions
- `appIcons.js` - Clone only `icon._iconBin`, hide original during animation
- `Settings.ui` - Dropdown with 16 animation choices
- `schemas/org.gnome.shell.extensions.dash-to-dock2.gschema.xml` - Enum with 16 values
- `dash.js` - Added `clip_to_allocation: false` to containers
- `docking.js` - Commented out `child.set_clip()`, added `clip_to_allocation: false`
- `stylesheet.css` - CSS overrides for clipping with `!important`

---

## [1.0.0] - 2024-12-18

### Added
- ✨ macOS-style bounce animation on icon click
- 🎛️ GUI settings for animation style (Default/Bounce)
- 🚫 Anti-spam debouncing (100ms) to prevent animation glitches
- 📖 Comprehensive README with installation instructions
- 🛠️ Installation and uninstallation scripts
- ⚙️ GSettings schema for animation preferences
- 🎨 Smooth 60fps animation with custom keyframes
- 📝 Added `bounceAnimation.js` - Core animation implementation

### Modified
- 🔧 Updated `appIcons.js` to integrate bounce animation
- 🎨 Modified `Settings.ui` to add animation controls
- ⚙️ Extended `prefs.js` for settings binding
- 📋 Updated `metadata.json` with new extension info
- 📄 Extended `gschema.xml` with animation settings

### Technical Details
- Animation duration: 1.2 seconds
- Bounce height: 90% of icon size
- 3 bounces with decreasing heights (100% → 33% → 15%)
- Smooth interpolation with cubic easing
- Only icon bounces (background stays in place)

### Based On
- Dash to Dock v102 by micxgx@gmail.com
- GNOME Shell 45+ compatible

---

## Version Comparison

### v1.0.0
- ✅ 1 bounce animation style
- ✅ Basic animation within dock bounds
- ⚠️ Could be clipped by dock/theme

### v2.0.0 (Current)
- ✅ **16 animation styles**
- ✅ **Top-level clone** - never clipped
- ✅ **Only icon bounces** - no hover background
- ✅ **dash2dock-lite easing** compatibility
- ✅ **Works with all themes**
- ✅ **GUI selection** dropdown
- ✅ **60fps smooth** animations

---

**Note:** This is a fork of the original Dash to Dock extension with added bounce animation features. All original features are preserved.
