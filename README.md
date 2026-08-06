# Wanderlust

> Explore, review, and share your favorite travel-worthy listings with a polished Express app.


## ? What is Wanderlust?

Wanderlust is a full-stack Node.js application that turns listing discovery into a delightful experience. Users can create listings, upload photos, leave reviews, and enjoy secure login with Passport.js.

## ?? Features

- Secure authentication with Passport.js
- Create, edit, and delete listings
- Add reviews and ratings for each listing
- Upload images using Cloudinary + Multer
- Persistent MongoDB sessions using `connect-mongo`
- Clean EJS templates and responsive views
- Flash notifications for quick user feedback

## ?? Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file in the project root with:

```env
ATLASDB_URL=<your MongoDB Atlas connection string>
SECRET=<your session secret>
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_KEY=<your Cloudinary API key>
CLOUDINARY_SECRET=<your Cloudinary API secret>
```

### 4. Run the app

```bash
node app.js
```

Or use nodemon:

```bash
npx nodemon app.js
```

### 5. Open the app

Visit `http://localhost:8080`

## 🌐 Live Demo

Check the app live at: https://wanderlust-s70y.onrender.com/

## Project Structure

- `app.js` — Application setup, middleware, and routes
- `routes/` — Route definitions for listings, reviews, and users
- `controllers/` — Business logic and request handling
- `models/` — Mongoose schemas for listings, reviews, and users
- `views/` — EJS templates for UI rendering
- `public/` — Static CSS and client-side JS files

## Built With

- Node.js
- Express
- MongoDB / Mongoose
- Passport.js
- EJS
- Cloudinary
- Multer

## Notes

- Environment variables are loaded from `.env` when `NODE_ENV !== "production"`.
- MongoDB connection uses `process.env.ATLASDB_URL`.
- Session security is configured via `process.env.SECRET`.

## License

ISC © Samhita Acharya
