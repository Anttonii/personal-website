import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import fs from 'fs';

const app: Application = express();
const port: number = 4000;

const corsOptions: CorsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
};

let players;

app.use(express.json());
app.use(cors(corsOptions));

app.get('/api/players', (req, res) => {
    const id = req.query.player_id;
    if (!id) {
        res.sendStatus(500).json("No player ID provided.");
        return;
    }

    const numberId = Number(id);
    if (Number.isNaN(numberId)) {
        res.status(500).json("Number ID invalid.");
        return;
    }

    const data = players.filter((player) => {
        return player.player_id == numberId;
    })

    if (data.length == 0) {
        res.status(404).json("Player not found.");
        return;
    }

    res.json(data);
});

app.listen(port, () => {
    try {
        const jsonStringData = fs.readFileSync("./players.json", "utf-8");
        players = JSON.parse(jsonStringData);
        console.log('Successfully loaded player information.')
    } catch (err) {
        console.log(err);
    }
    console.log(`Server is running on http://localhost:${port}`);
});
