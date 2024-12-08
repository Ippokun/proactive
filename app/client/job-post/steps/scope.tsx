import React, { useState } from "react";
import { useJobPostContext } from "../JobPostContext";
import Toast from "../../../../components/toast";
import styles from "../../../../components/style/scope.module.css";

interface ScopeStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const Scope: React.FC<ScopeStepProps> = ({ onNext, onPrev }) => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [showToast, setShowToast] = useState(false); // State to control Toast visibility

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "large" | "medium" | "small"; // Cast to valid type
    setJobPostData((prevData) => ({
      ...prevData,
      projectType: value, // Ensure correct type assignment
      subDeadline: "", // Reset subDeadline when projectType changes
    }));
  };

  const handleSubDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobPostData((prevData) => ({
      ...prevData,
      subDeadline: value, // Correctly update subDeadline
    }));
  };

  const handleNext = () => {
    if (!jobPostData.projectType || !jobPostData.subDeadline) {
      setShowToast(true); // Show toast when project type or subdeadline is missing
    } else {
      setJobPostData((prevData) => ({
        ...prevData,
        deadline: jobPostData.subDeadline || "", // Ensure it's always a string, even if undefined
      }));
      onNext();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.stepIndicator}>Алхам 3/5</div>

        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-bold text-gray-800">Төслийн хэмжээ</h1>
          <p className="mt-4 text-gray-600">
            Та өөрийн төслийн хугацааг болон төслийн төрлийг сонгоно уу.
          </p>
        </div>

        <div className="w-1/2 pl-8">
          <div>
            <label className={styles.label}>Төслийн төрөл</label>
            <div className="mt-4 flex flex-col">
              <label className="text-gray-700">
                <input
                  type="radio"
                  value="large"
                  checked={jobPostData.projectType === "large"}
                  onChange={handleProjectTypeChange}
                  className="mr-2"
                />
                Том (Урт хугацааны, төвөгтэй төсөл)
              </label>
              <label className="text-gray-700">
                <input
                  type="radio"
                  value="medium"
                  checked={jobPostData.projectType === "medium"}
                  onChange={handleProjectTypeChange}
                  className="mr-2"
                />
                Дунд (Тодорхой төсөл)
              </label>
              <label className="text-gray-700">
                <input
                  type="radio"
                  value="small"
                  checked={jobPostData.projectType === "small"}
                  onChange={handleProjectTypeChange}
                  className="mr-2"
                />
                Бага (Тохиромжтой, шууд даалгавар)
              </label>
            </div>
          </div>

          {jobPostData.projectType && (
            <div className="mt-6">
              <label className={styles.label}>Орох хугацаа</label>
              <div className="mt-4 flex flex-col">
                {jobPostData.projectType === "large" && (
                  <>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="moreThan6Months"
                        checked={jobPostData.subDeadline === "moreThan6Months"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      6 сараас дээш
                    </label>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="3to6Months"
                        checked={jobPostData.subDeadline === "3to6Months"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      3-6 сар
                    </label>
                  </>
                )}
                {jobPostData.projectType === "medium" && (
                  <>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="moreThan3Months"
                        checked={jobPostData.subDeadline === "moreThan3Months"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      3 сараас дээш
                    </label>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="1to3Months"
                        checked={jobPostData.subDeadline === "1to3Months"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      1-3 сар
                    </label>
                  </>
                )}
                {jobPostData.projectType === "small" && (
                  <>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="lessThan1Week"
                        checked={jobPostData.subDeadline === "lessThan1Week"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      1 долоо хоног
                    </label>
                    <label className="text-gray-700">
                      <input
                        type="radio"
                        value="1To2Weeks"
                        checked={jobPostData.subDeadline === "1To2Weeks"}
                        onChange={handleSubDeadlineChange}
                        className="mr-2"
                      />
                      1-2 долоо хоног
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

        <div className="mt-6 flex justify-between">
            <button onClick={onPrev} className="text-blue-500">Буцах</button>
            <button onClick={handleNext} className="bg-blue-500 text-white p-2 rounded-md">Дараагийн алхам</button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Төслийн төрөл болон хугацаа сонгоно уу!"
          onClose={() => setShowToast(false)} // Hide toast when closed
        />
      )}
    </div>
  );
};

export default Scope;
