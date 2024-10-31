import { toast, Toaster, ToastBar } from "react-hot-toast";

export default function CustomToaster() {
    return (
        <Toaster position="top-right" reverseOrder={false}>
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== "loading" && (
                                <button onClick={() => toast.dismiss(t.id)}>
                                    X
                                </button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
}
