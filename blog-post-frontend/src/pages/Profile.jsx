import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    const [email, setEmail] = useState("");

    const token = localStorage.getItem("access_token");
    const user_id = localStorage.getItem("user_id");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [navigate, token]);

    useEffect(() => {
            fetch("http://localhost:8000/api/v1/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setName(data.user.name);
                    setEmail(data.user.email);
                });
    }, []);

    function validate() {
        let isValid = true;

        setNameError("");

        if (!name) {
            setNameError("Name is required");
            isValid = false;
        }

        if (!email) {
            setNameError("Email is required");
            isValid = false;
        }

        if (!email.includes("@")) {
            setNameError("Invalid email");
            isValid = false;
        }

        if (name.length < 2) {
            setNameError("Name must be at least 2 characters");
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);

        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/user/${user_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Profile updated successfully");
        } catch (error) {
            setNameError(error.statusText);
            console.log(error.response);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md mb-20">
                <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name">Name</label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {nameError && (
                            <p className="text-red-500 text-sm">{nameError}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="w-full flex flex-row justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 border-2 border-indigo-600 text-white rounded-md hover:bg-white hover:text-black transition-colors duration-300"
                        >
                            Submit
                        </button>

                        <button className="px-4 py-2 rounded-md border-2 border-gray-200 hover:border-indigo-600 duration-300">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
