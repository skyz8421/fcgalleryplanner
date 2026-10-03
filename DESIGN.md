---
name: FCGallery
description: A clear player-data workspace for Gallery planning
colors:
  primary: "#2559de"
  background: "#f4f6fb"
  surface: "#ffffff"
  text: "#172238"
  muted: "#58677f"
  coin: "#6642a6"
  line: "#dce3ef"
  control-line: "#8492ad"
  surface-subtle: "#edf1fa"
  accent-background: "#eaf0ff"
  danger: "#bd293d"
  focus: "#2559de"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(32px,3.8vw,48px)"
    fontWeight: 650
    lineHeight: 1.13
    letterSpacing: "-.045em"
  home:
    fontSize: "clamp(36px,4.2vw,56px)"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  section:
    fontSize: "22px"
  subheading:
    fontSize: "18px"
  nav:
    fontSize: "15px"
  button:
    fontSize: "14px"
  label:
    fontSize: "13px"
  caption:
    fontSize: "12px"
  ad-label:
    fontSize: "11px"
  ad-label-mobile:
    fontSize: "9px"
  lead:
    fontSize: "17px"
  footer-brand:
    fontSize: "20px"
  mobile-section:
    fontSize: "21px"
  mobile-brand:
    fontSize: "23px"
  brand:
    fontSize: "24px"
  mobile-heading:
    fontSize: "31px"
  mobile-home:
    fontSize: "36px"
rounded:
  panel: "12px"
  button: "8px"
  input: "7px"
  menu: "6px"
  inset: "5px"
  nav: "4px"
  small: "3px"
spacing:
  small: "8px"
  field: "16px"
  panel: "25px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "8px"
    padding: "10px 17px"
---
# FCGallery interface

Revised in response to the user's rejection of the green/gold palette and heavy display lettering. The site is a player-data workspace: quiet silver-blue surfaces, ink text, clear blue actions and regular-weight prose. Typography is self-hosted Manrope variable Latin, semibold headings and regular body. Numeric fields/results use tabular figures. The 24KB local font and OFL license live in public/fonts. No isolated colored phrase in the main headline.

## Themes and readability

Light tokens are listed above. Dark canvas #101728, surface #172239, text #edf2ff, secondary #b1bed4, action #89aeff, dividers #34425d, and coin metric #c5a5ff. Primary button foreground is explicitly white in light and #101728 in dark. Field boundaries use independent #8492ad / #65779b tokens with3:1 contrast, while dividers stay quiet. Blue focus outline remains3px; controls retain44px minimum touch areas. Panels use quiet1px borders and12px corners, without accent strips or decorative shadows. The diagrams keep a light blue backplate in both themes for readability.

## Layout and interaction

Retain the two-column input/results workspace and single mobile column. Inner-page links stay under Tools and Gallery; the far-right theme control remembers the user's choice. Escape/outside click and selecting a page close menus. Guide examples, tables and reciprocal body links retain their distinct layouts.

Local save, Undo, drafts, JSON import/export and fragment shares retain their existing behavior. Prices are player-entered estimates, not a live feed. Titles, H1 text, canonical URLs, analytics consent and ad activation rules are unchanged. Only presentation is revised; diagrams preserve all arithmetic and source claims.

Main interface text uses Manrope. External standalone SVG diagrams use Arial, JSON textarea uses monospace, and isolated ad labels use system-ui; these are intentional formatting exceptions, not Manrope claims.
