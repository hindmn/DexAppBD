import express from 'express';
import cors from 'cors';

const app =  express();

app.use(cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res) => {
    res.status(404).json({ erreurs: ['Route introuvable.']});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({erreurs : ['Erreur inattendue.']});
});

export default app;