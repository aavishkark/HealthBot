import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export const PrivateRoute = ({children}) => {
  const isAuth = useSelector((store) => store.AuthReducer.isAuth);
return (
    <>
      {
        isAuth === "true" ? children : <Navigate to={"/login"} />
      }
    </>
  )
}