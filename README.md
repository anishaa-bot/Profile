# Anisha Anilkumar — Portfolio

A single-page personal portfolio built with plain HTML, CSS and JavaScript. No build step, no dependencies, no subfolders.

## Files

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `index.html`  | Page content: about, experience, education, activities, contact |
| `style.css`   | Layout, colours (light and dark themes), responsive rules       |
| `script.js`   | Theme toggle, mobile menu, scroll effects, experience durations |
| `profile.jpg` | Portrait photo                                                  |

## Run it

Open `index.html` in a browser. That's all.

## Publish it (GitHub Pages)

1. Create a new repository on GitHub and push these files to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder, then save.

## Update it

- **New job:** add an `<li class="job">` to the timeline in `index.html` with `data-start` and `data-end` dates (`YYYY-MM-DD`). Leave `data-end` empty for a current role. Durations and the total years of experience are worked out automatically.
- **Colours:** change the variables at the top of `style.css`.
- **Photo:** replace `profile.jpg` with another portrait (3:4 works best).
