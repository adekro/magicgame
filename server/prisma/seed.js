require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt'); // Per hashare le password se necessario anche nei seed

// Istanzia PrismaClient passando esplicitamente l'URL del database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('Inizio seeding...');

  // TODO: Hash password per utenti demo se si implementa bcrypt
  // const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Creare Scuole Demo
  const schoolFire = await prisma.school.upsert({
    where: { name: 'Scuola delle Fiamme Ruggenti' },
    update: {},
    create: {
      name: 'Scuola delle Fiamme Ruggenti',
      description: 'Domina l_arte del fuoco primordiale.',
      element: 'Fuoco',
    },
  });

  const schoolWater = await prisma.school.upsert({
    where: { name: 'Accademia delle Correnti Fluide' },
    update: {},
    create: {
      name: 'Accademia delle Correnti Fluide',
      description: 'Comprendi i misteri dell_acqua e della guarigione.',
      element: 'Acqua',
    },
  });
  console.log('Scuole create/aggiornate.');

  // 2. Creare Magie Demo
  const spellIgniculus = await prisma.spell.upsert({
    where: { name: 'Igniculus' },
    update: {},
    create: {
      name: 'Igniculus',
      description: 'Un piccolo dardo di fuoco crepitante.',
      manaCost: 10,
      damage: 15,
      schoolId: schoolFire.id,
    },
  });

  const spellAquaVitae = await prisma.spell.upsert({
    where: { name: 'Aqua Vitae' },
    update: {},
    create: {
      name: 'Aqua Vitae',
      description: 'Una debole onda curativa che ripristina poca vitalità (o mana, a seconda del gioco).',
      manaCost: 12,
      damage: -10, // Danno negativo per indicare cura
      schoolId: schoolWater.id,
    },
  });

  const spellGenericShield = await prisma.spell.upsert({
    where: { name: 'Scudo Runico Minore' },
    update: {},
    create: {
      name: 'Scudo Runico Minore',
      description: 'Evoca uno scudo di energia di base per una breve protezione.',
      manaCost: 8,
      damage: 0, // Non fa danno, è difensivo
    },
  });
  console.log('Magie create/aggiornate.');

  // 3. Creare Utenti Demo
  const userAlice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice la Piromante',
      password: 'password123', // Password in chiaro per MVP/seed
      level: 5,
      mana: 120,
      schoolId: schoolFire.id,
    },
  });

  const userBob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob l_Idromante',
      password: 'password456', // Password in chiaro per MVP/seed
      level: 3,
      mana: 90,
      schoolId: schoolWater.id,
    },
  });

  const userTest = await prisma.user.upsert({
    where: { email: 'test@test.com' }, // Utente per il login fittizio del client
    update: { mana: 100, level: 1}, // Assicura che il mana sia 100 per i test client
    create: {
      email: 'test@test.com',
      name: 'Tester MVP',
      password: 'password', // Password usata nel login fittizio client
      level: 1,
      mana: 100,
    }
  })
  console.log('Utenti creati/aggiornati.');

  // 4. Assegnare magie agli utenti (SpellBook)
  // Alice impara Igniculus
  await prisma.spellBook.upsert({
    where: { userId_spellId: { userId: userAlice.id, spellId: spellIgniculus.id } },
    update: {},
    create: {
      userId: userAlice.id,
      spellId: spellIgniculus.id,
    },
  });

  // Bob impara Aqua Vitae
  await prisma.spellBook.upsert({
    where: { userId_spellId: { userId: userBob.id, spellId: spellAquaVitae.id } },
    update: {},
    create: {
      userId: userBob.id,
      spellId: spellAquaVitae.id,
    },
  });

  // L'utente test@test.com impara Igniculus per coerenza con la SpellCastScreen
   await prisma.spellBook.upsert({
    where: { userId_spellId: { userId: userTest.id, spellId: spellIgniculus.id } },
    update: {},
    create: {
      userId: userTest.id,
      spellId: spellIgniculus.id,
    },
  });

  console.log('Magie assegnate agli utenti.');

  console.log('Seeding completato.');
}

main()
  .catch((e) => {
    console.error('Errore durante il seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
