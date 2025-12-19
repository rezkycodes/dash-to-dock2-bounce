# How to Upload to GitHub

Follow these steps to upload this extension to your GitHub account.

## 1. Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `dash-to-dock2-bounce`
3. Description: `GNOME Shell extension - Dash to Dock with macOS-style bounce animation`
4. Make it **Public** (so others can use it)
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

## 2. Push to GitHub

Run these commands in the terminal:

```bash
cd /home/rezkycodes/dash-to-dock2-bounce

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/dash-to-dock2-bounce.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 3. Update README.md

After pushing, update the README.md file on GitHub to replace:
- `YOUR_USERNAME` with your actual GitHub username in the clone URL

## 4. Add Topics (Optional but Recommended)

On your GitHub repository page:
1. Click ⚙️ settings icon next to "About"
2. Add topics:
   - `gnome-shell-extension`
   - `gnome-shell`
   - `dock`
   - `macos`
   - `bounce-animation`
   - `linux`
   - `fedora`
   - `ubuntu`

## 5. Create Release (Optional)

To create v1.0.0 release:

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Dash to Dock 2 - Bounce Edition v1.0.0`
5. Description: Copy from CHANGELOG.md
6. Click "Publish release"

## 6. Share with Others

Share your repository URL:
```
https://github.com/YOUR_USERNAME/dash-to-dock2-bounce
```

People can now install your extension!

---

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# Create new commit
git add .
git commit -m "Your commit message"
git push

# View history
git log --oneline

# Create new branch for development
git checkout -b feature/new-feature
```

---

**Good luck with your GitHub repository! 🚀**
