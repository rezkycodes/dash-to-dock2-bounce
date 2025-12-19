#!/bin/bash
# Uninstallation script for Dash to Dock 2 - Bounce Edition

set -e

echo "🗑️  Uninstalling Dash to Dock 2 - Bounce Edition..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Extension directory
EXT_DIR="$HOME/.local/share/gnome-shell/extensions/dash-to-dock2@custom"

# Check if extension exists
if [ ! -d "$EXT_DIR" ]; then
    echo -e "${YELLOW}Extension not found. Already uninstalled?${NC}"
    exit 0
fi

# Disable extension
echo "⏸️  Disabling extension..."
gnome-extensions disable dash-to-dock2@custom 2>/dev/null || true

# Remove directory
echo "🗑️  Removing extension files..."
rm -rf "$EXT_DIR"

echo -e "${GREEN}✓ Extension uninstalled successfully!${NC}"
echo ""
echo "To complete uninstallation, restart GNOME Shell:"
echo "  - X11: Alt+F2 → type 'r' → Enter"
echo "  - Wayland: Logout and login"
