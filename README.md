# Dash to Dock 2 - Bounce Edition

Enhanced version of Dash to Dock with **16 macOS-style bounce animations** for GNOME Shell.

![License](https://img.shields.io/badge/license-GPL--2.0-blue.svg)
![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-45%2B-blue.svg)

## ✨ Features

- 🎯 **16 Bounce Animation Styles** - Multiple animation variations to choose from
- 🪟 **Windows 11 Hover Preview** - Auto-show window thumbnails on hover (2 second delay)
- 🎨 **Customizable in GUI** - Easy selection from GNOME Extensions preferences
- 🚫 **Anti-Spam Protection** - Debouncing prevents animation bugs
- 🎛️ **Top-Level Clone Technique** - Icons bounce above all UI elements, never clipped
- 💎 **Smooth 60fps Performance** - Optimized animations with easing functions
- 🔧 **All Original Features** - Based on Dash to Dock with all its features intact

## 🎬 Animation Styles

Choose from 16 different bounce animations:

1. **Default (None)** - No animation
2. **Bounce (macOS)** - Classic macOS dock bounce with 3 bounces (dash2dock-lite compatible)
3. **Bounce Once (Quick)** - Single fast bounce for quick feedback
4. **Elastic (Overshoot)** - Spring-like overshoot effect
5. **Jelly (Squash & Stretch)** - Cartoon-style squash and stretch
6. **Pop (Scale)** - Quick scale pop effect
7. **Rubber Band (Stretch)** - Horizontal/vertical stretch
8. **Wobble (Shake)** - Side-to-side wobble with bounce
9. **Heartbeat (Pulse)** - Double pulse like a heartbeat
10. **Swing (Pendulum)** - Pendulum swing motion
11. **Flip (3D Rotate)** - Rotation with bounce
12. **Pulse (Glow)** - Scale pulse effect
13. **Shake (Vibrate)** - Rapid vibration shake
14. **Trampoline (High Jump)** - Super high bounce like a trampoline
15. **Twist (Spin)** - 720° rotation with bounce
16. **Drop (Fall In)** - Drop from above with bounce

## 🪟 Windows 11 Style Hover Preview

**NEW FEATURE!** Auto-show window previews when hovering over app icons - just like Windows 11 taskbar!

### How it Works:
1. Hover your mouse over any app icon with open windows
2. Wait for configured delay (default 2 seconds)
3. Window thumbnail previews automatically appear above the icon
4. Move mouse away to close the preview

### Configuration:
- **Enable/Disable**: Toggle in extension preferences
- **Hover Delay**: Adjust from 500ms to 5000ms (default: 2000ms / 2 seconds)
- **Seamless Integration**: Works with all 16 bounce animations!

### Benefits:
- ✅ **No right-click needed** - Automatic on hover
- ✅ **Quick window switching** - See all windows before clicking
- ✅ **Familiar UX** - Works like Windows 11 taskbar
- ✅ **Configurable delay** - Adjust to your preference

## 🎯 Technical Highlights

### Clone at Top-Level Layer
- Icons bounce using a **clone actor** at `Main.layoutManager.uiGroup`
- Ensures animations are **never clipped** by dock, panels, or windows
- Same technique used by GNOME notifications and OSD popups

### Only Icon Bounces
- Clone created from `icon._iconBin` (pure icon image)
- **No hover background** during animation
- Clean, professional appearance like macOS

### Easing Functions
- **Linear.easeNone** for rise phase
- **Bounce.easeOut** for fall phase  
- Compatible with dash2dock-lite animation system

## 📦 Installation

### Method 1: Manual Installation

1. Download this repository:
```bash
git clone https://github.com/YOUR_USERNAME/dash-to-dock2-bounce.git
cd dash-to-dock2-bounce
```

2. Copy to GNOME extensions folder:
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom
cp -r * ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/
```

3. Compile the schema:
```bash
glib-compile-schemas ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/schemas/
```

4. Restart GNOME Shell:
   - **X11:** Press `Alt+F2`, type `r`, press Enter
   - **Wayland:** Logout and login again

5. Enable the extension:
```bash
gnome-extensions enable dash-to-dock2@custom
```

### Method 2: Quick Install Script

```bash
./install.sh
```

## 🎮 Usage

1. Open Extension Settings:
```bash
gnome-extensions prefs dash-to-dock2@custom
```

2. Navigate to the **Behavior** tab

3. Find **"Click animation"** setting

4. Choose your preferred animation style from the dropdown (16 options!)

5. Click any icon in the dock to see the animation

## ⚙️ Settings

- **Click animation style**: Choose from 16 animation types
- All original Dash to Dock settings are preserved

## 🔧 Configuration via Terminal

```bash
# Enable bounce animation
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/schemas \
  set org.gnome.shell.extensions.dash-to-dock2 click-animation-style 'BOUNCE'

# Try elastic animation
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/schemas \
  set org.gnome.shell.extensions.dash-to-dock2 click-animation-style 'ELASTIC'

# Disable animation
gsettings --schemadir ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/schemas \
  set org.gnome.shell.extensions.dash-to-dock2 click-animation-style 'DEFAULT'
```

## 🛠️ Technical Details

### Animation Specifications

- **Duration:** 800ms - 3000ms (depending on style)
- **Frame Rate:** 60fps
- **Clone Technique:** Top-level UI layer
- **Easing:** Custom keyframes with smooth interpolation
- **Anti-spam:** 100ms debounce between animations

### Key Files Modified

- `bounceAnimation.js` - 16 animation implementations with easing functions
- `appIcons.js` - Integration with icon click, clone only icon image
- `Settings.ui` - GUI dropdown with 16 animation choices
- `prefs.js` - Settings binding
- `schemas/org.gnome.shell.extensions.dash-to-dock2.gschema.xml` - Enum with 16 values
- `dash.js` - Disabled clipping on containers
- `docking.js` - Disabled manual clipping
- `stylesheet.css` - CSS overrides to prevent clipping

### Why No Clipping Issues?

Unlike traditional implementations that struggle with container clipping:

1. **Clone at Top Level** - `Main.layoutManager.uiGroup` is above everything
2. **Disabled Manual Clipping** - Removed `child.set_clip()` in DashSlideContainer
3. **CSS Overrides** - Force `-st-clip-to-allocation: false !important`
4. **All Container Levels** - Disabled clipping on: dash, dashContainer, boxContainer, scrollView, dockBox

## 🐛 Troubleshooting

**Extension shows ERROR state:**
1. Make sure schema is compiled:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/dash-to-dock2@custom/schemas/
   ```
2. Restart GNOME Shell
3. Re-enable the extension

**Animation doesn't appear:**
1. Check if animation is set to a style other than DEFAULT
2. Restart GNOME Shell (logout/login or `Alt+F2` → `r`)
3. Check logs: `journalctl --user -b | grep dash-to-dock2`

**Animation is clipped/cut off:**
- Should not happen with this version! If it does:
- Make sure you're using the latest version
- Restart GNOME Shell fully (logout/login)

**Icons don't show:**
1. Disable original dash-to-dock if running
2. Only run one dock extension at a time

## 📝 Credits

- **Original Extension:** [Dash to Dock](https://github.com/micheleg/dash-to-dock) by micxgx@gmail.com
- **Bounce Animation:** Custom implementation with 16 variations
- **Easing Functions:** Compatible with dash2dock-lite
- **Clone Technique:** Inspired by GNOME Shell notification system
- **Modified by:** rezkycodes

## 📄 License

This extension is licensed under GPL-2.0, same as the original Dash to Dock.

See [COPYING](COPYING) for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new animation styles
- Submit pull requests
- Share your favorite animation on social media!

## 🔗 Links

- Original Dash to Dock: https://micheleg.github.io/dash-to-dock/
- GNOME Extensions: https://extensions.gnome.org/

---

**Enjoy your customizable bounce animations on GNOME! 🚀**

*Try all 16 styles and find your favorite!*
