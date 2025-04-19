# Enterprise Account Planner

A comprehensive account planning tool for enterprise sales teams.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

To get these values:
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon next to "Project Overview" and select "Project settings"
4. Scroll down to the "Your apps" section
5. Click the web icon (</>)
6. Register your app and copy the configuration values

4. Start the development server:
```bash
npm start
```

## Features

- Dashboard with key account metrics
- Territory mapping
- Stakeholder management
- Opportunity pipeline
- Strategic initiatives tracking
- Analytics dashboard

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
