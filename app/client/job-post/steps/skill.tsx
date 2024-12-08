import React, { useState } from "react";
import styles from "../../../../components/style/skill.module.css";
import { useJobPostContext } from "../JobPostContext";
import Toast from "../../../../components/toast";

interface SkillStepProps {
  onNext: () => void; // Callback to move to next step
  onPrev: () => void; // Callback to move to previous step
}

// Sample skills list (this should come from the database in a real-world scenario)
const skillsList = [
  "Web Development",
  "Graphic Design",
  "Copywriting",
  "Digital Marketing",
  "SEO",
  "Content Writing",
  "Mobile Development",
  "App Design",
  "Data Analysis",
  "Cloud Computing",
];

const Skill: React.FC<SkillStepProps> = ({ onNext, onPrev }) => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  // Retrieve selected skills from jobPostData
  const selectedSkills = jobPostData.skills || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle skill selection
  const handleSkillSelect = (skill: string) => {
    // Prevent selecting the same skill multiple times
    if (!selectedSkills.includes(skill)) {
      setJobPostData((prevData) => ({
        ...prevData,
        skills: [...selectedSkills, skill],
      }));
    }
  };

  // Handle removing selected skills
  const handleSkillRemove = (skill: string) => {
    setJobPostData((prevData) => ({
      ...prevData,
      skills: selectedSkills.filter((s) => s !== skill),
    }));
  };

  // Filter skills based on search term
  const filteredSkills = skillsList.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle next button click
  const handleNext = () => {
    if (selectedSkills.length === 0) {
      setShowToast(true);
    } else {
      setShowToast(false);
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>Алхам 2/5</div>

        {/* Left Section: Instructions for the Client */}
        <div className={styles.left}>
          <h1 className="text-2xl font-bold text-gray-800">Шаардлагатай ур чадварууд</h1>
          <p className="mt-4 text-gray-600">
            Та фрилансер хайхдаа шаардлагатай ур чадваруудаа сонгоно уу. Ур чадварууд нь таны ажлын
            шаардлагад нийцсэн фрилансерийг олоход туслах болно.
          </p>
        </div>

        {/* Right Section: Search and Skill Selection */}
        <div className={styles.right}>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Ур чадвараа хайх..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Display filtered skills */}
          <div className={styles["skill-list"]}>
            {filteredSkills.map((skill, index) => (
              <div
                key={index}
                className={styles["skill-item"]}
                onClick={() => handleSkillSelect(skill)}
              >
                {skill}
              </div>
            ))}
          </div>

          {/* Display selected skills */}
          <div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">Сонгосон ур чадварууд:</h2>
            <ul>
              {selectedSkills.map((skill, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {skill}
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    Устгах
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons for navigating between steps */}
          <div className="mt-6 flex justify-between">
            <button onClick={onPrev} className="text-blue-500">Буцах</button>
            <button onClick={handleNext} className="bg-blue-500 text-white p-2 rounded-md">Дараагийн алхам</button>
          </div>
        </div>
      </div>

      {/* Toast haruulah skill songoogui bol */}
      {showToast && (
        <Toast message="Ур чадвар сонгоно уу!" onClose={() => setShowToast(false)}></Toast>
      )}
    </div>
  );
};  

export default Skill;
