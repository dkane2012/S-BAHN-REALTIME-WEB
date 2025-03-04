# Deploying to Netlify

## 1. Install Netlify CLI
- Open terminal
- Run: `npm install -g netlify-cli`

## 2. Initialize Project
- Navigate to project directory
- Run: `netlify init`

## 3. Configure Settings
- Edit `netlify.toml` file:
  ```toml
  [build]
    command = "npm run build"
    publish = "out"
  ```

## 4. Build Application
- Run: `npm run build`
- Production files will be generated in `out` directory

## 5. Deploy
- Run: `netlify deploy --prod`
- This uploads and deploys your site

## 6. Access Site
- Netlify will provide deployment URL
- Your site will be live at the provided URL
