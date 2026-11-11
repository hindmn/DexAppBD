import express from 'express';
import cors from 'cors';
import coursRouter from './routes/cours.js';
import travauxRouter from './routes/travaux.js';
import connexRouter from './routes/connexion.js';

const app =  express();

app.use(cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/cours', coursRouter);
app.use('/api/travaux', travauxRouter);
app.use('/api', connexRouter);

app.use((req, res) => {
    res.status(404).json({ erreurs: ['Route introuvable.']});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({erreurs : ['Erreur inattendue.']});
});

export default app;