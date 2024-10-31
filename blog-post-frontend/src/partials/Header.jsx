import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HomeIcon, InfoCircledIcon, PersonIcon, Pencil1Icon, ExitIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

export default function Header() {
    const isLoggedIn = !!localStorage.getItem("access_token");
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("access_token");
        navigate("/");
        toast.success("Logged out successfully", {
            duration: 3500,
        });
    }

    return (
        <div className="flex justify-between py-3">
            <div className="flex gap-4">
                <div className="flex items-center gap-1 group">
                    <HomeIcon className="group-hover:text-gray-500 duration-200" />
                    <Link
                        to="/"
                        className="group-hover:text-gray-500 duration-200"
                    >
                        Home
                    </Link>
                </div>

                <div className="flex items-center gap-1 group">
                    <InfoCircledIcon className="group-hover:text-gray-500 duration-200" />
                    <Link
                        to="/about"
                        className="group-hover:text-gray-500 duration-200"
                    >
                        About
                    </Link>
                </div>
            </div>

            <div className="flex flex-row gap-1 items-center group">
                <Pencil1Icon className="group-hover:text-gray-500 duration-200" />
                <Link
                    to="/articles?page=1"
                    className="group-hover:text-gray-500 duration-200"
                >
                    Articles
                </Link>
            </div>

            <div className="flex gap-4">
                {isLoggedIn && (
                    <>
                        <div className="flex items-center gap-1 group">
                            <PersonIcon className="group-hover:text-gray-500 duration-200" />
                            <Link
                                to="/profile"
                                className="group-hover:text-gray-500 duration-200"
                            >
                                Profile
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 group">
                            <ExitIcon className="group-hover:text-gray-500 duration-200" />
                            <button
                                to="/logout"
                                className="group-hover:text-gray-500 duration-200"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}

                {!isLoggedIn && (
                    <>
                        <Link
                            to="/login"
                            className="group-hover:text-gray-500 duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="group-hover:text-gray-500 duration-200"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
