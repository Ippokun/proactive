import React, { useState } from "react";
import { useJobPostContext } from "../JobPostContext";
import styles from "../../../../components/style/title.module.css";
import Toast from "../../../../components/toast";

interface TitleStepProps {
  onNext: () => void;
}

const Title: React.FC<TitleStepProps> = ({ onNext }) => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [title, setTitle] = useState(jobPostData.title || ""); // Default to an empty string if undefined
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!title.trim()) {
      setShowToast(true); 
      return;
    }

    setJobPostData((prevData) => ({
      ...prevData,
      title,
    }));

    onNext();
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>Алхам 1/5</div>

        {/* Left Section */}
        <div className={styles.left}>
          <h1 className="text-2xl font-bold text-gray-800">Ажлын гарчиг</h1>
          <p className="mt-4 text-gray-600">
            Та ажлынхаа гарчгийг оруулна уу. Гарчиг нь таны ажлыг илүү ойлгомжтой болгож, зөв
            фрилансер хайхад туслах болно.
          </p>
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          <form className={styles.form} onSubmit={handleNext}>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Ажлын гарчиг
            </label>
            <input
              id="title"
              type="text"
              className={styles.input}
              placeholder="Жишээ: Вэбсайт хөгжүүлэх"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-between">
              <button type="submit" className={styles.button}>
                Дараагийн алхам
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Show Toast if there is an error */}
      {showToast && <Toast message="Гарчиг оруулна уу!" onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default Title;
