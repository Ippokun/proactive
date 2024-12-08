import React, { useState } from "react";
import { useJobPostContext } from "../JobPostContext";
import FileUpload from "../../../../components/fileUpload";
import styles from "../../../../components/style/description.module.css";

interface DescriptionProps {
  onPrev: () => void;
}

const Description: React.FC<DescriptionProps> = ({ onPrev }) => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [fileList, setFileList] = useState<File[]>([]); // Temporarily store the file list here

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobPostData((prevData) => ({
      ...prevData,
      description: e.target.value,
    }));
  };

  const handleSubmitJobPost = async () => {
    if (
      !jobPostData.description ||
      !jobPostData.title ||
      !jobPostData.skills ||
      !jobPostData.deadline ||
      !jobPostData.subDeadline ||
      !jobPostData.projectType ||
      !jobPostData.budgetType
    ) {
      alert("Та бүх шаардлагатай талбаруудыг бөглөөгүй байна!");
      return;
    }
  
    try {
      const formData = new FormData();
      
      formData.append("title", jobPostData.title);
      formData.append("description", jobPostData.description);
      formData.append("skills", JSON.stringify(jobPostData.skills)); // Assuming skills is an array
      formData.append("deadline", jobPostData.deadline);
      formData.append("subDeadline", jobPostData.subDeadline);
      formData.append("projectType", jobPostData.projectType);
      formData.append("budgetType", jobPostData.budgetType);
  
      // Handling nullable numbers
      formData.append("hourlyRateFrom", jobPostData.hourlyRateFrom ? jobPostData.hourlyRateFrom.toString() : '');
      formData.append("hourlyRateTo", jobPostData.hourlyRateTo ? jobPostData.hourlyRateTo.toString() : '');
      formData.append("projectMaxBudget", jobPostData.projectMaxBudget ? jobPostData.projectMaxBudget.toString() : '');
  
      // Append the file attachments
      fileList.forEach((file) => formData.append("attachments", file));
  
      // Send the job post data to the backend
      const response = await fetch("/api/jobPost", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("Ажлын зар амжилттай бүртгэгдсэн!");
        setJobPostData({
          title: "",
          description: "",
          skills: [],
          deadline: "",
          subDeadline: "",
          projectType: "",
          budgetType: "",
          hourlyRateFrom: null,
          hourlyRateTo: null,
          projectMaxBudget: null,
          attachments: [],
        });
      } else {
        alert("Ажлын зар бүртгэж чадсангүй.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Алдаа гарлаа, дахин оролдоно уу.");
    }
  };
  
  function handleFilesSelected(files: File[]): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.stepIndicator}>Алхам 5/5</div>
        <div className="w-1/2 pr-8">
          <h1 className="text-3xl font-bold text-gray-800">Ажлын тайлбар ба хавсралт</h1>
          <p className="mt-4 text-gray-600">
            Та ажлын тайлбарыг оруулж, шаардлагатай файлуудыг хавсаргана уу.
          </p>
        </div>

        <div className="w-1/2 pl-8">
          <div className="mt-6">
            <label className={styles.label}>Ажлын тайлбар</label>
            <textarea
              value={jobPostData.description}
              onChange={handleDescriptionChange}
              className="mt-2 px-4 py-2 w-full h-32 border rounded-lg"
              placeholder="Ажлын тухай дэлгэрэнгүй мэдээлэл оруулна уу."
            />
          </div>

          <div className="mt-6">
            <label className={styles.label}>Хавсралт файлууд</label>
            <div className="mt-2">
              <FileUpload
                onFilesSelected={handleFilesSelected}
                multiple={true}
                accept="image/*, .pdf"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={onPrev} className="text-blue-500">
              Буцах
            </button>
            <button onClick={handleSubmitJobPost} className="bg-blue-500 text-white p-2 rounded-md">
              Ажлын зар бүртгэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
