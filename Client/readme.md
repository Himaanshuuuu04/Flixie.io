# 🎬 Flixie.io

> **Redefining Streaming UI/UX**  
> Discover, like, and share movies and series with a next-gen, beautifully designed platform.

---

## 🚀 Live Demo

[flixie-io.vercel.app](https://flixie-io.vercel.app/)

---

## ✨ Features

- **Modern UI/UX**: Responsive, accessible, and visually stunning
- **Personalized Experience**: Like, favorite, and track your watch history
- **Social**: Connect with friends and share recommendations
- **Lightning Fast**: Optimized for performance and smooth navigation
- **Secure Auth**: User authentication and profile management

---

## 🛠️ Tech Stack

| Technology      | Purpose                        |
|-----------------|-------------------------------|
| React           | Frontend Framework            |
| Tailwind CSS    | Utility-first Styling         |
| Shadcn/UI       | UI Component Library          |
| Aceternity UI   | Interactive UI Elements       |
| Appwrite        | Backend as a Service (BaaS)   |
| React Router    | Client-side Routing           |
| React Toastify  | Notifications                 |

---

## 📁 Project Structure

```plaintext
flixie.io/
├── src/
│   ├── components/      # React components (UI, context, etc.)
│   ├── assets/          # Images, icons, etc.
│   ├── pages/           # Page-level components
│   ├── styles/          # Tailwind and custom CSS
│   └── main.jsx         # App entry point
├── public/
│   └── icon.ico         # Favicon
├── tailwind.config.js   # Tailwind configuration
├── .env                 # Environment variables (see below)
└── ...
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Appwrite configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_LIKED_ID=your_liked_collection_id
VITE_APPWRITE_COLLECTION_WATCHED_ID=your_watched_collection_id
VITE_APPWRITE_COLLECTION_USERS_ID=your_users_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id

# (Optional) Other environment variables
# VITE_SOME_API_KEY=your_api_key
```

> **Note:**  
> - Replace all `your_*` values with your actual Appwrite project and collection IDs.
> - Never commit your `.env` file to version control.

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Himaanshuuuu04/Flixie.io.git
cd Flixie.io

# Install dependencies
npm install

# Set up your .env file (see above)
cp .env.example .env
# Edit .env with your values

# Start the development server
npm run dev
```

---

## 🖥️ Usage

- Visit [localhost:5173](http://localhost:5173) (or the port shown in your terminal)
- Register or log in
- Explore, like, and track movies and series
- Enjoy the modern UI/UX!

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📬 Contact

- **GitHub:** [Himaanshuuuu04/Flixie.io](https://github.com/Himaanshuuuu04/Flixie.io)
- **Email:** [shauryarahlon.10@gmail.com](mailto:shauryarahlon.10@gmail.com)

---

## 💡 License

[MIT](./LICENSE)

---

**Flixie.io** – _Reimagining Streaming, One Pixel at a Time_ 🎥✨
