# GitHub Pages Deployment

This repository uses an automated GitHub Pages deployment workflow that activates whenever changes are pushed to the `main` branch.

## How it Works

The deployment workflow (`.github/workflows/deploy.yml`) will:

1. **Checkout** the repository code
2. **Setup Node.js** environment with dependency caching
3. **Install dependencies** using `npm ci`
4. **Build** the project (currently optimized for static files)
5. **Deploy** to GitHub Pages using `peaceiris/actions-gh-pages@v4`

## Static Files Deployed

The workflow deploys the root directory containing:
- `index.html` - Main landing page
- `README.md` - Project documentation
- `rapidapi_example.js` - Node.js example
- `rapidapi_example.py` - Python example
- Other static assets

## Manual Deployment

You can also trigger deployments manually:
1. Go to the **Actions** tab in your GitHub repository
2. Select the **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"**
4. Select the branch and click **"Run workflow"**

## Adding Build Steps

To add custom build steps, edit the **Build** step in `.github/workflows/deploy.yml`:

```yaml
- name: Build
  run: |
    # Add your build commands here
    npm install
    npm run build
    echo "Build step completed - static files ready for deployment"
```

## Customizing Deployment Directory

To deploy a specific directory (like `./dist` or `./docs`), update the `publish_dir` parameter:

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist  # Change this to your build output directory
```

## Workflow Features

- ✅ **Automatic deployment** on push to main branch
- ✅ **Manual deployment** via workflow_dispatch
- ✅ **Concurrency control** to prevent deployment conflicts
- ✅ **Proper permissions** for GitHub Pages
- ✅ **Node.js support** with dependency caching
- ✅ **Extensible build process** with commented examples

## Troubleshooting

If deployment fails:
1. Check the **Actions** tab for error logs
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the default branch is set to `main`
4. Check that `GITHUB_TOKEN` has proper permissions

## Repository Settings

Make sure GitHub Pages is configured in your repository:
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** (created automatically by the workflow)
4. Folder: **/ (root)**