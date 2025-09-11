# Weekendly - Weekend Planner

An interactive web application that helps users design their perfect weekend by choosing activities, meals, and moods, and arranging them into a personalized Saturday-Sunday schedule.

## Features

### Core Features
- Browse and choose activities from a curated set of options
- Add selected activities to weekend schedule (Saturday + Sunday)
- View weekend plans in a clear, visual timeline format
- Edit or remove activities from the schedule

### Enhanced Features
- **Drag-and-drop** interface for rearranging activities
- **Visual richness** with icons, images, and color-coded categories
- **Personalization themes**: lazy weekend, adventurous weekend, family weekend
- **Mood tracking** for each activity
- **Share/export** functionality for plans
- **Long weekend** support (3-4 days)

### Advanced Features
- **Persistence** with localStorage/IndexedDB
- **Performance optimization** for 50+ activities
- **Offline-friendly** PWA functionality
- **Automated testing**
- **Design system** with reusable components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Persistence**: LocalStorage/IndexedDB

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
weekendly/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── activities/        # Activity-related components
│   │   ├── schedule/          # Schedule components
│   │   └── common/            # Common components
│   ├── lib/                   # Utilities and configurations
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript type definitions
│   └── data/                  # Mock data and constants
├── public/                    # Static assets
└── docs/                      # Documentation
```

## Development Phases

### Phase 1: Foundation (Complete)
- [x] Next.js project setup
- [x] Tailwind CSS + shadcn/ui configuration
- [x] Basic project structure
- [x] Core dependencies installation

### Phase 2: Core Features (In Progress)
- [ ] Activity data model and mock data
- [ ] Activity browsing interface
- [ ] Weekend schedule creation
- [ ] Basic state management with Zustand
- [ ] Activity addition/removal functionality

### Phase 3: Enhanced Experience
- [ ] Drag-and-drop interface
- [ ] Visual enhancements and animations
- [ ] Theme personalization
- [ ] Mood tracking system
- [ ] Mobile responsiveness

### Phase 4: Advanced Features
- [ ] Data persistence
- [ ] Performance optimization
- [ ] PWA implementation
- [ ] Testing setup
- [ ] Share/export functionality

## Design Principles

- **User-Centric**: Intuitive and delightful user experience
- **Performance**: Smooth interactions and optimized loading
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA support
- **Responsive**: Seamless experience across all device sizes
- **Maintainable**: Clean, reusable component architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for your own weekend planning adventures!

---

Made with care for better weekends
