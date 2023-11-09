import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("name");

  // function to logout user
  const handleLogout = async () => {
    const getToken = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );
      if (res?.status === 200) {
        navigate("/login");
        localStorage.clear();
        toast.success(res.data.message);
      }
    } catch (error: any) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand ms-4" href="/">
          TODO APP
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            {isUserLoggedIn && (
              <>
                <li className="nav-item text-light me-2">{username}</li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-sm btn-warning me-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
