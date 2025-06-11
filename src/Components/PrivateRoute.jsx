import { Navigate } from 'react-router-dom';
export const PrivateRoute = ({children}) => {
  const isAuth = localStorage.getItem('isAuth');
return (
    <>
      {
        isAuth === "true" ? children : <Navigate to={"/login"} />
      }
    </>
  )
}