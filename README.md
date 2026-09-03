# BitMagic Documentation

This repo holds the documentation for the [BitMagic](https://bitmagic.org) website.

It is a static site built with Jekyll and hosted on GitHub Pages. Pushes to `main` are
built and deployed by `.github/workflows/jekyll-gh-pages.yml`.

## Local building

Using VSCode there is a task registered to serve the site locally with live reload.
Open the command palette, select `Tasks: Run Task`, then `Serve`, and open
<http://127.0.0.1:4000/>. Saving a file rebuilds and refreshes the browser.

To run it by hand:

```sh
bundle install
bundle exec jekyll serve --livereload
```

### Windows notes

- The `Serve` task is pinned to `powershell.exe` so it uses the Windows Ruby toolchain
  even if your default VSCode terminal is WSL.
- `--livereload` needs the `eventmachine` C extension. On current RubyInstaller
  (`x64-mingw-ucrt`) the prebuilt binary fails to load
  (`LoadError: 127: The specified procedure could not be found`). Rebuild it from source
  with the bundled MSYS2 toolchain:

  ```
  gem uninstall eventmachine -aIx
  ridk exec bundle install
  ```

## Style

`STYLE.md` defines the voice, page structure and conventions for the docs. Read it
before adding or rewriting a page. It is not published (listed under `exclude:` in
`_config.yml`).

## Base theme

Built on the [Hacker theme](https://github.com/pages-themes/hacker) for GitHub Pages,
with overrides in `_layouts/`, `_includes/`, `_data/nav.yml` and `assets/css/style.scss`.
