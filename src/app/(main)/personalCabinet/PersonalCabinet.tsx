// app/personal-cabinet/page.tsx
'use client';

import { type FC, useState, type ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';
import { selectUser } from '../../../services/selectors/user-selectors/user-selectors';
import { FormUserInformationStepTwo } from '../registration/(step2)/step2/FormUserInformationStepTwo';
import { AvatarEditAccount } from '../../(components)/imageUploader/avatarEditAccount';
import { type RegistrationData } from '../../../types';
import { ButtonUI } from '../../(components)/button/button';
import { PasswordInputUI } from '../../(components)/password';
import { updateUser } from '../../../services/thunks/user';
import styles from './PersonalCabinet.module.css';

const PersonalCabinetPage: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);




  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [personalCabinetData, setPersonalCabinetData] = useState<RegistrationData>({
    email: user?.email ?? '',
    password: user?.password  || '',
    name: user?.name || '',
    surname: user?.surname  || '',
    avatar: user?.avatar || '',
    gender: user?.gender || '',
    location: user?.location || '',
    birthdayDate: user?.birthdayDate || '',
  });

  const handleChangeName = (val: string) => {
    setPersonalCabinetData((prev) => ({ ...prev, name: val }));
  };

  const handleSurnameChange = (val: string) => {
    setPersonalCabinetData((prev) => ({ ...prev, surname: val }));
  };

  const handleChangeAvatar = (val: File) => {
    setPersonalCabinetData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(val),
    }));
  };

  const handleGenderChange = (val: string) => {
    setPersonalCabinetData((prev) => ({ ...prev, gender: val }));
  };

  const handleLocationChange = (val: string) => {
    setPersonalCabinetData((prev) => ({ ...prev, location: val }));
  };

  const handleBirthdayDateChange = (val: string) => {
    setPersonalCabinetData((prev) => ({ ...prev, birthdayDate: val }));
  };

  const handleAvatar = (newImage: File) => {
    setAvatarFile(newImage);
    setPersonalCabinetData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(newImage),
    }));
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonalCabinetData((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleUpdatePersonalInformation = () => {
    
    dispatch(updateUser({userData: personalCabinetData, avatarFile: avatarFile}));
    router.back();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <AvatarEditAccount onImageChange={handleAvatar} initialAvatarUrl={user?.avatar} />
      <FormUserInformationStepTwo
        hiddenAvatarInput
        genderOptions={[
          { value: 'man', label: 'Мужской' },
          { value: 'woman', label: 'Женский' },
        ]}
        nameValue={personalCabinetData.name}
        nameChange={handleChangeName}
        surnameValue={personalCabinetData.surname}
        surnameChange={handleSurnameChange}
        changeAvatarUrl={handleChangeAvatar}
        genderValue={personalCabinetData.gender}
        genderChange={handleGenderChange}
        locatonValue={personalCabinetData.location}
        locationChange={handleLocationChange}
        birthdayDateChange={handleBirthdayDateChange}
        birthdayDateValue={new Date(personalCabinetData.birthdayDate)}
      />
      <PasswordInputUI
        page="register"
        value={personalCabinetData.password}
        onChange={handleChangePassword}
      />
      <ButtonUI
        label="Изменить данные"
        className={styles.changeData}
        onClick={handleUpdatePersonalInformation}
      />
    </div>
  );
};

export default PersonalCabinetPage;
