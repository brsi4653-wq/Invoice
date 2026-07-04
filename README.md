# Need An Invoice By: SHIPS 🚀

A highly professional, fast, and responsive React + Tailwind CSS client-side invoice generator optimized for creators, freelancers, and independent studios. This application is structured to be completely **GitHub-ready** and supports zero-config deployment to **GitHub Pages**.

---

## 📖 Table of Contents
1. [Features](#-features)
2. [Local Development](#-local-development)
3. [Deploying to GitHub Pages (Automated Workflow)](#-deploying-to-github-pages-automated-workflow)
4. [Deploying to GitHub Pages (Manual)](#-deploying-to-github-pages-manual)
5. [Vite Configuration for Subdirectories](#-vite-configuration-for-subdirectories)

---

## ✨ Features
- **Prone to Privacy**: 100% client-side operation—your sensitive business data never leaves your browser.
- **Dynamic Previews**: Live responsive side-by-side editing pane.
- **Brandable Layouts**: Swiss, Editorial, and Modern templates with a fluid, aspect-ratio-corrected logo auto-scaling engine.
- **Line Modifier Tools**: Highly precise line discounting and custom subtotal-level global taxation.
- **PDF Generation**: High-resolution print-ready exports matching the selected aesthetic templates seamlessly.

---

## 💻 Local Development

To run the application locally on your machine, follow these simple steps:

### Prerequisite
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
To build the optimized static asset bundle:
```bash
npm run build
```
The compiled files will be located in the `dist/` directory, ready to be hosted on any static hosting provider.

---

## ⚡ Deploying to GitHub Pages (Automated Workflow)

This repository includes a pre-configured **GitHub Actions CI/CD workflow** that builds and deploys your application to GitHub Pages automatically whenever you push code to `main` or `master`.

### Step-by-Step GitHub Setup:

1. **Create a new, empty GitHub Repository** on [GitHub](https://github.com/new).
2. **Initialize Git and link your repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of GitHub-ready invoice creator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. **Enable GitHub Pages permissions**:
   - Go to your repository on GitHub.
   - Click on **Settings** ⚙️ -> **Pages** in the left sidebar.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").
4. **Trigger Deployment**:
   - Push any commit to the `main` or `master` branch, or go to the **Actions** tab on GitHub, select the **Deploy to GitHub Pages** workflow, and click **Run workflow**.
   - Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in minutes!

---

## 🛠️ Deploying to GitHub Pages (Manual)

If you prefer to deploy manually using the `gh-pages` package instead of GitHub Actions:

1. Install the deployment utility:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add the following scripts to your `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Set your homepage URL in `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```
4. Deploy the production bundle:
   ```bash
   npm run deploy
   ```

---

## ⚙️ Vite Configuration for Subdirectories

Vite normally builds applications with absolute asset path resolution (`/assets/`). This breaks on GitHub Pages because repositories are typically served from subdirectories (e.g., `/YOUR_REPO_NAME/`).

To solve this, we configured `vite.config.ts` to use relative asset path resolution:

```typescript
export default defineConfig(() => {
  return {
    base: './', // Ensures assets load correctly on local servers, custom domains, and subdirectories alike!
    // ...
  };
});
```

Now, your application will load flawlessly regardless of your GitHub repository's name or whether you use a custom domain.
