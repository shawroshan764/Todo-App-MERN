import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const alertStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const numberStyle = {
  backgroundColor: "white",
  color: "black",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

interface addTask {
  taskName: string;
}

const initialState: addTask = {
  taskName: "",
};
const Home = () => {
  const [task, setTask] = useState(initialState);
  const [userTask, setUserTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifySession = async () => {
    const getToken = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/verifySession", {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      console.log(res.data.tasks);
      setUserTask(res.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // function to add task
  const handleAddTask = async () => {
    const getToken = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:8000/api/addtask", task, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      if (res?.status === 200) {
        verifySession();
        toast.success(res.data.message);
        setTask({ ...task, taskName: "" });
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

  // function to delete task
  const handleDelete = async (id: string) => {
    try {
      const getToken = localStorage.getItem("token");
      let res = await axios.delete(
        `http://localhost:8000/api/deleteTask/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );
      if (res?.status === 200) {
        verifySession();
        toast.success(res.data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-4">
            <form className="mt-5">
              <div className="row">
                <div className="col">
                  <textarea
                    className="form-control"
                    placeholder="Add task...."
                    id="floatingTextarea2"
                    name="taskName"
                    value={task.taskName}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleChange(e)
                    }
                  ></textarea>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={handleAddTask}
                  >
                    ADD TASK
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6 offset-md-3">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            ) : (
              userTask.map((item: any, index: number) => {
                return (
                  <div
                    className="alert alert-secondary mt-4 text-center"
                    role="alert"
                    style={alertStyle}
                    key={index}
                  >
                    <div style={numberStyle}>{index + 1}</div>
                    {item.taskName}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ padding: "3px 6px", fontSize: "14px" }}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
