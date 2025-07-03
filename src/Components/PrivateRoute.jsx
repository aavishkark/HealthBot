import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
export const PrivateRoute = ({children}) => {
  const {loggedin} = useAuth()
return (
    <>
      {
        loggedin === "true" ? children : <Navigate to={"/login"} />
      }
    </>
  )
}