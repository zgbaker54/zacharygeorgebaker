# zacharygeorgebaker

This repository is a React frontend running on https://www.zacharygeorgebaker.com - a site intended to demonstrate my ability to program and deploy a dashboard showcasing data.

<br />

## Local development

Run `npm install` to install dependencies. (first time only)

### Environment variables

Create a `.env` file in the project root with the following values:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Run `npm start` to run the frontend on a local server.

### Running locally with HTTPS

The Device Tilt feature on mobile devices requires a secure context (HTTPS). To run the app locally with HTTPS:

```bash
HTTPS=true npm start
```

This uses Create React App's built-in HTTPS support with a self-signed certificate. Your browser will show a security warning — navigate to `https://localhost:5173` and accept the warning to proceed.

## Deployment

Building and deployment of this frontend is handled by AWS Amplify. Amplify will automatically build and deploy any commit pushed to this repo's `master` branch.

## Use

Navigate to https://www.zacharygeorgebaker.com to use the site's latest build.


