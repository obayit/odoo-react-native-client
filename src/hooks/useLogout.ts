import { useDispatch } from "react-redux";
import { logOut } from "../common/store/authSlice";

function useLogout () {
    const dispatch = useDispatch();
    const logout = () => {
        // here you can clear local cache and files if there is any
        // todo: call server logout endpoint to improve security
        dispatch(logOut());
    }
    return {
        logout,
    }
}

export default useLogout
