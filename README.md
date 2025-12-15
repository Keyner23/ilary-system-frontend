# Ilary System Frontend

<img alt="GitHub License" src="https://img.shields.io/github/license/keyner23/ilary-system-frontend">

A modern, professional job application platform built with Vue.js 3, TypeScript, and Pinia. This frontend connects to the Ilary System backend API and provides a beautiful, responsive user interface for job seekers and recruiters.

## ✨ Features

- 🎨 **Modern UI Design** - Professional, aesthetic design with dark mode support
- 🔐 **Authentication** - Secure login and registration system
- 💼 **Job Listings** - Browse and search through job opportunities
- 🏢 **Company Profiles** - Discover companies and their openings
- 📊 **Application Tracking** - Track your job applications
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Vue 3 and Vite for optimal speed

## 🚀 Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS Variables

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see [ilary-system-backend](https://github.com/keyner23/ilary-system-backend))

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/Keyner23/ilary-system-frontend.git
cd ilary-system-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
├── config/          # Configuration files (API, etc.)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores for state management
├── views/           # Page components
├── App.vue          # Root component
└── main.ts          # Application entry point
```

## 🎨 Design System

The application uses a comprehensive design system with:
- **Color Palette**: Professional blue and teal colors
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components (buttons, cards, forms)
- **Dark Mode**: Automatic theme switching

## 🔌 API Integration

The frontend connects to the backend API using Axios. API configuration is in `src/config/api.ts`.

Key features:
- Automatic token injection for authenticated requests
- Request/response interceptors
- Error handling
- TypeScript types for API responses

## 🌐 Available Routes

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/jobs` - Browse jobs
- `/jobs/:id` - Job details
- `/companies` - Browse companies
- `/applications` - My applications (auth required)
- `/profile` - User profile (auth required)
- `/settings` - Account settings (auth required)

## 👥 Authors

- Keyner Barrios [@keyner23](https://github.com/keyner23)
- Juan David Contreras [@contrerinhaz](https://github.com/contrerinhaz)
- Martha Garcia [@Martha-10](https://github.com/Martha-10)
- Dilan Marin [@developer-dylan](https://github.com/developer-dylan)
- Jafit Barraza

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Read [CONTRIBUTING.MD](.github/CONTRIBUTING.md) for more details.

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ by the Ilary System team
