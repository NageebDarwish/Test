import { useEffect, useRef, useState } from "react";
import Cookie from "cookie-universal";

import axios from "axios";
import { REGISTER, baseURL } from "../../Api/Api";
import "./Auth.css";
import Loading from "../../Components/Loading";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  //  States
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Err
  const [err, setErr] = useState("");

  // Ref
  const focus = useRef("");

  // Loading

  const [loading, setLoading] = useState(false);

  // Cookies
  const cookie = Cookie();

  // Handle Focus
  useEffect(() => {
    focus.current.focus();
  }, []);

  //   Handle Form Change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  //   Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/${REGISTER}`, form);
      const token = res.data.token;
      setLoading(false);
      cookie.set("e-commerce", token);
      navigate("/dashboard/users", { replace: true });
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.response.status === 422) {
        setErr("Email is already been taken");
      } else {
        setErr("Internal Server ERR");
      }
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container">
        <div className="row" style={{ height: "100vh" }}>
          <Form onSubmit={handleSubmit} className="form">
            <div className="custom-form">
              <h1 className="mb-3">Register Now</h1>

              <Form.Group className="form-custom">
                <Form.Control
                  ref={focus}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  placeholder="Enter Your Name.."
                  required
                />
                <Form.Label>Name:</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom">
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  placeholder="Enter Your Email.."
                  required
                />
                <Form.Label>Email:</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom">
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  placeholder="Enter Your Password.."
                  required
                  minLength="6"
                />
                <label htmlFor="password">Password:</label>
              </Form.Group>
              <button className="btn btn-primary">Register</button>
              <div className="google-btn">
                <a href="http://127.0.0.1:8000/login-google">
                  <div className="google-icon-wrapper">
                    <img
                      className="google-icon"
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="sing in with google"
                    />
                  </div>
                  <p className="btn-text-custom">
                    <b>Register with google</b>
                  </p>
                </a>
              </div>
              {err !== "" && <span className="error">{err}</span>}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
