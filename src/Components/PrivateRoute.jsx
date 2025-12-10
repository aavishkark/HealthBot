import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
export const PrivateRoute = ({children}) => {
  const {loggedIn} = useAuth()
return (
    <>
      {
        loggedIn ? children : <Navigate to={"/login"} />
      }
    </>
  )
}