import { useEffect, useRef } from "react";
import "./styles/SkillsList.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaPython, FaReact } from "react-icons/fa";
import { 
  SiJavascript, 
  SiOpencv, 
  SiPandas, 
  SiScikitlearn, 
  SiStreamlit, 
  SiVercel
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { MdOutlineAnalytics, MdOutlineSettingsSuggest } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

const aiSkills = [
  { name: "Programming Languages", tools: "Python, SQL", icon: <FaPython /> },
  { name: "Machine Learning", tools: "Regression, Random Forest, Gradient Boosting, XGBoost", icon: <SiScikitlearn /> },
  { name: "Computer Vision", tools: "OpenCV, YOLOv8, VGG16", icon: <SiOpencv /> },
  { name: "Data Processing", tools: "Pandas, NumPy, Data Cleaning, Feature Engineering", icon: <SiPandas /> },
  { name: "Cloud & Databases", tools: "Azure, AWS (Basics), MongoDB", icon: <VscAzure /> },
  { name: "Tools & Frameworks", tools: "Streamlit", icon: <SiStreamlit /> },
  { name: "Core Competencies", tools: "Machine Learning, Computer Vision, Data Analysis, Problem Solving", icon: <MdOutlineAnalytics /> }
];

const feSkills = [
  { name: "Languages", tools: "HTML5, CSS3, JavaScript (ES6+)", icon: <SiJavascript /> },
  { name: "Frameworks & Libraries", tools: "React.js, Next.js, Tailwind CSS", icon: <FaReact /> },
  { name: "Tools & Platforms", tools: "Git, GitHub, Vercel, REST APIs, Cloudinary", icon: <SiVercel /> },
  { name: "Core Competencies", tools: "Responsive Design, Context API, SPAs, UI/UX Principles", icon: <MdOutlineSettingsSuggest /> }
];

const SkillsList = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".skill-card");

    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, []);

  return (
    <div className="skills-list-container" ref={containerRef}>
      <h3 className="skills-section-title">Detailed Skills</h3>
      
      <div className="skills-grid-wrapper">
        <div className="skills-category">
          <h4 className="category-title">AI Engineer</h4>
          <div className="skills-grid">
            {aiSkills.map((skill, index) => (
              <div className="skill-card" key={`ai-${index}`}>
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-content">
                  <h5>{skill.name}</h5>
                  <p>{skill.tools}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-category">
          <h4 className="category-title">Frontend Developer</h4>
          <div className="skills-grid">
            {feSkills.map((skill, index) => (
              <div className="skill-card" key={`fe-${index}`}>
                <div className="skill-icon">{skill.icon}</div>
                <div className="skill-content">
                  <h5>{skill.name}</h5>
                  <p>{skill.tools}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsList;
