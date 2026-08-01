"user client";

import React from "react";
import styles from "./RegistrationHeaderUI.module.css";
import CrossSvg from "../../../ui/assets/cross.svg";
import { ButtonUI } from "../../../ui/button";
import { Logo } from "../../../ui/logo";

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
      <img src={CrossSvg} alt="Закрыть" />
    </ButtonUI>
  </div>
);
