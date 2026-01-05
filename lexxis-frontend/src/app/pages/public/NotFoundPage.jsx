import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div>
            <h1>404</h1>
            <p>No existe esta ruta.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
}
