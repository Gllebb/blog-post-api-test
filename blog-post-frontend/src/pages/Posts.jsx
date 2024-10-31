import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Posts() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get("page")) || 1;

    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("access_token");

    const isPrevBtnDisabled = currentPage === 1;
    const isNextBtnDisabled = currentPage === totalPages;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);

    const openEditModal = (article) => {
        setCurrentArticle(article);
        setIsModalOpen(true);
    };

    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            const requestBody = {
                title: currentArticle.title,
                text: currentArticle.text,
            };

            const response = await axios.put(
                `http://localhost:8000/api/v1/articles/${currentArticle.id}`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsModalOpen(false);
            setCurrentArticle(null);

            toast.success("Article updated", {
                duration: 3500,
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        }

        return text;
    };

    async function handleArticleDelete(article_id) {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/articles/${article_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Article deleted:", response);

            setArticles((prevArticles) =>
                prevArticles.filter((article) => article.id !== article_id)
            );

            toast.success("Article deleted", {
                duration: 3500,
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/articles?page=${currentPage}`)
            .then((response) => response.json())
            .then((data) => {
                setArticles(data.data);
                setCurrentPage(data.meta.current_page);
                setTotalPages(data.meta.last_page);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [currentPage]);

    const handleNextPage = () => {
        console.log("Next page clicked");
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            navigate(`/articles?page=${nextPage}`);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            navigate(`/articles?page=${prevPage}`);
        }
    };

    return (
        <>
            <div className="w-[600px] mx-auto">
                <h1 className="text-2xl my-4 text-bold">Articles</h1>

                <ul>
                    {articles.map((article) => (
                        <li
                            key={article.id}
                            className="mb-2 border-2 border-gray-200 rounded-md p-2 hover:border-indigo-600 duration-300"
                        >
                            <h2 className="text-lg font-semibold">
                                <span>{article.id}. </span>
                                {truncateText(article.title, 20)}
                            </h2>
                            <p>{truncateText(article.text, 60)}</p>
                            <button
                                onClick={() => openEditModal(article)}
                                className={`mt-2 me-2 text-blue-500 hover:underline ${
                                    user_id == article.user.id ? "" : "hidden"
                                }`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleArticleDelete(article.id)}
                                className={`mt-2 text-red-500 hover:underline ${
                                    user_id == article.user.id ? "" : "hidden"
                                }`}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>

                <div
                    aria-label="Pagination"
                    className="flex items-center justify-between"
                >
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Page{" "}
                            <span className="font-medium">{currentPage}</span>{" "}
                            of
                            <span className="font-medium"> {totalPages}</span>
                        </p>
                    </div>
                    <div className="flex flex-1 justify-between sm:justify-end">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 ${
                                !isPrevBtnDisabled ? "hover:bg-gray-50" : ""
                            } ${isPrevBtnDisabled ? "opacity-50" : ""}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ${
                                !isNextBtnDisabled ? "hover:bg-gray-50" : ""
                            } ${isNextBtnDisabled ? "opacity-50" : ""}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-[800px]">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Article
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={currentArticle.title}
                                    onChange={(e) =>
                                        setCurrentArticle({
                                            ...currentArticle,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full mt-1 p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">
                                    Text
                                </label>
                                <textarea
                                    value={currentArticle.text}
                                    onChange={(e) => {
                                        setCurrentArticle({
                                            ...currentArticle,
                                            text: e.target.value,
                                        });
                                    }}
                                    className="w-full mt-1 p-2 border rounded-md"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
