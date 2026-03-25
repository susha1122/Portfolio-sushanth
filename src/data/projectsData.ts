export interface Project {
  title: string;
  category: string;
  tools: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
}

const projectsData: Project[] = [
  {
    title: "FreshCart",
    category: "Full-Stack E-Commerce",
    tools: "React, Node.js, Express, MongoDB, JWT, Cloudinary, Vercel",
    description:
      "Scalable, decoupled MERN e-commerce platform with role-based JWT auth, seller dashboards, and Cloudinary media management.",
    image: "/images/freshcart.webp",
    link: "https://freshcart-inky-alpha.vercel.app/",
    github: "https://github.com/susha1122/FreshCart",
  },
  {
    title: "Patient Care Analysis & Outreach System",
    category: "AI / Machine Learning",
    tools: "Python, Random Forest, Gradient Boosting, Streamlit, MongoDB",
    description:
      "AI-based disease prediction system achieving 90% accuracy with Gradient Boosting, featuring a Streamlit web app, MongoDB storage, and automated email health reports.",
    image: "/images/patientcare.webp",
    link: "https://patientcare-sushanth.streamlit.app/",
    github: "https://github.com/susha1122/patient_Care",
  },
  {
    title: "Modern Blog Application",
    category: "Full-Stack Blog",
    tools: "React, Node.js, MongoDB, Clerk, ReactQuill, ImageKit",
    description:
      "Full-stack MERN blog platform with Clerk auth, global search, category filtering, pagination, saved posts, and rich-text editing.",
    image: "/images/blogapp.webp",
    link: "https://blogapplication-nine.vercel.app/",
    github: "https://github.com/susha1122/blogapplication",
  },
  {
    title: "Bug Creator & Ticket Management",
    category: "React Application",
    tools: "React, Context API, Reducers, Tailwind CSS",
    description:
      "Scalable React app combining blogging and ticket management with sorting, filtering, theme switching, and reusable components.",
    image: "/images/bugcreator.webp",
    link: "https://blug-creator.vercel.app/",
    github: "https://github.com/susha1122/bug-creator",
  },
  {
    title: "Movie Time",
    category: "React Application",
    tools: "React, State Management, JavaScript",
    description:
      "Movie browsing and watchlist app with interactive UI, reusable MovieCard/MovieGrid components, and dynamic filtering.",
    image: "/images/movietime.webp",
    link: "https://movie-crazy.vercel.app/",
    github: "https://github.com/susha1122/Movie-time",
  },
];

export default projectsData;
