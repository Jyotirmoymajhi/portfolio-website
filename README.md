# Jyotirmoy Majhi — Portfolio

A product design and visual thinking portfolio for Jyotirmoy Majhi, featuring selected work, including the Ventry project.

**Live site:** [https://jyotirmoy17.vercel.app/](https://jyotirmoy17.vercel.app/)

## About

This portfolio presents Jyotirmoy's approach to turning human problems into meaningful, useful, and memorable digital products. The site combines editorial storytelling, responsive layouts, interactive motion, custom artwork, and project-focused case-study sections.

## Built With

- React 19
- TypeScript
- Vinext
- Vite 8
- Tailwind CSS 4
- Nitro
- Lucide React
- Vercel

## Getting Started

### Prerequisites

- Node.js 22.13 or later
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The development server will print the local URL in the terminal.

### Production Build

Create a production build:

```bash
npm run build
```

Run the production build locally with the Vinext server:

```bash
npm run start
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the built application locally |
| `npm run lint` | Run Oxlint |
| `npm run format` | Format the project with Oxfmt |

## Deploying to Vercel

The project includes a `vercel.json` configuration for Vercel builds. To deploy from the command line:

```bash
vercel login
vercel --prod
```

Vercel uses Nitro to generate the server output required for the Vinext application.

## Project Structure

```text
app/              Application routes, layout, page, and global styles
components/ui/    Reusable UI components
hooks/            Shared React hooks
lib/              Shared utilities
public/           Images, audio, video, and other static assets
vite.config.ts    Vite, Vinext, Tailwind, and deployment configuration
vercel.json       Vercel build configuration
```
## License

This project is a personal portfolio. The source code and visual assets are not licensed for redistribution without permission.
