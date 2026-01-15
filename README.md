# TeleSTOP - Privacy Protection Tool

A Windows desktop application that helps you track down where your personal information appears online and guides you through removing it from people-search sites.

## Features

- **Personal Info Search**: Enter your name, email addresses, phone numbers, and addresses to search Google for where your information appears online
- **Multi-Format Search**: Automatically generates multiple search query variations (phone formats, name variations, address abbreviations) for thorough results
- **People-Search Site Detection**: Automatically identifies known people-search sites like Spokeo, Whitepages, BeenVerified, and 50+ others
- **Opt-Out Instructions**: Built-in knowledge base with step-by-step opt-out procedures for major people-search sites
- **Progress Tracking**: Track your removal requests and mark them as pending, in-progress, completed, or failed
- **100% Local**: All your data stays on your computer. Nothing is sent to external servers.
- **Encrypted Storage**: Personal information is encrypted on disk

## Privacy First

TeleSTOP is designed with privacy as the top priority:

- **No Cloud Services**: Everything runs locally on your machine
- **No Data Collection**: We don't collect any usage data or analytics
- **No External APIs**: Search results come directly from Google via your local browser
- **Encrypted Local Storage**: Your personal information is encrypted when stored

## Installation

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/TeleSTOP.git
cd TeleSTOP

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Package for Windows
npm run package:win
```

## Usage

1. **Enter Your Information**: Add your full name, email addresses, phone numbers, and addresses
2. **Start Search**: Click "Search for My Information" to scan Google for where your info appears
3. **Review Results**: People-search sites are highlighted in yellow for easy identification
4. **Get Opt-Out Instructions**: Click "View Opt-Out" on any result to see step-by-step removal instructions
5. **Track Progress**: Add sites to your removal tracker to keep track of your opt-out requests

## Supported People-Search Sites

TeleSTOP has opt-out instructions for 50+ people-search sites including:

- Spokeo
- Whitepages
- BeenVerified
- TruePeopleSearch
- FastPeopleSearch
- Radaris
- MyLife
- Instant Checkmate
- TruthFinder
- PeopleFinder
- FamilyTreeNow
- PeekYou
- Nuwber
- USPhonebook
- And many more...

## Tech Stack

- **Electron**: Cross-platform desktop application framework
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool

## Project Structure

```
TeleSTOP/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main entry point
│   │   ├── preload.ts  # Preload script for IPC
│   │   ├── search.ts   # Google search functionality
│   │   └── knowledge-base.ts  # Opt-out instructions database
│   └── renderer/       # React frontend
│       ├── App.tsx     # Main React component
│       ├── components/ # UI components
│       ├── styles/     # CSS styles
│       └── types/      # TypeScript types
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.

## Disclaimer

TeleSTOP is a tool to help you manage your online privacy. While it provides opt-out instructions for many people-search sites, removal success depends on each site's compliance with your request. Some sites may require additional verification or may not honor all removal requests. Always verify that your information has been removed after completing the opt-out process.
