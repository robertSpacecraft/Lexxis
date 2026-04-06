import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { printFilesApi } from '../../api/printFiles';
import { printOptionsApi } from '../../api/printOptionsApi';
import { printJobsApi } from '../../api/printJobs';
import styles from './PrintFileConfigure.module.css';

// Helper: formatea un valor null/undefined con fallback visible
function displayValue(value, suffix = '') {
    if (value === null || value === undefined || value === '') {
        return <span className={styles.infoValueNull}>No disponible</span>;
    }
    return <span className={styles.infoValue}>{value}{suffix}</span>;
}

// Helper: extrae opciones de infill del endpoint (soporta array de números o de objetos {value, label})
function resolveInfillOptions(rawOptions) {
    if (!rawOptions || !Array.isArray(rawOptions)) return [];
    return rawOptions.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
            return { value: opt.value ?? opt.id, label: opt.label ?? String(opt.value ?? opt.id) };
        }
        return { value: opt, label: `${opt}%` };
    });
}

// Helper: extrae opciones de materiales (array de objetos con id/name)
function resolveMaterials(rawMaterials) {
    if (!rawMaterials || !Array.isArray(rawMaterials)) return [];
    return rawMaterials.map((m) => ({
        id: m.id,
        name: m.name ?? String(m.id),
    }));
}

// Helper: extrae opciones de tecnologías
function resolveTechnologies(rawTechs) {
    if (!rawTechs || !Array.isArray(rawTechs)) return [];
    return rawTechs.map((t) => {
        if (typeof t === 'string') return { value: t, label: t.toUpperCase() };
        return { value: t.value ?? t.id ?? t.name, label: t.label ?? t.name ?? String(t.value ?? t.id) };
    });
}

// Helper: extrae rangos numéricos del endpoint (quantity, scale_percent).
// FIX 5: Solo usa valores que el endpoint haya enviado explícitamente.
// Si faltan, devuelve null para que la UI pueda indicarlo en lugar de asumir un valor.
function resolveRange(rawField) {
    if (!rawField || typeof rawField !== 'object') return { min: null, max: null, default: null };
    return {
        min: rawField.min ?? null,
        max: rawField.max ?? null,
        default: rawField.default ?? rawField.min ?? null,
    };
}

