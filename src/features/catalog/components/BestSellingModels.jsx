import { Link } from 'react-router-dom';
import { catalogApi } from '../../../api/catalog';
import { useAsync } from '../../../hooks/useAsync';
import { getImageAlt, getImageUrl } from '../../../utils/imageMapper';
import { getBestSellingProducts } from '../services/productService';
import styles from './BestSellingModels.module.css';

const BEST_SELLING_LIMIT = 3;

export default function BestSellingModels() {
    const { data, loading, error } = useAsync(catalogApi.getProducts, {
        errorMessage: 'No se pudieron cargar los modelos más vendidos.',
    });

    const models = getBestSellingProducts(data, BEST_SELLING_LIMIT);

    return (
        <section className={styles.section} aria-labelledby="best-selling-models-title">
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>Selección destacada</p>
                    <h2 id="best-selling-models-title" className={styles.title}>
                        Modelos más vendidos
                    </h2>
                </div>
                <Link to="/catalog" className={styles.catalogLink}>
                    Ver catálogo
                </Link>
            </div>

            {loading && (
                <div className={styles.grid} role="status" aria-label="Cargando modelos más vendidos">
                    {Array.from({ length: BEST_SELLING_LIMIT }).map((_, index) => (
                        <div key={index} className={`${styles.card} ${styles.skeletonCard}`}>
                            <div className={styles.skeletonImage} />
                            <div className={styles.skeletonLineLarge} />
                            <div className={styles.skeletonLine} />
                            <div className={styles.skeletonLineShort} />
                        </div>
                    ))}
                </div>
            )}

            {error && !loading && (
                <div className={styles.feedback} role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && models.length === 0 && (
                <div className={styles.feedback}>
                    No hay modelos disponibles en este momento.
                </div>
            )}

            {!loading && !error && models.length > 0 && (
                <div className={styles.grid}>
                    {models.map((model, index) => (
                        <Link
                            key={model.id}
                            to={`/catalog/products/${model.id}`}
                            className={styles.card}
                            aria-label={`Ver detalles de ${model.name}`}
                        >
                            <div className={styles.imageWrapper}>
                                {model.image ? (
                                    <img
                                        src={getImageUrl(model.image)}
                                        alt={getImageAlt(model.image, `Modelo ${model.name}`)}
                                        className={styles.image}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.metaRow}>
                                    <span className={styles.rank}>Top {index + 1}</span>
                                    {model.priceLabel && (
                                        <span className={styles.price}>Desde {model.priceLabel}</span>
                                    )}
                                </div>

                                <h3 className={styles.modelName}>{model.name}</h3>
                                <p className={styles.description}>{model.description}</p>

                                <span className={styles.action}>
                                    Ver modelo
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
