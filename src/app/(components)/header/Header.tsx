"use client";

import  Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./Header.module.css";

import CrossSvg from "../assets/cross.svg";

import type { THeaderUIProps } from "./type";

import { ButtonUI } from "../button/button";
import { Logo } from "../logo";
import { IconButton } from "../iconButton";
import { UserDropdownMenu } from "../userDropdownMenu";
import type { RegistrationData } from "../../../types";
import { useEffect, useContext } from "react";
import { ThemeContext } from "../../(themeContext)/ThemeContext";



import {  useAppSelector } from "../../../services/hooks";

import { selectUserLoading } from '../../../services/selectors/user-selectors/user-selectors';

export const HeaderUI = ({
  isModal,
  isAuth,
  isNotification,
  user,
  theme,
  handleClickLogout,
  onRegisterClick,
  onLoginClick,
  handleCloseButtonClick,
}: THeaderUIProps) => {
  // по макету на шагах регистрации
  const router = useRouter();

  const { toggleTheme } = useContext(ThemeContext);

  function handleClickLogo() {
    router.push("/");
  }

  let regData: RegistrationData;

  
    regData = {
      email: "",
      password: "",
      name: "",
      surname: "",
      avatar: "",
      gender: "",
      location: "",
      birthdayDate: "",
    }

  const avatarUrl =
    user && user.avatar
      ? user.avatar
      : regData && regData.avatar
        ? regData.avatar
        : "";

  const handleFavorits = () => {
    router.push("/favoritsProducts");
  };

  const handleBasket = () => {
    router.push("/basket");
  };

  const handleOpenNotifications = () => {
    router.push("/notifications");
  };

  if (isModal)
    return (
      <div className={styles.header}>
        <div className={styles.logoContainer} onClick={handleClickLogo}>
          <Logo />
        </div>
        <ButtonUI
          className={styles.closeButton}
          label="Закрыть"
          onClick={handleCloseButtonClick}
          tertiary
        >
          <img src={CrossSvg} alt="Закрыть" />
        </ButtonUI>
      </div>
    );

  return (
    <div className={`${styles.header}`}>
      <div
        data-cy={"headerLogo"}
        className={styles.logoContainer}
        onClick={handleClickLogo}
      >
        <Logo />
      </div>
      <div className={styles.menu}>
        <Link href="about" className={styles.link}>
          О проекте
        </Link>
      </div>

      <div className={styles.toolbar}>
        <IconButton
          type="theme"
          themeMode={theme === "dark" ? "dark" : "light"}
          onClick={() => {
            toggleTheme();
          }}
          aria-label="Переключить тему"
          dataCy={"sun"}
        />
        {isAuth && (
          <>
            <IconButton
              type="like"
              isLiked={false}
              aria-label="Избранное"
              onClick={handleFavorits}
            />

            <IconButton
              dataCy="basketHeaderButton"
              type="basket"
              aria-label="Корзина выбранных товаров"
              onClick={handleBasket}
            />

            <IconButton
              type="notification"
              dataCy="headerButtonNotification"
              ariaLabel="Открыть список уведомлений"
              onClick={handleOpenNotifications}
            />
          </>
        )}
      </div>
      {isAuth ? (
        <div className={styles.profile}>
          <UserDropdownMenu
            user={{
              nameUser: user?.name || "",
              avatarUrl: avatarUrl,
            }}
            onPersonalCabinetClick={() => {
              router.push("/personalCabinet"); // Навигация в личный кабинет
            }}
            onLogoutClick={() => {
              handleClickLogout && handleClickLogout();
            }}
            placement="bottom-right"
          />
        </div>
      ) : (
        <div>
          <div className={styles.authButtons_container}>
            <ButtonUI
              className={styles.loginButton}
              label="Войти"
              onClick={onLoginClick}
              secondary
              dataCy="Войти"
            />
            <ButtonUI
              className={styles.registerButton}
              label="Зарегистрироваться"
              onClick={onRegisterClick}
              secondary={false}
              dataCy={"registrationButton"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
