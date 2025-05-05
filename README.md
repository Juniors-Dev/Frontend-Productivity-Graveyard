# Productivity Graveyard

> _A final resting place for all those ambitious projects that never made it to production._

## Project Overview

As developers, we've all started countless projects that seemed exciting at first, only to abandon them for the next shiny idea. Productivity Graveyard is a memorial site where you can lay these abandoned projects to rest with the honor they deserve.

### Features

- Landing Page: Grim reaper with a clipboard, graveyard background, atmospheric elements
- Submit a Dead Project: Form to bury your abandoned projects
- Graveyard View: Cemetery-style display of all "dead" projects with interactive tombstones
- Stats Section: Track abandonment statistics and project lifespans
- User Profile: Personal statistics and individual project graveyards

## Prerequisites

- Node.js (v20+)
- npm

## Getting Started

1. Clone the repo

```bash
git clone https://github.com/Juniors-Dev/Frontend-Productivity-Graveyard.git
cd frontend-productivity-graveyard
```

2. Install all dependencies & Husky hooks

```bash
npm run setup 
```

3. Set up development tools

```bash
# Husky will be installed automatically via the prepare script
# Verify Husky installation
npx husky --version
```

### Development

1. Start the development server

To start the development environment, use:

```bash
npm run dev
```

This will: 
1. Lint all JavaScript files using ESLint to catch errors and enforce code quality.
2. Format code using Prettier.
3. Start the development server on http://localhost:3000 using http-server.

### Development Workflow

The project uses several tools to ensure code quality:

- ESLint: For JavaScript linting
- Prettier: For code formatting
- Husky: For pre-commit hooks that run linting and formatting

When you commit changes, Husky will automatically:

- Run ESLint on JavaScript files
- Format all code with Prettier

If you encounter any issues with the pre-commit hooks, check that Husky is properly installed:

```bash
npm run prepare
```

## Project Structure

```bash
├── assets/ # Fonts and images
├── css/ # Global styles
├── src/
│ └── components/ # Reusable UI components
│ ├── footer/
│ ├── header/
│ ├── profile/
│ └── projects/
├── index.html # Main entry point
└── profile.html # User profile page
```

### Available Scripts

- npm run format - Run Prettier to format code
- npm run lint - Run ESLint to check code quality

## Technologies

- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6+, Modules)
- ESLint
- Prettier
- Husky

### Future Enhancements (possible)

- "Resurrect" functionality for abandoned projects
- Leaderboards for most abandoned projects
- Mourner comments on project tombstones
- Visual themes for different abandonment contexts
- Automatic obituary generator

## Author

This project is created by the Juniors-Dev collaborative group, a team of web developer students at Noroff.
https://github.com/Juniors-Dev
