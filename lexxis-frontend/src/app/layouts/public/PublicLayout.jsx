import { Outlet } from "react-router-dom";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";

export default function PublicLayout() {
    return (
        <div style={styles.page}>
            <Header />
            <main style={styles.main}>
                <div style={styles.container}>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%"
    },
    main: {
        flex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "40px 0"
    },
    container: {
        container: {
            width: "100%",
            maxWidth: "100%",
            padding: "0 4vw",
            boxSizing: "border-box"
        },
    },
};
