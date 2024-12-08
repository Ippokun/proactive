import React, { useState } from "react";
import { useJobPostContext } from "../JobPostContext";
import BudgetInput from "../../../../components/budgetInput";  // Import the BudgetInput component
import styles from "../../../../components/style/budget.module.css";

interface BudgetStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const Budget: React.FC<BudgetStepProps> = ({ onNext, onPrev }) => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBudgetTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "hourly" | "project";
    setJobPostData((prev) => ({
      ...prev,
      budgetType: value,
      hourlyRateFrom: null,
      hourlyRateTo: null,
      projectMaxBudget: null,
    }));
    setErrorMessage(null); // Clear error message on change
  };

  const handleNext = () => {
    const { budgetType, hourlyRateFrom, hourlyRateTo, projectMaxBudget } = jobPostData;

    if (budgetType === "hourly") {
      if (!hourlyRateFrom || !hourlyRateTo) {
        setErrorMessage("Та цагийн хөлсөө сонгоно уу!");
        return;
      }
      if (hourlyRateFrom < 5000) {
        setErrorMessage("Цагийн хөлс хамгийн багадаа 5,000₮ байх ёстой.");
        return;
      }
      if (hourlyRateFrom >= hourlyRateTo) {
        setErrorMessage("Эхний хөлс нь хамгийн их хөлсөөс бага бөгөөд тэнцүү байж болохгүй.");
        return;
      }
    } else if (budgetType === "project") {
      if (!projectMaxBudget) {
        setErrorMessage("Та төслийн нийт төсвөө сонгоно уу!");
        return;
      }
      if (projectMaxBudget < 10000) {
        setErrorMessage("Төслийн төсөв хамгийн багадаа 10,000₮ байх ёстой.");
        return;
      }
    }

    setErrorMessage(null); // Clear errors on success
    onNext(); // Proceed to the next step
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.stepIndicator}>Алхам 4/5</div>

        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-bold text-gray-800">Төсвөө сонгоно уу</h1>
          <p className="mt-4 text-gray-600">Та төсвийн төрлийг сонгоно уу.</p>
        </div>

        <div className="w-1/2 pl-8">
          <div>
            <label className={styles.label}>Төсвийн төрөл</label>
            <div className="mt-4 flex flex-col">
              <label className="text-gray-700">
                <input
                  type="radio"
                  value="hourly"
                  checked={jobPostData.budgetType === "hourly"}
                  onChange={handleBudgetTypeChange}
                  className="mr-2"
                />
                Цагийн хөлс
              </label>
              <label className="text-gray-700">
                <input
                  type="radio"
                  value="project"
                  checked={jobPostData.budgetType === "project"}
                  onChange={handleBudgetTypeChange}
                  className="mr-2"
                />
                Нийт төслийн хөлс
              </label>
            </div>
          </div>

          {/* Conditional Inputs for Budget Type */}
          {jobPostData.budgetType === "hourly" && (
            <div className="mt-6">
              <label className={styles.label}>Цагийн хөлс</label>
              <div className="flex space-x-4 mt-4">
                <div>
                  <label className="text-gray-700">Эхний хөлс</label>
                  <BudgetInput
                    value={jobPostData.hourlyRateFrom}
                    onChange={(value) =>
                      setJobPostData((prev) => ({ ...prev, hourlyRateFrom: value }))
                    }
                    placeholder="10,000₮"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Хамгийн их хөлс</label>
                  <BudgetInput
                    value={jobPostData.hourlyRateTo}
                    onChange={(value) =>
                      setJobPostData((prev) => ({ ...prev, hourlyRateTo: value }))
                    }
                    placeholder="15,000₮"
                  />
                </div>
              </div>
            </div>
          )}

          {jobPostData.budgetType === "project" && (
            <div className="mt-6">
              <label className={styles.label}>Төслийн нийт төсөв</label>
              <div className="mt-4">
                <BudgetInput
                  value={jobPostData.projectMaxBudget}
                  onChange={(value) =>
                    setJobPostData((prev) => ({ ...prev, projectMaxBudget: value }))
                  }
                  placeholder="Төсвийн дүн"
                />
              </div>
            </div>
          )}

          {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}

          <div className="mt-6 flex justify-between">
            <button onClick={onPrev} className="text-blue-500">Буцах</button>
            <button onClick={handleNext} className="bg-blue-500 text-white p-2 rounded-md">Дараагийн алхам</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
