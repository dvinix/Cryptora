# Cryptora Frontend

A minimal dark-themed React frontend for the Cryptora encrypted notepad application.

## Features

- 🎨 **Minimal Dark UI** - Clean black theme with subtle blue accents
- 🔐 **Zero-Knowledge Architecture** - Password stored only in browser session
- 🚀 **Fast & Modern** - Built with Vite, React, TypeScript
- 📱 **Responsive Design** - Works on all screen sizes
- 🎯 **ShadCN UI Components** - Beautiful, accessible components

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **ShadCN UI** - Component library
- **React Router** - Routing
- **Axios** - API calls
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # ShadCN UI components
│   └── notes/           # Note-related components
├── context/
│   └── AuthContext.tsx  # Authentication state
├── lib/
│   ├── api.ts          # API client
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Utility functions
├── pages/
│   ├── LandingPage.tsx  # Home page
│   ├── AuthPage.tsx     # Login/Register
│   └── DashboardPage.tsx # Main app
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features Overview

### Landing Page
- Hero section with call-to-action
- Feature highlights (Zero-Knowledge, E2E Encryption, Privacy)
- Clean navigation

### Authentication
- Toggle between Login/Register
- Alias + Password authentication
- Client-side validation
- Error handling with toast notifications

### Dashboard
- **Sidebar:**
  - User alias display
  - "New Note" button
  - List of all notes (sorted by date)
  - Logout button

- **Main Area:**
  - Note viewer (decrypted content)
  - Note editor (create/edit)
  - Empty state when no note selected

### Note Management
- **Create:** Title (optional) + Content
- **Read:** View decrypted notes
- **Update:** Edit in-place
- **Delete:** With confirmation
- **Encryption:** Both title and content encrypted

## Environment Variables

The API base URL is configured in `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000';
```

Change this to your backend URL if different.

## Color Palette

- **Background:** `#0a0a0a` (near black)
- **Cards:** `#141414` (dark gray)
- **Primary:** `#3b82f6` (blue)
- **Border:** `#27272a` (subtle)
- **Text:** `#ffffff` / `#a1a1aa` (white/gray)

## Security Features

1. **Session Storage:** Password stored in `sessionStorage` (cleared on browser close)
2. **Auto-Logout:** Password removed when user logs out
3. **Password Injection:** Automatically attached to encrypted operations
4. **No Server Storage:** Password never sent to server for storage

## Development Tips

### Adding New Components

Use ShadCN CLI to add more components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Type Safety

All API responses are typed. See `src/lib/types.ts` for interfaces.

### Custom Hooks

- `useAuth()` - Access authentication state
- `useToast()` - Show toast notifications

## Troubleshooting

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
export default defineConfig({
  server: { port: 3000 }
})
```

### Backend Connection Issues
Verify backend is running on `http://localhost:8000` and CORS is enabled.

### TypeScript Errors
Run type check:
```bash
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

Built with ❤️ using React + ShadCN UI
