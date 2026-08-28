'use client';

import '../globals.css';
import '../variables.css';

import { usePathname, useRouter } from 'next/navigation'; // ← вместо useNavigate, useLocation
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { logoutUser } from '../../services/thunks/user';
import { selectIsAuth } from '../../services/selectors/user-selectors/user-selectors';
import { HeaderUI } from '../(components)/header';
import { SpinnerPulse } from '../(components)/spinnerPulse';
import styles from './layout.module.css';
import { useEffect, useContext } from 'react';
import { selectUserLoading } from '../../services/selectors/user-selectors/user-selectors';
import { selectUser } from '../../services/selectors/user-selectors/user-selectors';
import { checkUserAuth } from '../../services/thunks/user';
import { ThemeContext } from '../(themeContext)/ThemeContext';
import { getProducts } from '../../services/thunks/userUIData/userUIData-thunks';
import { IServerUser } from '../../services/api';
import { setUserSlice2 } from '../../services/slices/userUIData';
import { setUserSlice1 } from '../../services/slices/user/userSlice';

interface  MainLayoutClientProps {
    children: React.ReactNode,
    user: IServerUser | null,
    isAuth: boolean
}

export default function MainLayoutClient({ children, user, isAuth }: MainLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { theme } = useContext(ThemeContext);

  // Проверяем, страница ли это регистрации/логина
  const isRegistrationPage = pathname === '/registration' || pathname === '/auth';   
  const isLoading: boolean = useAppSelector(selectUserLoading) || false;
 

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleRegister = () => {
    router.push('/registration');
  };

  const handleClickLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(setUserSlice1(user));
    dispatch(setUserSlice2(user));
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <SpinnerPulse className={styles.spinner} />
      ) : (
        <div className={styles.layout}>
          {!isRegistrationPage && (
            <HeaderUI
              handleClickLogout={handleClickLogout}
              user={user?.profile}
              onLoginClick={handleLogin}
              onRegisterClick={handleRegister}
              isModal={false}
              isAuth={isAuth}
              isNotification={false}
              theme={theme}
            />
          )}
          {children}
        </div>
      )}
    </>
  );
}
