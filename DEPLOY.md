# Deploying xlam HUB to GitHub Pages

## Prerequisites

- A GitHub account
- Git installed locally
- Node.js 20+ and npm installed

## Step 1 — Create the repository

1. Go to [github.com/new](https://github.com/new).
2. Name the repository `<your-username>.github.io` (this gives you a free custom domain at `https://<your-username>.github.io`).
   - For a project page you can name it anything (e.g. `xlam-hub`) and the URL will be `https://<your-username>.github.io/<repo>/`.
3. Keep it **public** (required for GitHub Pages).
4. **Do not** check "Add README", "Add .gitignore", or "Choose a license" — we'll bring our own.
5. Click **Create repository**.

## Step 2 — Push the code

```bash
# Clone the empty repo (replace with your actual URL)
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Copy all project files in (adjust paths as needed)
cp -r /path/to/xlam-hub/* .

# Stage, commit, and push
git add .
git commit -m "Initial commit — xlam HUB"
git push origin main
```

## Step 3 — Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Source**, select **GitHub Actions**.
4. That's it — GitHub Pages is now configured to use the workflow in `.github/workflows/deploy.yml`.

## How the deploy workflow works

The file `.github/workflows/deploy.yml` does the following:

| Job        | What it does                                                     |
|------------|------------------------------------------------------------------|
| `build`    | Checks out code, installs Node 22 + npm, runs `npm ci` then `npm run build` (TypeScript check + Vite bundle), uploads the `dist/` directory as an artifact. |
| `deploy`   | After `build` succeeds, deploys the artifact to GitHub Pages using `actions/deploy-pages@v4`. |

The `base: './'` in `vite.config.ts` ensures the bundle works at **any** path — both `<user>.github.io` and project pages at `<user>.github.io/<repo>/`.

### Triggers

- **On push to `main`** — every push automatically triggers a deploy.
- **Manual trigger** — go to Actions → Deploy → Run workflow to deploy manually.

## Step 4 — Verify the deploy

After pushing, go to **Actions** → **Deploy to GitHub Pages**. You should see a green checkmark once the workflow completes.

Visit `https://<your-username>.github.io` (or `https://<your-username>.github.io/<repo>/` for project pages).

## Custom domain (optional)

If you own a domain and want to use it:

1. In **Settings → Pages → Custom domain**, enter your domain.
2. Add a `CNAME` file with your domain to the repo root:
   ```
   yourdomain.com
   ```
3. Commit and push — GitHub will provision the SSL certificate automatically (takes a few minutes).
4. In your domain registrar's DNS settings, add a CNAME record pointing to `<your-username>.github.io`.

## Local preview

Before pushing, preview locally:

```bash
npm run build
npm run preview
```

This starts a local server on `http://localhost:4173`.

## Troubleshooting

- **404 on pages** — make sure `base: './'` is set in `vite.config.ts` (it already is).
- **Blank page** — check the browser console for errors. The build step (`npm run build`) catches TypeScript errors before deploy.
- **Old version showing** — clear your browser cache or do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R).
- **Workflow stuck** — go to Actions → your workflow run → check the logs for errors.
