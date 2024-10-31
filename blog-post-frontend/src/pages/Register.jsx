import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [nameError, setNameError] = useState("");
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
        setNameError("");
        setEmailError("");
        setPasswordError("");

        if (!name) {
            setNameError("Name is required");
            isValid = false;
        }

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
            const requestBody = { name, email, password };
            await axios.post(
                "http://localhost:8000/api/v1/register",
                requestBody
            );

            navigate("/login");
        } catch (error) {
            setNameError(error.response.data.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mb-20">
                <h1 className="text-2xl font-bold mb-4">Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="name">Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            className="form-control border-2 border-gray-200 rounded-lg"
                        />
                        {nameError && (
                            <span className="text-red-500">{nameError}</span>
                        )}
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="name">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="form-control border-2 border-gray-200 rounded-lg"
                        />
                        {emailError && (
                            <span className="text-red-500">{nameError}</span>
                        )}
                    </div>

                    <div className="flex flex-col mb-4">
                        <label htmlFor="name">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="text"
                            className="form-control border-2 border-gray-200 rounded-lg"
                        />
                        {passwordError && (
                            <span className="text-red-500">{nameError}</span>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="btn">
                            Register
                        </button>

                        <Link to="/login" className="btn">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
