# Tabsnail 🐌

[![CI](https://github.com/grubersjoe/tabsnail/actions/workflows/test.yml/badge.svg)](https://github.com/grubersjoe/tabsnail/actions/workflows/test.yml)

This project is a **work in progress** to bring [Fiona's](https://runjak.codes/) brilliant idea to
life: display your web browser's tab bar in a snail-like layout around the page. The more tabs you
have open, the bigger the snail grows!

Chrome and Firefox are currently supported. To use the extension, you need to build and install it
manually at the moment (see instructions below).

![Screenshot](tabsnail.jpg)

## Features

- 🐌 **Tab management** – Navigate between tabs and close them using the intuitive snail interface
- 😵‍💫 **Tab awareness** – Visual feedback that naturally discourages tab hoarding as the snail grows
- 💅 **Beautiful themes** – Pick your favorite snail color scheme
- 📏 **Customizable size** – Configure tab dimensions to fit your preference
- 🤓 **Smart viewport** – Automatically adjusts the viewport to fit the snail's inner bounds

## TODO

- [x] Migrate to [WXT](https://wxt.dev) for cross-browser support
- [x] Show all tabs in snail form
- [x] Navigation
- [x] Close tabs
- [x] Shrink viewport to inner snail bounds
- [x] Update layout on viewport changes
- [x] Configurable tab size
- [ ] [Themes](https://www.instagram.com/p/DMdTtUJpaxi)
  - [x] Striped (default) with color setting
  - [x] Pride
  - [ ] Windows 95
  - [ ] Leopard Slug
  - [ ] Pacific Banana Slug
  - [ ] Red Slug
  - [ ] Sea Slug
  - [ ] Carpathian Blue Slug
  - [ ] Yellow Slug?
- [ ] Visualize tab groups?

## Development

This project uses [WXT](https://wxt.dev). To start the extension in development mode, run one of the
following commands. The extension will launch in an isolated Chrome or Firefox window (Chrome by
default) and automatically reload on changes.

```shell
pnpm dev # each command uses Chrome by default
pnpm dev:chrome
pnpm dev:firefox
```

Alternatively, you can install the extension in your browser manually by loading the respective
directory in `./build` as an
[unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

Other helpful commands:

```shell
pnpm check # checks all things below
pnpm format
pnpm lint
pnpm tsc
```

Tests will be added soon.

## Publishing

To build in production mode, run:

```shell
pnpm build
pnpm build:chrome
pnpm build:firefox
```

You can create zip files with:

```shell
pnpm zip
pnpm zip:chrome
pnpm zip:firefox
```

Licensed under the
[Non-White-Heterosexual-Male License](https://nonwhiteheterosexualmalelicense.org).
