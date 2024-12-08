"use client";

import React, { useState } from "react";
import Header from "../../../components/header";
import { JobPostProvider } from "./JobPostContext";
import Title from "./steps/title";
import Skill from "./steps/skill";
import Scope from "./steps/scope"; 
import Budget from "./steps/budget"; 
import Description from "./steps/description"; 
// import Review from "./Review";
// import Review from "./review"; // Example of the final step

export default function JobPost() {
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (first step)

  // Define the steps and pass props for navigation
  const steps = [
    <Title onNext={() => setCurrentStep(1)} />,
    <Skill
      onNext={() => setCurrentStep(2)}
      onPrev={() => setCurrentStep(0)}
    />,
    <Scope onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />,
    <Budget onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />,
    <Description  onPrev={() => setCurrentStep(3)} />,
    // <Review/>
    // <Review onPrev={() => setCurrentStep(2)} />, // Final step
  ];

  return (
    <JobPostProvider>
      <div>
        <Header />
        <div>{steps[currentStep]}</div>
      </div>
    </JobPostProvider>
  );
}
