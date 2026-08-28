import { mockedGetUserApi } from '../../services/api';
import  MainLayoutClient  from './MainLayoutClient';


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let isAuth = false;
  
  try {
    const userData = await mockedGetUserApi(); 
    if (userData) {
      user = userData.user;
      isAuth = userData.isAuthenticated;
    }
  } catch (error) {
    
  }

  
  return (
    <MainLayoutClient 
      user={user}
      isAuth={isAuth}
    >
      {children}
    </MainLayoutClient>
  );
}