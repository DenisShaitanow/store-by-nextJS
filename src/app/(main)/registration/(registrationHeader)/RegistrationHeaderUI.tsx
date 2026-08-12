"user client";

import React from "react";
import styles from "./RegistrationHeaderUI.module.css";
import CrossSvg from "../../../(components)/assets/cross.svg";
import { ButtonUI } from "../../../(components)/button/button";
import { Logo } from "../../../(components)/logo";

type RegistrationHeaderUIProps = {
  onClose: () => void;
};

export const RegistrationHeaderUI: React.FC<RegistrationHeaderUIProps> = ({
  onClose,
}) => (
  <div className={styles.header}>
    <Logo />
    <ButtonUI
      className={styles.closeButton}
      onClick={onClose}
      label="Закрыть"
      tertiary
    >
      <CrossSvg alt="Закрыть" />
    </ButtonUI>
  </div>
);
