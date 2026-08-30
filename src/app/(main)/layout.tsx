import { mockedGetUserApi } from '../../services/api';
import  MainLayoutClient  from './MainLayoutClient';
import { cookies } from 'next/headers';


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  const cookieStore = await cookies();
  const successToken = cookieStore.get('successToken')?.value || '';
  
  
  let isAuth = false; 
  
  
  let user;
  
 
    try {
      const userData = await mockedGetUserApi(successToken); 
      if (userData) {
        user = userData.user;
        isAuth = userData.isAuthenticated;
      }
    } catch (error) {
      console.log('Нет пользователя.')
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