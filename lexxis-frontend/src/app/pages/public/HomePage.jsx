import styles from "./HomePage.module.css";
import ButtonLink from "../../components/shared/ButtonLink";

export default function HomePage() {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.copy}>
                        <h1 className={styles.title}>Calzado impreso en 3D y servicios de impresión.</h1>
                        <p className={styles.lead}>
                            Lexxis combina un catálogo de calzado impreso en 3D y un servicio de de impresión
                            de archivos para producir bajo demanda. Explora sin registrarte y entra solo cuando lo necesites.
                        </p>

                        <div className={styles.ctas}>
                            <ButtonLink to="/products">Ver productos</ButtonLink>
                            <ButtonLink to="/prints" variant="ghost">Imprimir archivos</ButtonLink>
                        </div>

                        <div className={styles.badges}>
                            <span className={styles.badge}>Catálogo por variantes</span>
                            <span className={styles.badge}>Carrito público</span>
                            <span className={styles.badge}>Checkout protegido</span>
                        </div>
                    </div>

                    <div className={styles.visual}>
                        <div className={styles.visualCard}>
                            <div className={styles.visualLabel}>Imagen principal</div>
                            <div className={styles.visualHint}>
                                Aquí insertaremos una imagen/ilustración representativa (hero).
                                De momento es un placeholder.
                            </div>
                        </div>

                        <div className={styles.visualGrid}>
                            <div className={styles.visualMini}>
                                <div className={styles.visualLabel}>Imagen 1</div>
                                <div className={styles.visualHint}>Producto / variante</div>
                            </div>
                            <div className={styles.visualMini}>
                                <div className={styles.visualLabel}>Imagen 2</div>
                                <div className={styles.visualHint}>Impresión / fabricación</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.blocks}>
                <article className={styles.block}>
                    <h2 className={styles.blockTitle}>Compra por variantes</h2>
                    <p className={styles.blockText}>
                        Los productos se presentan como variantes comprables (talla, material, color, etc.). Así el usuario ve
                        directamente lo que puede adquirir.
                    </p>
                </article>

                <article className={styles.block}>
                    <h2 className={styles.blockTitle}>Imprime tus archivos</h2>
                    <p className={styles.blockText}>
                        Sube un archivo, define parámetros y genera un PrintJob. Mantendremos el flujo separado y protegido
                        cuando sea necesario.
                    </p>
                </article>

                <article className={styles.block}>
                    <h2 className={styles.blockTitle}>Separación SPA / Admin</h2>
                    <p className={styles.blockText}>
                        El cliente usa la SPA. La administración vive en Blade (dashboard), sin mezclar experiencias ni permisos.
                    </p>
                </article>
            </section>
        </div>
    );
}
