const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/combat', (req, res) => {
    let { playerHp, monsterHp, action } = req.body;
    let log = "";
    
    const playerMaxHp = 100;
    const monsterMaxHp = 80;

    if (action === 'attack') {
        let playerDamage = Math.floor(Math.random() * 9) + 12;
        monsterHp = Math.max(0, monsterHp - playerDamage);
        log += `Vous frappez l'ombre et infligez ${playerDamage} dégâts. `;

        if (monsterHp > 0) {
            let monsterDamage = Math.floor(Math.random() * 8) + 8;
            playerHp = Math.max(0, playerHp - monsterDamage);
            log += `Le monstre riposte et vous inflige ${monsterDamage} dégâts !`;
        } else {
            log += `Victoire ! L'ombre s'évapore dans le néant.`;
        }
    } else if (action === 'potion') {
        let heal = 25;
        playerHp = Math.min(playerMaxHp, playerHp + heal);
        log += `Vous buvez une fiole de sang : +${heal} PV. `;

        let monsterDamage = Math.floor(Math.random() * 8) + 8;
        playerHp = Math.max(0, playerHp - monsterDamage);
        log += `Le monstre en profite pour vous frapper (-${monsterDamage} PV) !`;
    }

    res.json({ playerHp, monsterHp, log });
});

app.listen(PORT, () => {
    console.log(`Serveur RPG en ligne sur le port ${PORT}`);
});
