/**
 * SEED — Initialisation de la base de données ScolarPro
 *
 * Crée uniquement le compte administrateur par défaut et une école vide.
 * Toutes les données métier (classes, élèves, personnel, cours) sont
 * saisies directement dans l'application par l'établissement scolaire.
 *
 * Usage : npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ScolarPro — Initialisation de la base de données');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Vérifie si une école existe déjà pour éviter les doublons
  const existingSchool = await prisma.school.count();
  if (existingSchool > 0) {
    console.log('⚠️  La base contient déjà des données.');
    console.log('   Pour réinitialiser complètement : npm run db:reset');
    console.log('');
    return;
  }

  // ── École par défaut ───────────────────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const school = await prisma.school.create({
    data: {
      name: 'Mon Établissement',
      address: 'Adresse à renseigner',
      phone: '+XX XX XX XX XX',
      email: 'contact@mon-etablissement.com',
      plan: 'starter',
      maxUsers: 10,
      academicYear: `${currentYear}-${currentYear + 1}`,
    },
  });
  console.log(`✅ École créée : "${school.name}"`);
  console.log('   → Mettez à jour les informations dans Paramètres après connexion.');

  // ── Administrateur par défaut ──────────────────────────────────────────────
  const defaultPassword = 'Admin1234!';
  const hashed = await bcrypt.hash(defaultPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@scolarproci',
      password: hashed,
      firstName: 'Administrateur',
      lastName: 'Principal',
      role: 'admin',
      schoolId: school.id,
    },
  });

  // ── Résumé ─────────────────────────────────────────────────────────────────
  console.log(`✅ Compte admin créé`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Initialisation terminée !');
  console.log('');
  console.log('  Identifiants de première connexion :');
  console.log(`    Email    : ${admin.email}`);
  console.log(`    Password : ${defaultPassword}`);
  console.log('');
  console.log('  ⚠️  Changez le mot de passe dès la première connexion.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
