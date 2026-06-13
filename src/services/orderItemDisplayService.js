function getRelation(item, camelName, snakeName) {
    return item?.[camelName] ?? item?.[snakeName] ?? null;
}

function getProductVariant(item) {
    return getRelation(item, 'productVariant', 'product_variant');
}

function getProductDesign(item) {
    return getRelation(item, 'productDesign', 'product_design');
}

function getPrintJob(item) {
    return getRelation(item, 'printJob', 'print_job');
}

function getPrintFile(printJob) {
    return getRelation(printJob, 'printFile', 'print_file');
}

function getMaterialName(entity) {
    return entity?.material?.name ?? null;
}

function getProductName(entity) {
    return entity?.product?.name ?? null;
}

function compactParts(parts) {
    return parts.filter(Boolean).join(' · ');
}

export function getOrderDisplayNumber(order) {
    return order?.order_number ?? order?.id ?? '—';
}

export function resolveOrderItemType(item) {
    if (getProductVariant(item)) return 'product_variant';
    if (getProductDesign(item)) return 'product_design';
    if (getPrintJob(item)) return 'print_job';

    return item?.type ?? 'unknown';
}

export function getOrderItemTypeLabel(item) {
    const labels = {
        print_job: 'Impresión 3D',
        product_design: 'Diseño personalizado',
        product_variant: 'Producto de catálogo',
        unknown: 'Ítem',
    };

    return labels[resolveOrderItemType(item)] ?? labels.unknown;
}

export function getOrderItemIcon(item) {
    const type = resolveOrderItemType(item);

    if (type === 'print_job') return '🖨️';
    if (type === 'product_design') return '🎨';
    return '📦';
}

export function getOrderItemName(item) {
    const productVariant = getProductVariant(item);
    const productDesign = getProductDesign(item);
    const printJob = getPrintJob(item);
    const printFile = getPrintFile(printJob);

    if (item?.item_name) return item.item_name;

    if (productVariant) {
        return getProductName(productVariant)
            ?? productVariant.sku
            ?? `Variante #${productVariant.id ?? item?.product_variant_id ?? '—'}`;
    }

    if (productDesign) {
        const productName = getProductName(productDesign);

        return productName
            ? `Diseño: ${productName}`
            : `Diseño personalizado #${productDesign.id ?? item?.product_design_id ?? '—'}`;
    }

    if (printJob) {
        return printFile?.original_name
            ? `Impresión: ${printFile.original_name}`
            : `Trabajo de impresión #${printJob.id ?? item?.print_job_id ?? '—'}`;
    }

    return `Ítem #${item?.id ?? '—'}`;
}

export function getOrderItemMeta(item) {
    const productVariant = getProductVariant(item);
    const productDesign = getProductDesign(item);
    const printJob = getPrintJob(item);
    const metadata = item?.metadata ?? {};

    if (productVariant) {
        return compactParts([
            productVariant.color_name ?? metadata.color_name,
            productVariant.size_eu && `Talla ${productVariant.size_eu}`,
            getMaterialName(productVariant),
            productVariant.sku,
        ]);
    }

    if (productDesign) {
        return compactParts([
            productDesign.color_name ?? metadata.color_name,
            productDesign.size_eu && `Talla ${productDesign.size_eu}`,
            getMaterialName(productDesign),
        ]);
    }

    if (printJob) {
        return compactParts([
            getMaterialName(printJob),
            printJob.color_name ?? metadata.color_name,
            printJob.technology?.toUpperCase?.() ?? metadata.technology?.toUpperCase?.(),
        ]);
    }

    return '';
}

export function isProductVariantItem(item) {
    return resolveOrderItemType(item) === 'product_variant';
}

export function formatAddressSummary(address) {
    if (!address) return null;

    const street = address.street ?? null;
    const city = street?.city ?? null;
    const province = city?.province ?? null;
    const country = province?.country ?? null;

    const streetLine = compactParts([
        street?.street_type,
        street?.name,
        address.street_number,
        address.floor && `Piso ${address.floor}`,
        address.door && `Puerta ${address.door}`,
    ]);

    return compactParts([
        streetLine,
        city?.postal_code,
        city?.name,
        province?.name,
        country?.name,
    ]);
}
