import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const cardStyle = {
  boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
};
const redAsteriskStyle = {
  color: "red",
  marginLeft: "4px",
};
const linkStyle = {
  textDecoration: "none",
};

interface LoginForm {
  email: string;
  password: string;
}

const initialState: LoginForm = {
  email: "",
  password: "",
};
const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", formData);
      if (res?.status === 200) {
        toast.success(res.data.message);
        localStorage.setItem("token", res?.data.token);
        localStorage.setItem("name", res?.data.user.name);
        navigate("/home");
      }
    } catch (error: any) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5">
            <div className="card" style={cardStyle}>
              <div className="card-header bg-primary text-light">
                <h3 className="text-center font-bold">LOGIN</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group  mt-4">
                    <label htmlFor="exampleInputEmail1">
                      Email <span style={redAsteriskStyle}>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control mt-1"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label htmlFor="exampleInputPassword1">
                      Password <span style={redAsteriskStyle}>*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control mt-1"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e)
                      }
                    />
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center">
                New User ?{" "}
                <Link to="/" className="text-primary" style={linkStyle}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
