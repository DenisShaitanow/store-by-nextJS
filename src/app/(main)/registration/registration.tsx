// app/registration/RegistrationClient.tsx
"use client";

import { type FC, type ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../services/hooks";
import { registerUser } from "../../../services/thunks/user/user-thunks";
import { type RegistrationData } from "../../../types";
import { RegistrationHeaderUI } from "./(registrationHeader)/RegistrationHeaderUI";
import Stepper from "./(stepper)/Stepper";
import { ButtonUI } from "../../(components)/button/button";
import { PasswordStep } from "./(step1)/PasswordStep";
import { FormUserInformationStepTwo } from "./(step2)/step2/FormUserInformationStepTwo";
import styles from "./registration.module.css";

const RegistrationClient: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [gender, setGender] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [birthdayDate, setBirthdayDate] = useState<string>("");
  const [regData, setRegData] = useState<RegistrationData>({
    email: "",
    password: "",
    name: "",
    surname: "",
    avatar: "",
    gender: "",
    location: "",
    birthdayDate: "",
  });

  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleClickButton = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setRegData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setRegData((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleChangeName = (val: string) => {
    setName(val);
    setRegData((prev) => ({ ...prev, name: val }));
  };

  const handleSurnameChange = (val: string) => {
    setSurname(val);
    setRegData((prev) => ({ ...prev, surname: val }));
  };

  const handleChangeAvatar = (val: File) => {
    setAvatar(val);
    setRegData((prev) => ({ ...prev, avatar: URL.createObjectURL(val) }));
  };

  const handleGenderChange = (val: string) => {
    setGender(val);
    setRegData((prev) => ({ ...prev, gender: val }));
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    setRegData((prev) => ({ ...prev, location: val }));
  };

  const handleBirthdayDateChange = (val: string) => {
    setBirthdayDate(val);
    setRegData((prev) => ({ ...prev, birthdayDate: val }));
  };

  const handleClickBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleClickRegistrationButton = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("regData", JSON.stringify(regData));
    }
    dispatch(registerUser(regData));
    router.push("/");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <RegistrationHeaderUI onClose={handleClose} />
      <Stepper currentStep={currentStep} overallSteps={2} />
      {currentStep === 1 && (
        <PasswordStep
          onClickButton={handleClickButton}
          email={email}
          password={password}
          onChangeEmail={handleChangeEmail}
          onChangePassword={handleChangePassword}
        />
      )}
      {currentStep === 2 && (
        <div className={styles.step2}>
          <FormUserInformationStepTwo
            hiddenAvatarInput={false}
            genderOptions={[
              { value: "man", label: "Мужской" },
              { value: "woman", label: "Женский" },
            ]}
            nameValue={name}
            nameChange={handleChangeName}
            surnameValue={surname}
            surnameChange={handleSurnameChange}
            changeAvatarUrl={handleChangeAvatar}
            genderValue={gender}
            genderChange={handleGenderChange}
            locatonValue={location}
            locationChange={handleLocationChange}
            birthdayDateChange={handleBirthdayDateChange}
          />
          <div className={styles.buttonsContainer}>
            <ButtonUI
              onClick={handleClickBack}
              label="Назад"
              className={styles.buttonPadding}
            />
            <ButtonUI
              dataCy="registrationButton"
              disabled={
                !regData.email ||
                !regData.password ||
                !regData.birthdayDate ||
                !regData.gender ||
                !regData.location ||
                !regData.name ||
                !regData.surname
              }
              onClick={handleClickRegistrationButton}
              label="Зарегистрироваться"
              className={styles.buttonPadding}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationClient;
