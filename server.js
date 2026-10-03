const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CHARACTERS = [
    { id: 1, name: "Naruto Uzumaki", class: "Uzumaki", hp: 100, maxHp: 100, attackPower: 18, ultimate: "Rasengan" },
    { id: 2, name: "Sasuke Uchiha", class: "Uchiha", hp: 95, maxHp: 95, attackPower: 20, ultimate: "Chidori" },
    { id: 3, name: "Kakashi Hatake", class: "Hatake", hp: 90, maxHp: 90, attackPower: 19, ultimate: "Raikiri" },
    { id: 4, name: "Itachi Uchiha", class: "Uchiha Rouge", hp: 105, maxHp: 105, attackPower: 22, ultimate: "Amaterasu" }
];

const MONSTERS = [
    { name: "Ombre des Abysses", hp: 70, maxHp: 70, attackPower: 12 },
    { name: "Bête Sanguinaire", hp: 90, maxHp: 90, attackPower: 15 },
    { name: "Chevalier Corrompu", hp: 110, maxHp: 110, attackPower: 18 }
];

app.get('/api/characters', (req, res) => {
    res.json(CHARACTERS);
});

app.get('/api/spawn-monster', (req, res) => {
    const randomMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    res.json({ monster: { ...randomMonster } });
});

app.post('/api/combat', (req, res) => {
    let { playerHp, playerMaxHp, monsterHp, monsterMaxHp, monsterAttack, action, attackPower } = req.body;
    let log = "";
    let isCritical = false;

    if (action === 'attack') {
        let baseDamage = attackPower + Math.floor(Math.random() * 6) - 3;
        if (Math.random() < 0.15) {
            baseDamage = Math.floor(baseDamage * 1.5);
            isCritical = true;
            log += `💥 **Coup critique !** `;
        }
        
        monsterHp = Math.max(0, monsterHp - baseDamage);
        log += `Vous frappez et infligez ${baseDamage} dégâts. `;

        if (monsterHp > 0) {
            let monsterDmg = monsterAttack + Math.floor(Math.random() * 4) - 2;
            playerHp = Math.max(0, playerHp - monsterDmg);
            log += `Le monstre riposte et vous inflige ${monsterDmg} dégâts !`;
        } else {
            log += `Victoire éclatante ! L'ennemi s'effondre dans le sang et la cendre.`;
        }
    } else if (action === 'potion') {
        let heal = 30;
        playerHp = Math.min(playerMaxHp, playerHp + heal);
        log += `Vous absorbez une fiole de sang : +${heal} PV. `;

        let monsterDmg = monsterAttack + Math.floor(Math.random() * 4) - 2;
        playerHp = Math.max(0, playerHp - monsterDmg);
        log += `Le monstre profite de votre faiblesse pour frapper (-${monsterDmg} PV) !`;
    }

    res.json({ playerHp, monsterHp, log, isCritical });
});

app.listen(PORT, () => {
    console.log(`Serveur CRIMSON RPG en ligne sur le port ${PORT}`);
});
