---
name: FCGallery
description: A Gallery collection planning workspace
colors:
  primary: "#255d48"
  background: "#f5f7f6"
  surface: "#ffffff"
  text: "#1f2327"
  muted: "#59655f"
  coin: "#80601b"
  line: "#d7dfda"
  surface-subtle: "#edf2ef"
  accent-background: "#e4eee8"
  danger: "#a92b28"
  focus: "#b4760c"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(30px,3.8vw,48px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.035em"
  body:
    fontFamily: "Commissioner, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  panel: "6px"
  control: "4px"
  button: "5px"
  inset: "3px"
spacing:
  small: "8px"
  field: "16px"
  panel: "25px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "5px"
    padding: "10px 17px"
---
# FCGallery interface

FC 27 players compare Gallery upgrade choices and check Set score arithmetic. Frequent input and comparison matter more than a promotional landing page.

## Overview

The approved product direction is a light collection planning workspace. The concept seed was `9c7a039a`, assigned direction 4: collection auction catalogue. Considered subject references were fixture tables, matchday programmes, collection albums, collection auction catalogues, scorebooks, transfer ledgers and badge catalogues. The chosen direction contributes compact records, precise numbers and a restrained green/gold hierarchy while preserving familiar form controls and navigation.

Reference layouts supply structure only: the table workspace and the planner input/output grouping. No source code, game images, logos or template prose was copied. EA Gallery art supplied visual context: bright collection displays and metal against dark exhibition space. The light tokens are designed derivatives, rather than sampled exact colours.

## Colors

- Heading: self-hosted Archivo Black, 31–50px, compact line height. Body: self-hosted Commissioner, 16px, field labels 12–13px. All financial values use tabular numbers. Font licenses live beside local font files.
- Light: background #f5f7f6, surface #ffffff, text #1f2327, muted #59655f, action #255d48, coin #80601b, line #d7dfda.
- Dark: background #141b18, surface #1b2620, text #eaf0eb, muted #b6c4ba, action #91d5af, coin #e3c473, line #3c5043.
- Focus: a visible 3px outline. Controls have a 44px minimum touch area. Panels use 1px borders, modest 6px corners and no decorative glow.

## Layout

Desktop navigation keeps Planner visible, groups inner pages under Tools and Gallery dropdowns, and places the light/dark button at the far right. Mobile puts the menu button immediately before the theme control. Dropdowns respond to click, Escape and outside click; page selection closes the menu. Theme follows the OS until chosen and persists locally.

The homepage begins with the tool. Target and input sections sit beside the route output on desktop; mobile uses a single column. Guide pages use content-specific examples and local scrolling tables. Every content page has two semantic inbound links and a unique task.

## Components

An empty workspace gives the next input step. Example plans are explicitly illustrative. Market values are entered by the player; there is no live price claim. Cost, cash needed and transaction count remain separate. Invalid inputs cannot produce a recommended route. Local save, JSON exchange and share fragments are implemented, with share disclosure beside the controls.

Analytics is default-deny. Its page location strips the fragment and its events omit the entered plan. Independent source notes stay on /sources/. No decorative EA player artwork or EA marks appear in the tool.

## Do's and Don'ts

Use the entered card variant exactly once across Sets. Keep prices and targets editable. Do not add generic promotional heroes, fake live-market numbers, emoji navigation icons, decorative side borders or source-process labels to player pages.
