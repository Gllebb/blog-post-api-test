import Header from "../partials/Header";
import Footer from "../partials/Footer";
import CustomToaster from "../partials/CustomToaster";

export default function Layout({ children }) {
    return (
        <>
            <CustomToaster />
            <div className="container mx-auto">
                <Header />
                <main>{children}</main>
                <Footer />
            </div>
        </>
    );
}
