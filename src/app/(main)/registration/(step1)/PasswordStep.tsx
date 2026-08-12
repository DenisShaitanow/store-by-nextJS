"user client";

import styles from "./PasswordStep.module.css";
import { type PasswordStepProps } from "./type";
import { ExternalAuthButton } from "../../../(components)/externalAuthButton/ExternalAuthButton";
import { InputUI } from "../../../(components)/input";
import { ButtonUI } from "../../../(components)/button/button";
import { PasswordInputUI } from "../../../(components)/password";
import GoogleIconUrl from "../../../(components)/assets/google-icon.svg";
import AppleIconUrl from "../../../(components)/assets/apple-icon.svg";

export const PasswordStep: React.FC<PasswordStepProps> = ({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  error = false,
  errorText,
  onClickButton,
}) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.wrapper}>
        <div className={styles.group}>
          <ExternalAuthButton
            label="Продолжить с Google"
            type="button"
            onClick={() =>
              console.log("Авторизация через учетную запись Google")
            }
          >
            <GoogleIconUrl/>
          </ExternalAuthButton>
          <ExternalAuthButton
            label="Продолжить с Apple"
            type="button"
            onClick={() =>
              console.log("Авторизация через учетную запись Apple")
            }
          >
            <AppleIconUrl/>
          </ExternalAuthButton>
        </div>
        <span className={styles.span}>или</span>
        <div className={styles.group}>
          <InputUI
            title="Email"
            type="email"
            placeholder="Введите email"
            name="email"
            value={email}
            onChange={onChangeEmail}
            error={error}
            errorText={errorText}
            dataCy={"registrationInputEmail"}
          />
          <PasswordInputUI
            page="register"
            value={password}
            onChange={onChangePassword}
            dataCy={"registrationInputPassword"}
          />
        </div>
      </div>
      <ButtonUI
        label="Далее"
        onClick={onClickButton}
        className={styles.button}
        type="button"
        disabled={!email || password.length < 8 || error}
        dataCy={"buttonStep1"}
      />
    </div>
  </div>
);
