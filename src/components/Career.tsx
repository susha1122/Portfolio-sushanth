import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in AI and Data Science</h4>
                <h5>RMK College of Engineering and Technology</h5>
              </div>
              <h3>2021 - 2025</h3>
            </div>
            <p>
              Graduated in 2025 with a degree in Artificial Intelligence and Data Science, gaining strong knowledge in AI and modern technologies. Published a research paper on AGI and was selected for the MSME Hackathon for a Women Safety Analytics solution.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance Frontend Developer</h4>
                <h5>HyperRevamp</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Worked as a Freelance Frontend Developer, building and deploying responsive applications using React and Next.js.Handled real-time updates, bug fixes, and performance optimization for live production platforms.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Frontend Developer</h4>
                <h5>Open to Work</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Actively looking for Frontend Developer or AI Engineer roles where I can build scalable and user-focused applications. Passionate about learning new technologies and continuously improving through hands-on experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
