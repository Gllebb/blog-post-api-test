import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            navigate("/");
        }
    }, [navigate]);

    function validate() {
        let isValid = true;

        // for a reset
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        }

        if (!email.includes("@")) {
            setEmailError("Invalid email");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        }

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const requestBody = { email, password };
            const response = await axios.post(
                "http://localhost:8000/api/v1/login",
                requestBody
            );
            console.log(response.data);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("user_id", response.data.user.id);

            navigate("/");
            toast.success("Login successful", {
                duration: 3500,
            });
        } catch (error) {
            setEmailError(error.response.data.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mb-20">
                <h1 className="text-2xl font-bold mb-4">Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="form-control border-gray-200 border-2 rounded-lg"
                            id="email"
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm">{emailError}</p>
                        )}
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            className="form-control border-2 border-gray-200 rounded-lg"
                            id="password"
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="btn">
                            Login
                        </button>

                        <Link to="/register" className="btn">
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
