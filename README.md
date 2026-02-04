# MediManage - Patient Care Platform (医患管理平台)

A modern, high-performance patient management system built for dental and medical clinics. This platform features a modular architecture, multi-region support, and a premium user interface designed with rich aesthetics and smooth interactions.

## 🚀 Features

- **📊 Comprehensive Dashboard**: Real-time metrics, appointment efficiency tracking, and patient growth analytics.
- **📅 Advanced Appointment Calendar**: Manage bookings with multiple views including Daily, Weekly, Monthly, and a Kanban-style Board view.
- **👥 Patient Management**: Full-featured patient registry with search, risk stratification, and detailed clinical profiles.
- **🏥 Clinical Timeline**: Visual medical record history with support for chief complaints, diagnoses, and imaging attachments.
- **🦷 Specialized Dental Chart**: Interactive dental charting system for precise record-keeping.
- **💰 Finance Module**: Track revenue, pending payments, and monthly financial statistics.
- **🌍 Multi-Region Support**: Full localization for Chinese and English markets with dedicated UI themes for each region.
- **🔔 Notification System**: Global toast alerts and reminder configurations.

## 🛠️ Technology Stack

- **Core**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **State Management**: React Context API

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Sidebar, Forms, DentalChart)
├── constants/      # Translations and configuration
├── contexts/       # Global state (Region, Toast)
├── styles/         # Global styles and Tailwind entry
├── views/          # Main page-level view components
└── App.jsx         # Modular main entry point
```

## 🚥 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## 🎨 Design Principles

- **Premium Aesthetics**: High-contrast dark modes, smooth gradients, and glassmorphism.
- **Micro-animations**: Enhanced UX through subtle transitions and hover effects.
- **Responsive Layout**: Fluid design that adapts to various screen sizes.
