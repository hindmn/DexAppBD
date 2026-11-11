import pool from "./bd.js";

export async function findTravail(id) {
    const [lignes] = await pool.execute('SELECT tr.id, cs.utilisateur_id FROM travaux tr JOIN cours cs ' 
        + 'ON cs.id = tr.cours_id WHERE tr.id = ?', [id]);
    return lignes[0] ?? null;
}

export async function findCreneau(id) {
    const [lignes] = await pool.execute('SELECT cr.id, cr.travail_id, cs.utilisateur_id FROM creneaux cr ' + 
        'JOIN travaux tr ON tr.id = cr.travail_id JOIN cours cs ON cs.id = tr.cours_id WHERE cr.id = ?', [id]
    );
    return lignes[0] ?? null;
}