NorealBeauty is a full-stack web application for beauty and skincare businesses, featuring a dynamic product catalog, secure user authentication, and easy checkout. Admins can manage products, track sales, and analyze customer data. With smooth UI animations, mobile optimization, and robust security, it provides a seamless shopping experience.

## Deploying to Vercel

This project is ready for deployment on [Vercel](https://vercel.com/).

### Steps:
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel and select the root directory.
3. Vercel will detect the `vercel.json` and use the correct build settings.
4. For custom backend logic, Vercel will deploy `server/index.ts` as a serverless function.
5. The frontend will be built from the `client/` directory using Vite.

**Note:** You may need to set environment variables in the Vercel dashboard for production secrets.

