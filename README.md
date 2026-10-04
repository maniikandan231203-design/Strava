# StridePulse — Enterprise Running Report Dashboard

A multi-page React Vite enterprise web application with a persistent sidebar layout, client-side routing with `react-router-dom`, and a light mode theme powered by Tailwind CSS.

---

## 🏛️ Application Architecture & Layout

### 1. Persistent Sidebar Layout (`Layout.jsx` & `Sidebar.jsx`)
- **Fixed Left Sidebar**:
  - Light gray background (`bg-slate-50`) with subtle right border (`border-r border-gray-200`).
  - High-contrast text navigation (`text-gray-700` default, `bg-gray-200/80 text-gray-900 font-semibold` active).
  - Modular navigation configuration (`NAVIGATION_MODULES`) allowing immediate registration of future application modules.
  - Mobile responsive drawer with sliding transition and hamburger trigger for small devices.
  - Bottom profile pill and instant "Reset Sample Data" utility.
- **Top Header Bar**:
  - Clean white navbar (`bg-white border-b border-gray-200`).
  - Active page header, calendar date indicator, and contextual quick actions.
- **Dynamic Content View (`<Outlet />`)**:
  - High-contrast pure white canvas (`bg-white text-gray-900`).
  - Passes shared workout state and mutation callbacks via React Router's outlet context.

### 2. Multi-Page Routes
- **`Home / Dashboard` (`/`)**:
  - Executive operations summary.
  - Cumulative KPI Cards: Total Distance, Weighted Avg Pace, Elevation Gain, Longest Run.
  - Workout category mileage volume distribution bars.
  - Recent workouts ledger preview with direct deep-links.
- **`Running Report` (`/running-report`)**:
  - Complete running activity ledger and logging hub.
  - Tab toggle between **Data Table & Ledger** and **Add Run Form**.
  - **Search & Filters**: Search by run name, date sorting (newest/oldest), date range filtering (7 days, 30 days, year).
  - Table view & grid cards view toggle.
  - CSV export and workout deletion.
  - Input form with auto-pace calculator assistant, validation, and auto-reset.

---

## 🎨 Enterprise Light Theme Specifications

- **Backgrounds**: Pure white (`bg-white`) for the main content area, tables, and cards; soft gray (`bg-slate-50`) for the sidebar.
- **Borders & Dividers**: Crisp light gray (`border-gray-200`).
- **Typography**: `Inter` font family with high-contrast text (`text-gray-900` for titles/data, `text-gray-600` for descriptions, `text-gray-400` for captions).
- **Shadows**: Subtle drop shadows (`shadow-sm`, `shadow-xs`).
- **Pills & Badges**: Clean tonal badges (e.g. `bg-emerald-50 text-emerald-700 border-emerald-200`).

---

## 📂 Project Directory Structure

```
├── index.html                    # Pure white background, Inter typography
├── vite.config.js                # Vite React configuration
├── tailwind.config.js            # Custom Tailwind theme
├── postcss.config.js             # PostCSS Tailwind & Autoprefixer plugin
├── package.json                  # Dependencies including react-router-dom
└── src/
    ├── main.jsx                  # BrowserRouter mounting
    ├── App.jsx                   # Central state & Route declarations
    ├── index.css                 # Clean light scrollbar & Tailwind directives
    ├── layout/
    │   ├── Layout.jsx            # Shell with persistent sidebar & <Outlet />
    │   └── Sidebar.jsx           # Modular sidebar navigation
    ├── pages/
    │   ├── HomePage.jsx          # Home / Dashboard overview route
    │   └── RunningReportPage.jsx # Running Report & Add Run form route
    ├── components/
    │   ├── MetricsOverview.jsx   # Flat white KPI cards with subtle borders
    │   ├── AddRunForm.jsx        # Clean form with validation & pace auto-calc
    │   └── Dashboard.jsx         # Data table, filters, search, and CSV export
    ├── data/
    │   └── mockRuns.js           # Seed running entries
    └── utils/
        └── formatters.js         # Pace, time, and distance calculation helpers
```

---

## 💻 Running the App

The Vite dev server is running on:
```
http://localhost:5173/
```

To run manually:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```
