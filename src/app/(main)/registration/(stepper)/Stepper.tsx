"user client";

import React from "react";

import styles from "./Stepper.module.css";

export interface StepperProps {
  currentStep: number;
  overallSteps: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, overallSteps }) => {
  const steps = Array.from({ length: overallSteps }, (_, i) => i + 1);

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperText}>
        Шаг {currentStep} из {overallSteps}
      </div>
      <div className={styles.stepperBars}>
        {steps.map((step) => (
          <div
            key={step}
            className={`${styles.stepperBar} ${
              step <= currentStep ? styles.active : styles.inactive
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;
