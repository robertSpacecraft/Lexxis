import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { catalogApi } from '../api/catalog';
import { designApi } from '../api/designApi';
import { authStorage } from '../store/authStorage';
import Navbar from '../components/Navbar';
import styles from './ProductConfigurator.module.css';

export default function ProductConfigurator() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [optionsData, setOptionsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savedDesignId, setSavedDesignId] = useState(null);

    // Configurations
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Simulate an endpoint call since backend might not have it strictly defined yet
                // For MVP we handle gracefully if it throws 404 or returns empty.
                const data = await catalogApi.getConfiguratorOptions(productId);
                setOptionsData(data);
                
                // Try restore from session storage if we came back from login
                const restoreData = sessionStorage.getItem(`configurator_${productId}`);
                if (restoreData) {
                    const parsed = JSON.parse(restoreData);
                    if (parsed.materialId) setSelectedMaterial(parsed.materialId);
                    if (parsed.colorName) setSelectedColor(parsed.colorName);
                    if (parsed.sizeEu) setSelectedSize(parsed.sizeEu);
                    sessionStorage.removeItem(`configurator_${productId}`); // clean up
                }

            } catch (err) {
                console.error(err);
                setError(err.message || 'No se pudieron cargar las opciones de configuración.');
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, [productId]);

    // Handle material change: flush color since new material may have different colors
    const handleMaterialChange = (e) => {
        setSelectedMaterial(e.target.value);
        setSelectedColor('');
    };

    const handleSaveDesign = async () => {
        const payload = {
            product_id: parseInt(productId, 10),
            material_id: parseInt(selectedMaterial, 10),
            color_name: selectedColor,
            size_eu: selectedSize
        };

        if (!authStorage.getToken()) {
            // Save state and redirect to login
            sessionStorage.setItem(`configurator_${productId}`, JSON.stringify({
                materialId: payload.material_id,
                colorName: payload.color_name,
                sizeEu: payload.size_eu
            }));
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        setSaving(true);
        try {
            const result = await designApi.createDesign(payload);
            setSavedDesignId(result.id || true);
        } catch (err) {
            console.error(err);
            alert("Error al guardar diseño: " + (err.message || 'Error desconocido'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p>Cargando configurador...</p>
            </div>
        </>
    );

    if (error || !optionsData) return (
        <>
            <Navbar />
            <div className={`${styles.container} ${styles.centerLayout}`}>
                <p className={styles.errorText}>{error || 'Producto no configurable'}</p>
                <Link to={`/catalog/products/${productId}`} className={styles.backLink}>Volver al detalle</Link>
            </div>
        </>
    );

    const { product, materials = [], colors_by_material = {}, sizes = [], preview_variants = [] } = optionsData;

    // Derived values for UI
    const availableColors = selectedMaterial ? (colors_by_material[selectedMaterial] || []) : [];
    const isComplete = selectedMaterial && selectedColor && selectedSize;

    // Determine what image to show
    let previewImage = null;
    if (preview_variants?.length > 0 && selectedMaterial && selectedColor) {
        const exactPreview = preview_variants.find(
            pv => String(pv.material_id) === String(selectedMaterial) && pv.color_name === selectedColor
        );
        if (exactPreview?.image_url) {
            previewImage = exactPreview.image_url;
        }
    }
    // Fallback
    if (!previewImage && product?.main_image) {
        previewImage = product.main_image;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Link to={`/catalog/products/${productId}`} className={styles.backLink}>
                    <span>&larr;</span> Volver al producto
                </Link>

                <h1 className={styles.title}>Diseña tu variante: {product?.name || `Producto #${productId}`}</h1>

                <div className={styles.layout}>
                    <div className={styles.previewSection}>
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className={styles.previewImage} />
                        ) : (
                            <div className={styles.placeholderImage}>
                                <span>No hay previsualización disponible</span>
                                <span style={{ fontSize: 'var(--font-size-body-sm)' }}>Combina los materiales para previsualizar tu diseño</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.configSection}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>1. Material</label>
                            <select 
                                className={styles.selectInput}
                                value={selectedMaterial} 
                                onChange={handleMaterialChange}
                            >
                                <option value="">-- Selecciona un material --</option>
                                {materials.map(mat => (
                                    <option key={mat.id} value={mat.id}>{mat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>2. Color</label>
                            <select 
                                className={styles.selectInput}
                                value={selectedColor} 
                                onChange={(e) => setSelectedColor(e.target.value)}
                                disabled={!selectedMaterial || availableColors.length === 0}
                            >
                                <option value="">-- Selecciona un color --</option>
                                {availableColors.map((color, idx) => {
                                    const colorName = typeof color === 'string' ? color : color.name;
                                    return (
                                        <option key={idx} value={colorName}>
                                            {colorName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>3. Talla (EU)</label>
                            <select 
                                className={styles.selectInput}
                                value={selectedSize} 
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                <option value="">-- Selecciona una talla --</option>
                                {sizes.map((size, idx) => {
                                    const sizeVal = typeof size === 'object' ? (size.name || size.value || size.id) : size;
                                    return (
                                        <option key={idx} value={sizeVal}>
                                            {sizeVal}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className={styles.actions}>
                            {!savedDesignId ? (
                                <button 
                                    className={styles.btnPrimary}
                                    disabled={!isComplete || saving}
                                    onClick={handleSaveDesign}
                                >
                                    {saving ? "Guardando..." : "Guardar diseño"}
                                </button>
                            ) : (
                                <div className={styles.successActions}>
                                    <p className={styles.successText}>¡Diseño guardado correctamente!</p>
                                    <button 
                                        className={styles.btnSecondary}
                                        onClick={() => alert("Próximamente: Integración con carrito terminada")}
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
