# Matt Ferguson Portfolio

Static portfolio site for [matferg.com](https://matferg.com/), based on the
HTML5 UP Massively template.

## Development

The site uses plain HTML, Sass/CSS, and JavaScript. `index.html` is the main
page. Portfolio-specific Sass is in
`assets/sass/layout/_portfolio.scss`; `assets/css/portfolio.css` is its
compiled counterpart served by GitHub Pages alongside the template's
`assets/css/main.css`.

When changing template Sass, compile `assets/sass/main.scss` to
`assets/css/main.css`. When changing portfolio styles, compile
`assets/sass/layout/_portfolio.scss` to `assets/css/portfolio.css`. Commit
both source and compiled files.

## Deployment

Push the production files to the repository's `main` branch. GitHub Pages
serves the repository root, and `CNAME` configures the custom domain.
