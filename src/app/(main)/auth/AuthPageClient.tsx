// app/(auth)/auth/page.tsx
'use client';

import { type ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthPage.module.css';
import { loginUser } from '../../../services/thunks/user';
import { RegistrationHeaderUI } from '../registration/(registrationHeader)/RegistrationHeaderUI';
import { InputUI } from '../../(components)/input';
import { ButtonUI } from '../../(components)/button/button';
import { PasswordInputUI } from '../../(components)/password';
import { useAppDispatch } from '../../../services/hooks';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [authError, setAuthError] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setAuthError(false);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setAuthError(false);
  };

  const handleClose = () => {
    router.back();
  };

  const onClickButton = () => {
    let regDataObject;
    const regDataString = localStorage.getItem('regData');
    if (regDataString) {
      try {
        regDataObject = JSON.parse(regDataString);
      } catch {
        setAuthError(true);
        return;
      }
    }

    if (email === regDataObject?.email && password === regDataObject?.password) {
      dispatch(loginUser({ email, password }));
      router.push('/');
      router.refresh();
    } else {
      setAuthError(true);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <RegistrationHeaderUI onClose={handleClose} />
      <div className={styles.group}>
        <InputUI
          title="Email"
          type="email"
          placeholder="Введите email"
          name="email"
          value={email}
          onChange={handleChangeEmail}
        />
        <PasswordInputUI page="register" value={password} onChange={handleChangePassword} />
      </div>
      {authError && <span className={styles.authError}>Неправильный логин или пароль.</span>}
      <ButtonUI
        label="Войти"
        onClick={onClickButton}
        className={styles.buttonAuth}
        type="button"
        disabled={!email || password.length < 8}
      />
    </div>
  );
}
