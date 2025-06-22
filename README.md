# Camera Management System

A modern Next.js web application for managing cameras and analyzing demographics data with powerful insights and analytics.

## 🚀 Features

- **Camera Management**: View, edit, and configure cameras
- **Demographics Analytics**: Real-time demographics detection and analysis
- **Tag Management**: Organize cameras with customizable tags
- **Configuration Management**: Fine-tune demographics detection parameters
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Live analytics and insights

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 9.0 or higher) or **yarn** (version 1.22 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd camera-management-app
\`\`\`

### 2. Install Dependencies

Using npm:
\`\`\`bash
npm install
\`\`\`

Using yarn:
\`\`\`bash
yarn install
\`\`\`

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=https://task-451-api.ryd.wafaicloud.com

# Add other environment variables as needed
\`\`\`

### 4. Development Server

Start the development server:

Using npm:
\`\`\`bash
npm run dev
\`\`\`

Using yarn:
\`\`\`bash
yarn dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

### Development
\`\`\`bash
# Start development server
npm run dev
# or
yarn dev
\`\`\`

### Building
\`\`\`bash
# Build for production
npm run build
# or
yarn build
\`\`\`

### Production
\`\`\`bash
# Start production server (after build)
npm run start
# or
yarn start
\`\`\`

### Linting
\`\`\`bash
# Run ESLint
npm run lint
# or
yarn lint
\`\`\`

### Testing
\`\`\`bash
# Run tests
npm run test
# or
yarn test

# Run tests in watch mode
npm run test:watch
# or
yarn test:watch
\`\`\`

## 🏗️ Project Structure

\`\`\`
camera-management-app/
├── app/                          # Next.js App Router pages
│   ├── cameras/                  # Camera-related pages
│   │   ├── [id]/                # Dynamic camera pages
│   │   │   ├── analytics/       # Analytics page
│   │   │   ├── demographics/    # Demographics config page
│   │   │   └── edit/           # Edit camera page
│   │   └── page.tsx            # Camera list page
│   ├── demographics/            # Demographics pages
│   │   └── config/             # Global config page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── providers.tsx           # App providers
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── camera-detail.tsx      # Camera detail component
│   ├── camera-edit-form.tsx   # Camera edit form
│   ├── camera-list.tsx        # Camera list component
│   ├── demographics-*.tsx     # Demographics components
│   └── ...
├── hooks/                      # Custom React hooks
│   ├── use-cameras.ts         # Camera-related hooks
│   ├── use-demographics.ts    # Demographics hooks
│   └── ...
├── lib/                       # Utility libraries
│   ├── api.ts                 # API client
│   ├── types.ts               # TypeScript types
│   ├── utils.ts               # Utility functions
│   └── validations.ts         # Zod schemas
├── __tests__/                 # Test files
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
\`\`\`

## 🔧 Configuration

### API Configuration

The application connects to the camera management API. Update the API base URL in:

- **Environment variable**: `NEXT_PUBLIC_API_URL`
- **API client**: `lib/api.ts`

### Styling Configuration

- **Tailwind CSS**: Configure in `tailwind.config.ts`
- **Global styles**: Modify `app/globals.css`
- **Component styles**: Using Tailwind classes and shadcn/ui

## 📱 Key Features Usage

### Camera Management
1. **View Cameras**: Navigate to `/cameras` to see all cameras
2. **Camera Details**: Click on a camera to view detailed information
3. **Edit Camera**: Use the edit button to modify camera settings
4. **Tag Management**: Add/remove tags using the dropdown or checkboxes

### Demographics Configuration
1. **Global Config**: Visit `/demographics/config` for all cameras
2. **Camera-specific Config**: Access via camera detail page
3. **Parameter Tuning**: Adjust confidence thresholds and tracking parameters

### Analytics
1. **View Analytics**: Access from camera detail page
2. **Filter Data**: Use filters for gender, age, emotion, ethnicity
3. **Date Range**: Set custom date ranges for analysis
4. **Export Data**: Download analytics data (if enabled)

## 🧪 Testing

The application includes comprehensive tests using Jest and React Testing Library:

\`\`\`bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your Git repository to Vercel
2. **Environment Variables**: Add environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start production server
npm run start
\`\`\`

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   \`\`\`bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   \`\`\`

2. **Dependencies Issues**
   \`\`\`bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

3. **Build Errors**
   \`\`\`bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   \`\`\`

### Environment Issues

- Ensure all required environment variables are set
- Check API endpoint accessibility
- Verify Node.js and npm versions

## 📚 API Endpoints

The application integrates with the following API endpoints:

- `GET /cameras` - List all cameras
- `GET /cameras/{id}` - Get camera details
- `PUT /cameras/{id}` - Update camera
- `GET /tags` - List all tags
- `GET /demographics/config` - List demographics configurations
- `POST /demographics/config` - Create demographics configuration
- `PUT /demographics/config/{id}` - Update demographics configuration
- `GET /demographics/results` - Get demographics analytics

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the inline code documentation
- **API Documentation**: Refer to the API endpoint documentation

---

**Happy coding! 🎉**
