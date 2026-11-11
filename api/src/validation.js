export function readDate(texte){
    if(typeof texte !== 'string') return null;
    const m = texte.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return null;
    const annee = Number(m[1]);
    const mois = Number(m[2]);
    const jour = Number(m[3]);

    const date = new Date(Date.UTC(annee, mois - 1, jour));
    if(date.getUTCFullYear() !== annee || date.getUTCMonth() !==  mois - 1 || date.getUTCDate() !== jour){
        return null;
    }
    return `${m[1]}-${m[2]}-${m[3]}`;
}

export function readDateHour(texte){
    if(typeof texte !== 'string') return null;
    const m = texte.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if(!m) return null;
    const date = readDate(m[1]);
    if(!date) return null;

    const heures = Number(m[2]);
    const minutes = Number(m[3]);
    const secondes = Number(m[4] ?? 0);
    if(heures > 23 || minutes > 59 || secondes > 59) return null;
    return `${date} ${m[2]}:${m[3]}:${String(secondes).padStart(2, '0')}`;
}