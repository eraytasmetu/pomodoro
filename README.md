# Pomodoro Soft 🍅✨

A striking, modern Pomodoro timer desktop application designed for macOS. 
Features a beautiful "Soft Theme" with pastel colors, neumorphic/glassmorphic UI, customizable AI-generated abstract backgrounds (Original, Mint, Sunset, Night), and pleasant Web Audio API notification chimes.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and `npm` installed on your machine.
This app uses [Electron](https://www.electronjs.org/) and is configured to build for macOS.

## 🚀 Getting Started

If you want to pull this repository and run or build the app yourself, follow these commands in order:

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd pomodoro
```
*(Make sure to replace `<YOUR_GITHUB_REPO_URL>` with the actual link to this repository)*

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
To start the app natively without building it (great for testing or making UI changes):
```bash
npm start
```

### 4. Build the Standalone App (.dmg)
If you want to package the app into a standalone `.app` and `.dmg` installer so you can open it directly without terminal:
```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run build
```
> **Note:** We prefix the build command with `CSC_IDENTITY_AUTO_DISCOVERY=false` to bypass the Apple Developer Code Signing requirement. This allows anyone to build and package the app for free without a $99/year Apple Developer account!

Once the build is complete, navigate to the `dist/` folder. There you will find your nice and ready `Pomodoro Soft.dmg` file!

## 🍏 How to run the un-signed .dmg on Mac

If you share the `.dmg` file with friends, macOS will likely block it at first because it does not have a paid Apple Developer Signature. Tell them to follow these exact steps:

1. Double-click the `.dmg` file to mount it.
2. Drag and drop **Pomodoro Soft.app** into their **Applications** folder.
3. Go to the Applications folder, **Right-Click** (or `Control` + Click) on **Pomodoro Soft.app** and select **Open**.
4. A warning dialog will appear. Click the **Open** button anyway. (From now on, they can open it normally by just double-clicking).

**Granting Permanent Permission / Fixing "App is damaged" error:**
If macOS flags the downloaded app as "damaged" or you just want to permanently bypass the "Right-Click -> Open" requirement, you can remove the Apple Quarantine attribute. Open your Terminal and run this exact command:
```bash
xattr -cr "/Applications/Pomodoro Soft.app"
```
*(After running this once, the app will open normally with a double-click forever!)*
