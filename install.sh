#!/bin/bash
# Installation script for Dash to Dock 2 - Bounce Edition

set -e

echo "🚀 Installing Dash to Dock 2 - Bounce Edition..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running GNOME Shell
if ! command -v gnome-shell &> /dev/null; then
    echo -e "${RED}Error: GNOME Shell not found. This extension requires GNOME.${NC}"
    exit 1
fi

# Extension directory
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/dash-to-dock2@custom"

# Check if original dash-to-dock is running
if gnome-extensions info dash-to-dock@micxgx.gmail.com 2>/dev/null | grep -q "State: ACTIVE"; then
    echo -e "${YELLOW}Warning: Original Dash to Dock is currently active.${NC}"
    read -p "Do you want to disable it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gnome-extensions disable dash-to-dock@micxgx.gmail.com
        echo -e "${GREEN}✓ Original Dash to Dock disabled${NC}"
    fi
fi

# Create directory
echo "📁 Creating extension directory..."
mkdir -p "$EXT_DIR"

# Copy files
echo "📋 Copying extension files..."
cp -r ./* "$EXT_DIR/"

# Compile schema
echo "🔧 Compiling GSettings schema..."
glib-compile-schemas "$EXT_DIR/schemas/"

echo -e "${GREEN}✓ Files installed successfully${NC}"

# Enable extension
echo "🎯 Enabling extension..."
gnome-extensions enable dash-to-dock2@custom

# Check status
sleep 2
if gnome-extensions info dash-to-dock2@custom 2>/dev/null | grep -q "State: ACTIVE"; then
    echo -e "${GREEN}✓ Extension enabled successfully!${NC}"
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Restart GNOME Shell:"
    echo "      - X11: Press Alt+F2, type 'r', press Enter"
    echo "      - Wayland: Logout and login again"
    echo "   2. Configure animation in extension preferences:"
    echo "      gnome-extensions prefs dash-to-dock2@custom"
    echo ""
else
    echo -e "${YELLOW}⚠ Extension installed but may need GNOME Shell restart${NC}"
    echo ""
    echo "Please restart GNOME Shell:"
    echo "  - X11: Alt+F2 → type 'r' → Enter"
    echo "  - Wayland: Logout and login"
fi