export default function PrintFileConfigure() {
    const { printFileId } = useParams();
    const navigate = useNavigate();

    // Datos del archivo
    const [fileInfo, setFileInfo] = useState(null);

    // Opciones del formulario (cargadas de la API)
    const [materials, setMaterials] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [infillOptions, setInfillOptions] = useState([]);
    const [quantityRange, setQuantityRange] = useState({ min: null, max: null, default: null });
    const [scaleRange, setScaleRange] = useState({ min: null, max: null, default: null });

    // FIX 3: Estados de carga separados para archivo y opciones
    const [loadingFile, setLoadingFile] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [fileError, setFileError] = useState(null);
    const [optionsError, setOptionsError] = useState(null);

    // Formulario — todos los campos obligatorios empiezan vacíos o en string para no asumir defaults arbitrarios
    const [form, setForm] = useState({
        material_id: '',
        technology: '',
        color_name: '',
        quantity: '',
        infill_percent: '',
        scale_percent: '',
    });

    // Resultado del job creado (solo existe tras hacer submit)
    const [createdJob, setCreatedJob] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // ---- Carga del archivo ---- (FIX 3: usa fileError)
    useEffect(() => {
        if (!printFileId) return;

        printFilesApi.getPrintFile(printFileId)
            .then((data) => {
                setFileInfo(data);
            })
            .catch((err) => {
                console.error('[PrintFileConfigure] Error al cargar archivo:', err);
                setFileError(err.message || 'No se ha podido cargar la información del archivo.');
            })
            .finally(() => {
                setLoadingFile(false);
            });
    }, [printFileId]);

    // ---- Carga de opciones ---- (FIX 2 + FIX 3: preselección segura, error separado)
    useEffect(() => {
        printOptionsApi.getPrintOptions()
            .then((data) => {
                const mats = resolveMaterials(data?.materials);
                const techs = resolveTechnologies(data?.technologies);
                const infills = resolveInfillOptions(data?.infill_percent_options);
                const qty = resolveRange(data?.quantity);
                const scale = resolveRange(data?.scale_percent);

                setMaterials(mats);
                setTechnologies(techs);
                setInfillOptions(infills);
                setQuantityRange(qty);
                setScaleRange(scale);

                // FIX 2: Solo preseleccionar si realmente existen opciones válidas
                setForm((prev) => ({
                    ...prev,
                    material_id: mats.length > 0 ? String(mats[0].id) : '',
                    technology: techs.length > 0 ? techs[0].value : '',
                    infill_percent: infills.length > 0 ? String(infills[0].value) : '',
                    // Para rangos: usar el default del API solo si vino definido
                    quantity: qty.default !== null ? String(qty.default) : '',
                    scale_percent: scale.default !== null ? String(scale.default) : '',
                }));
            })
            .catch((err) => {
                console.error('[PrintFileConfigure] Error al cargar opciones:', err);
                // FIX 3: error separado, no mezclar con fileError
                setOptionsError(err.message || 'No se han podido cargar las opciones de impresión. Por favor, inténtalo de nuevo.');
            })
            .finally(() => {
                setLoadingOptions(false);
            });
    }, []);

    // ---- Manejador del formulario ----
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ---- Submit ---- (FIX 1: validación explícita antes del POST, sin Number("") => 0)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // Validar campos obligatorios antes de convertir
        const materialIdRaw = form.material_id;
        const technologyRaw = form.technology;
        const quantityRaw = form.quantity;
        const infillRaw = form.infill_percent;
        const scaleRaw = form.scale_percent;

        if (!materialIdRaw || materialIdRaw === '') {
            setSubmitError('Debes seleccionar un material.');
            return;
        }
        if (!technologyRaw || technologyRaw === '') {
            setSubmitError('Debes seleccionar una tecnología.');
            return;
        }
        if (infillRaw === '' || infillRaw === null || infillRaw === undefined) {
            setSubmitError('Debes seleccionar una opción de relleno (infill).');
            return;
        }
        if (quantityRaw === '' || quantityRaw === null || quantityRaw === undefined) {
            setSubmitError('Debes indicar una cantidad.');
            return;
        }
        if (scaleRaw === '' || scaleRaw === null || scaleRaw === undefined) {
            setSubmitError('Debes indicar una escala.');
            return;
        }

        const materialId = Number(materialIdRaw);
        const quantity = Number(quantityRaw);
        const infillPercent = Number(infillRaw);
        const scalePercent = Number(scaleRaw);

        // Comprobar que la conversión numérica es válida (evita NaN)
        if (!Number.isFinite(materialId) || materialId <= 0) {
            setSubmitError('El material seleccionado no es válido.');
            return;
        }
        if (!Number.isFinite(quantity) || quantity <= 0) {
            setSubmitError('La cantidad debe ser un número positivo.');
            return;
        }
        if (!Number.isFinite(infillPercent)) {
            setSubmitError('El valor de infill no es válido.');
            return;
        }
        if (!Number.isFinite(scalePercent) || scalePercent <= 0) {
            setSubmitError('La escala debe ser un número positivo.');
            return;
        }

        const payload = {
            material_id: materialId,
            technology: technologyRaw,
            color_name: form.color_name.trim() !== '' ? form.color_name.trim() : null,
            quantity,
            infill_percent: infillPercent,
            scale_percent: scalePercent,
        };

        setSubmitting(true);
        setCreatedJob(null);

        try {
            const job = await printJobsApi.createPrintJob(printFileId, payload);
            setCreatedJob(job);
        } catch (err) {
            console.error('[PrintFileConfigure] Error al crear el job:', err);
            const detail = err.errors
                ? Object.values(err.errors).flat().join(' ')
                : err.message || 'No se ha podido crear la configuración de impresión.';
            setSubmitError(detail);
        } finally {
            setSubmitting(false);
        }
    };

    // ---- Continuar sin revisión ----
    const handleContinueWithoutReview = async () => {
        if (!createdJob) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const updated = await printJobsApi.continueWithoutReview(printFileId, createdJob.id);
            setCreatedJob(updated);
        } catch (err) {
            console.error('[PrintFileConfigure] Error al continuar sin revisión:', err);
            setSubmitError(err.message || 'No se ha podido procesar la solicitud.');
        } finally {
            setSubmitting(false);
        }
    };

    // ---- Render ----

    const isLoading = loadingFile || loadingOptions;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <p className={styles.loadingText}>Cargando configurador...</p>
            </div>
        );
    }

    // FIX 3: Si el archivo no cargó, mostrar solo el error de archivo (no mezclar con optionsError)
    if (fileError && !fileInfo) {
        return (
            <div className={styles.container}>
                <Link to={`/account/printfiles/${printFileId}`} className={styles.backLink}>
                    &larr; Volver al archivo
                </Link>
                <div className={styles.errorBox}>{fileError}</div>
            </div>
        );
    }

    // FIX 4: Fallback para variaciones menores de clave del análisis
    const analysis = fileInfo?.analysis ?? fileInfo?.print_file_analysis ?? null;
    const dimensions = analysis?.dimensions_mm;
    const dimensionsText = dimensions
        ? `${dimensions.x} × ${dimensions.y} × ${dimensions.z} mm`
        : null;

    return (
        <div className={styles.container}>
            <Link to={`/account/printfiles/${printFileId}`} className={styles.backLink}>
                &larr; Volver al archivo
            </Link>

            <h1 className={styles.title}>Nueva Configuración de Impresión</h1>
            <p className={styles.subtitle}>
                Archivo base: <strong>{fileInfo?.original_name ?? `Archivo #${printFileId}`}</strong>
            </p>

            {/* FIX 3: Mostrar error de archivo y error de opciones de forma separada */}
            {fileError && (
                <div className={styles.errorBox}>{fileError}</div>
            )}

            <div className={styles.layout}>
                {/* ======================================================
                    BLOQUE A — Información del archivo (solo lectura)
                    ====================================================== */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Información del modelo</h2>

                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Nombre</span>
                            {displayValue(fileInfo?.original_name)}
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Extensión</span>
                            {displayValue(fileInfo?.file_extension)}
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Tamaño</span>
                            {fileInfo?.file_size
                                ? <span className={styles.infoValue}>{(fileInfo.file_size / 1024).toFixed(2)} KB</span>
                                : <span className={styles.infoValueNull}>No disponible</span>
                            }
                        </li>
                    </ul>

                    <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--spacing-lg)' }}>
                        Análisis del modelo
                    </h2>

                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Dimensiones</span>
                            {displayValue(dimensionsText)}
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Volumen estimado</span>
                            {analysis?.estimated_volume_cm3 != null
                                ? <span className={styles.infoValue}>{Number(analysis.estimated_volume_cm3).toFixed(2)} cm³</span>
                                : <span className={styles.infoValueNull}>No se ha podido obtener del archivo</span>
                            }
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Material estimado</span>
                            {analysis?.estimated_material_g != null
                                ? <span className={styles.infoValue}>{Number(analysis.estimated_material_g).toFixed(2)} g</span>
                                : <span className={styles.infoValueNull}>No se ha podido obtener del archivo</span>
                            }
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Tiempo estimado</span>
                            {analysis?.estimated_time_min != null
                                ? <span className={styles.infoValue}>{analysis.estimated_time_min} min</span>
                                : <span className={styles.infoValueNull}>No se ha podido obtener del archivo</span>
                            }
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Triángulos</span>
                            {displayValue(analysis?.triangle_count)}
                        </li>
                        <li className={styles.infoItem}>
                            <span className={styles.infoLabel}>Fuente de análisis</span>
                            {displayValue(analysis?.analysis_source)}
                        </li>
                    </ul>

                    {analysis?.manual_review_required === true && (
                        <div>
                            <div className={styles.reviewBadge}>
                                ⚠️ Este archivo requiere revisión técnica
                            </div>
                            {Array.isArray(analysis.review_reasons) && analysis.review_reasons.length > 0 && (
                                <ul className={styles.reviewReasons}>
                                    {analysis.review_reasons.map((reason, i) => (
                                        <li key={i}>{reason}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* ======================================================
                    BLOQUE B — Formulario del futuro PrintJob
                    ====================================================== */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Parámetros de impresión</h2>

                    {/* FIX 3: Error de opciones mostrado solo en el bloque del formulario */}
                    {optionsError && (
                        <div className={styles.errorBox}>{optionsError}</div>
                    )}

                    {/* Si ya se creó el job, mostrar resultado en vez del formulario */}
                    {createdJob ? (
                        <JobResult
                            job={createdJob}
                            styles={styles}
                            submitting={submitting}
                            submitError={submitError}
                            onContinueWithoutReview={handleContinueWithoutReview}
                            onBack={() => navigate(`/account/printfiles/${printFileId}`)}
                        />
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>

                            {/* Tecnología */}
                            <div className={styles.formGroup}>
                                <label htmlFor="technology" className={styles.label}>Tecnología</label>
                                <select
                                    id="technology"
                                    name="technology"
                                    className={styles.selectInput}
                                    value={form.technology}
                                    onChange={handleChange}
                                    required
                                >
                                    {technologies.length === 0 && (
                                        <option value="">Sin opciones disponibles</option>
                                    )}
                                    {technologies.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Material */}
                            <div className={styles.formGroup}>
                                <label htmlFor="material_id" className={styles.label}>Material</label>
                                <select
                                    id="material_id"
                                    name="material_id"
                                    className={styles.selectInput}
                                    value={form.material_id}
                                    onChange={handleChange}
                                    required
                                >
                                    {materials.length === 0 && (
                                        <option value="">Sin materiales disponibles</option>
                                    )}
                                    {materials.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Color (texto opcional) */}
                            <div className={styles.formGroup}>
                                <label htmlFor="color_name" className={styles.label}>
                                    Color
                                    <span className={styles.labelOptional}>(opcional)</span>
                                </label>
                                <input
                                    id="color_name"
                                    type="text"
                                    name="color_name"
                                    className={styles.textInput}
                                    value={form.color_name}
                                    onChange={handleChange}
                                    maxLength={80}
                                    placeholder="Ej: Blanco, Negro, Rojo..."
                                />
                                <p className={styles.fieldHint}>Máx. 80 caracteres.</p>
                            </div>

                            {/* Infill */}
                            <div className={styles.formGroup}>
                                <label htmlFor="infill_percent" className={styles.label}>Relleno (Infill)</label>
                                {infillOptions.length > 0 ? (
                                    <select
                                        id="infill_percent"
                                        name="infill_percent"
                                        className={styles.selectInput}
                                        value={form.infill_percent}
                                        onChange={handleChange}
                                        required
                                    >
                                        {infillOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className={styles.fieldHint}>No hay opciones de infill disponibles.</p>
                                )}
                            </div>

                            {/* Escala */}
                            <div className={styles.formGroup}>
                                <label htmlFor="scale_percent" className={styles.label}>Escala (%)</label>
                                <input
                                    id="scale_percent"
                                    type="number"
                                    name="scale_percent"
                                    className={styles.numberInput}
                                    value={form.scale_percent}
                                    onChange={handleChange}
                                    min={scaleRange.min}
                                    max={scaleRange.max}
                                    required
                                />
                                {/* FIX 5: Solo mostrar rango si el API lo definió */}
                                {(scaleRange.min !== null || scaleRange.max !== null) && (
                                    <p className={styles.fieldHint}>
                                        Entre {scaleRange.min ?? '—'}% y {scaleRange.max ?? '—'}%.
                                    </p>
                                )}
                            </div>

                            {/* Cantidad */}
                            <div className={styles.formGroup}>
                                <label htmlFor="quantity" className={styles.label}>Cantidad</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    name="quantity"
                                    className={styles.numberInput}
                                    value={form.quantity}
                                    onChange={handleChange}
                                    min={quantityRange.min}
                                    max={quantityRange.max}
                                    required
                                />
                                {/* FIX 5: Solo mostrar rango si el API lo definió */}
                                {(quantityRange.min !== null || quantityRange.max !== null) && (
                                    <p className={styles.fieldHint}>
                                        Entre {quantityRange.min ?? '—'} y {quantityRange.max ?? '—'} unidades.
                                    </p>
                                )}
                            </div>

                            {submitError && (
                                <div className={styles.errorBox}>{submitError}</div>
                            )}

                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={submitting || materials.length === 0 || technologies.length === 0 || infillOptions.length === 0}
                            >
                                {submitting ? 'Creando configuración...' : 'Crear configuración de impresión'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// Subcomponente: resultado tras crear el PrintJob
// ============================================================
function JobResult({ job, styles, submitting, submitError, onContinueWithoutReview, onBack }) {
    const isPriced = job.status === 'priced';
    const isReview = job.status === 'review_pending';

    return (
        <div>
            {isPriced && (
                <div className={`${styles.resultBox} ${styles.resultBoxPriced}`}>
                    <div className={`${styles.resultTitle} ${styles.resultTitlePriced}`}>
                        ✅ Presupuesto calculado
                    </div>
                    <p className={styles.resultText}>
                        La configuración de impresión ha sido creada correctamente.
                        El backend ha calculado el presupuesto para este trabajo.
                    </p>
                    {job.unit_price != null ? (
                        <p className={styles.resultText}>
                            <strong>Precio estimado:</strong>{' '}
                            {Number(job.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                    ) : (
                        <p className={styles.resultText}>
                            El backend no ha devuelto un precio calculado.
                        </p>
                    )}
                    <p className={styles.resultText}>
                        El flujo de compra estará disponible próximamente.
                    </p>
                </div>
            )}

            {isReview && (
                <div className={`${styles.resultBox} ${styles.resultBoxReview}`}>
                    <div className={`${styles.resultTitle} ${styles.resultTitleReview}`}>
                        ⚠️ Requiere revisión técnica
                    </div>
                    <p className={styles.resultText}>
                        El archivo requiere una revisión por parte de nuestro equipo técnico
                        antes de poder generar el presupuesto definitivo.
                    </p>
                    {job.unit_price != null ? (
                        <p className={styles.resultText}>
                            <strong>Precio estimado:</strong>{' '}
                            {Number(job.unit_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                    ) : (
                        <p className={styles.resultText}>
                            El backend no ha devuelto un precio calculado.
                        </p>
                    )}
                    <p className={styles.resultText}>
                        Puedes esperar a que el equipo valide el modelo o continuar
                        sin revisión asumiendo que el presupuesto es estimado.
                    </p>

                    {submitError && (
                        <div className={styles.errorBox}>{submitError}</div>
                    )}

                    <button
                        className={styles.btnSecondary}
                        onClick={onContinueWithoutReview}
                        disabled={submitting}
                    >
                        {submitting ? 'Procesando...' : 'Continuar sin revisión'}
                    </button>
                </div>
            )}

            {!isPriced && !isReview && (
                <div className={`${styles.resultBox} ${styles.resultBoxReview}`}>
                    <div className={`${styles.resultTitle} ${styles.resultTitleReview}`}>
                        Estado: {job.status}
                    </div>
                    <p className={styles.resultText}>
                        La configuración ha sido creada. Estado actual: <strong>{job.status}</strong>.
                    </p>
                </div>
            )}

            <button className={styles.btnSecondary} onClick={onBack}>
                Volver al detalle del archivo
            </button>
        </div>
    );
}
