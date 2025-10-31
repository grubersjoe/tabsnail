# Tabsnail 🐌

[![CI](https://github.com/grubersjoe/tabsnail/actions/workflows/test.yml/badge.svg)](https://github.com/grubersjoe/tabsnail/actions/workflows/test.yml)

This project is a **work in progress** to bring [Fiona's](https://runjak.codes/) brilliant idea to
life: display your web browser's tab bar in a snail-like layout around the page. The more tabs you
have open, the bigger the snail grows!

![Screenshot](tabsnail.png)

Licensed under the
[Non-White-Heterosexual-Male License](https://nonwhiteheterosexualmalelicense.org).

## TODO

- [x] Show all tabs in snail form
- [x] Navigation
- [x] Close tabs
- [ ] Shrink website viewport to inner snail bounds
- [x] Update layout on viewport changes
- [x] Configurable tab size
- [ ] [Themes](https://www.instagram.com/p/DMdTtUJpaxi)
  - [x] default (striped) with color setting
  - [ ] Windows 95
  - [ ] Leopard Slug
  - [ ] Pacific Banana Slug
  - [ ] Red Slug
  - [ ] Sea Slug
  - [ ] Carpathian Blue Slug
  - [ ] Yellow Slug?
- [ ] Visualize tab groups?

## Development

To start development mode (with automatic rebuilds):

```shell
pnpm install
pnpm dev
```

Then, enable the extension in Chrome by loading the `./build` folder as an
[unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
After making changes, reload the extension either via its popup or from the `chrome://extensions`
page. For convenience, consider installing another
[extension](https://chromewebstore.google.com/detail/reload-all-tabs/midkcinmplflbiflboepnahkboeonkam)
that reloads all tabs to refresh the Tabsnail everywhere.

To build in production mode:

```shell
pnpm build
```
