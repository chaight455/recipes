# Recipes App — Style Guide

This document defines the unified styling system for the Recipes app. All UI should follow these conventions to stay consistent.

---

## Colors

All colors are Tailwind utilities. Dark mode variants are required on every surface.

### Brand / Primary

| Role             | Light             | Dark              |
| ---------------- | ----------------- | ----------------- |
| Default          | `bg-indigo-600`   | —                 |
| Hover            | `bg-indigo-700`   | —                 |
| Active / Pressed | `bg-indigo-800`   | —                 |
| Focus ring       | `ring-indigo-500` | —                 |
| Text link        | `text-indigo-600` | `text-indigo-400` |

### Neutrals

| Role                   | Light             | Dark              |
| ---------------------- | ----------------- | ----------------- |
| Page background        | `bg-gray-50`      | `bg-gray-900`     |
| Surface (card, input)  | `bg-white`        | `bg-gray-800`     |
| Border                 | `border-gray-300` | `border-gray-600` |
| Body text              | `text-gray-700`   | `text-gray-300`   |
| Muted / secondary text | `text-gray-500`   | `text-gray-400`   |
| Heading text           | `text-gray-900`   | `text-white`      |

### Semantic

| Role                     | Light           | Dark           |
| ------------------------ | --------------- | -------------- |
| Error text               | `text-red-600`  | `text-red-400` |
| Error focus ring         | `ring-red-400`  | —              |
| Destructive icon default | `text-gray-400` | —              |
| Destructive icon hover   | `text-red-500`  | —              |
| Destructive icon active  | `text-red-700`  | —              |

---

## Typography

| Element              | Classes                                                |
| -------------------- | ------------------------------------------------------ |
| Page heading (h1)    | `text-3xl font-semibold text-gray-900 dark:text-white` |
| Section heading (h2) | `text-xl font-semibold text-gray-900 dark:text-white`  |
| Form label           | `text-sm font-medium text-gray-700 dark:text-gray-300` |
| Body / paragraph     | `text-base text-gray-700 dark:text-gray-300`           |
| Muted / helper text  | `text-sm text-gray-500 dark:text-gray-400`             |
| Error message        | `text-sm text-red-600 dark:text-red-400`               |
| Required indicator   | `text-red-500` (within label)                          |

---

## Buttons

All buttons must include hover, active (press), and focus-visible states. Use `transition-all` and `cursor-pointer` on every button.

### Primary

Filled indigo. Used for the main action on a page.

```
rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.98]
text-white font-medium px-4 py-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
transition-all cursor-pointer
```

When disabled (e.g. loading):

```
disabled:opacity-60 disabled:cursor-not-allowed
```

### Secondary (Outline)

Used for cancel or secondary actions alongside a primary button.

```
rounded-lg border border-gray-300 dark:border-gray-600
text-gray-700 dark:text-gray-300
hover:bg-gray-100 dark:hover:bg-gray-800
active:bg-gray-200 dark:active:bg-gray-700 active:scale-[0.98]
px-5 py-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
transition-all cursor-pointer
```

### Text / Link Button

Used for low-emphasis actions like "← Back" or "+ Add item".

```
text-sm text-indigo-600 dark:text-indigo-400
hover:underline active:opacity-60
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
rounded transition-opacity cursor-pointer
```

### Ghost / Icon Button (Destructive)

Used for inline remove/delete actions (e.g. removing an ingredient row).

```
px-2 text-gray-400
hover:text-red-500 active:text-red-700 active:scale-90
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1
rounded transition-all cursor-pointer
```

---

## Form Inputs

Applies to `<input>`, `<textarea>`, and `<select>`.

```
w-full rounded-lg border border-gray-300 dark:border-gray-600
bg-white dark:bg-gray-800
px-3 py-2
text-gray-900 dark:text-white placeholder-gray-400
focus:outline-none focus:ring-2 focus:ring-indigo-500
```

Textarea additionally: `resize-y`

---

## Layout

| Element                      | Classes                                               |
| ---------------------------- | ----------------------------------------------------- |
| Page wrapper                 | `min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4` |
| Content container            | `max-w-2xl mx-auto`                                   |
| Form vertical spacing        | `space-y-6`                                           |
| Two-column grid              | `grid grid-cols-2 gap-4`                              |
| Button row                   | `flex gap-3`                                          |
| Inline row (e.g. ingredient) | `flex gap-2`                                          |

---

## Spacing & Sizing

| Token                 | Value        |
| --------------------- | ------------ |
| Base page padding     | `py-10 px-4` |
| Section gap           | `space-y-6`  |
| Label → input gap     | `mb-1`       |
| Inline element gap    | `gap-2`      |
| Button group gap      | `gap-3`      |
| Heading bottom margin | `mb-8`       |

---

## Interaction States Summary

Every interactive element must cover all four states:

| State            | Mechanism                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- |
| Hover            | `hover:` — color shift or underline                                                |
| Active / Press   | `active:` — darker color + `scale-[0.98]` (or `scale-90` for small icons)          |
| Focus (keyboard) | `focus-visible:ring-2 focus-visible:ring-{color} focus-visible:ring-offset-{1\|2}` |
| Disabled         | `disabled:opacity-60 disabled:cursor-not-allowed`                                  |

All transitions use `transition-all` (or `transition-colors` / `transition-opacity` for single-property cases).
