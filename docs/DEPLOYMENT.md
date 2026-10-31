# Publish to GitHub Pages

The site is static and needs no build. Publish the repository root from the `main` branch.

## GitHub website method

1. Sign in to GitHub and create a new **public** repository named `travelbloom` (or another available name).
2. Upload the **contents** of this project folder, including `index.html`, the other pages, `assets`, the JSON data, and `.nojekyll`. Do not upload only the ZIP archive or an extra containing folder. GitHub's file picker may hide dotfiles; create `.nojekyll` through **Add file → Create new file** if needed.
3. Save the files in a focused commit on `main`.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select **main** and **/(root)**, then select **Save**.
7. Wait for the Pages deployment in **Actions** to finish successfully.
8. Copy the exact live URL shown in **Settings → Pages**. Test Home, About Us, Contact Us, and the three search categories.

## GitHub CLI method

Only run commit and push commands after explicitly authorizing them under your working agreement. From the project folder:

```sh
gh auth login --hostname github.com --git-protocol https --web
git init -b main
git add .
git diff --cached --check
git diff --cached --stat
git commit -m "feat: create TravelBloom travel recommendation website"
gh repo create travelbloom --public --source . --remote origin
git push -u origin main
```

Then enable branch deployment using the website steps above. Alternatively, replace `OWNER` and `REPOSITORY` and run:

```sh
gh api --method POST repos/OWNER/REPOSITORY/pages -f 'source[branch]=main' -f 'source[path]=/'
gh api repos/OWNER/REPOSITORY/pages
```

If Pages is already enabled, inspect its configuration before making changes. Do not overwrite an unrelated existing repository or force-push. If a repository name is taken, choose a different available name and use the URL returned by GitHub.

## Two different submission URLs

- Repository: `https://github.com/OWNER/REPOSITORY`
- Live website: use the verified URL from Pages settings, typically `https://OWNER.github.io/REPOSITORY/`.

These are URL patterns, not evidence of a completed deployment. Keep the `https://` prefix in both submission fields.

## Troubleshooting

- **404:** confirm Pages has deployed successfully and `index.html` is in the selected root. Use the repository path in the URL.
- **Images or data missing:** confirm the complete `assets` directory and JSON file were uploaded with the exact capitalization.
- **Search fails locally:** run an HTTP server instead of opening `file://` URLs.
- **CLI login appears invalid:** check network access, then run `gh auth status` and reauthenticate when required. Never paste a token into the source code or commit it.

Reference: [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
