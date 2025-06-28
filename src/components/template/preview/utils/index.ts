
export function renderTemplate(template: string, data: string): string {
    let rendered = template;
    try {
        const jsonData = JSON.parse(data);
        const regex = /{{\s*([\w.]+)\s*}}/g;
        rendered = template.replace(regex, (match, key) => {
            const keys = key.split('.');
            let value = jsonData;
            for (const k of keys) {
                value = value?.[k];
            }
            return value !== undefined ? String(value) : match;
        });
    } catch (e) {
        // Ignorar errores de parseo de JSON para la edición en vivo
    }
    return rendered;
}

export function flattenObject(obj: any, parentKey = '', res: {[key:string]: any} = {}) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const propName = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
}
