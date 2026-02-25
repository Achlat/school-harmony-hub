import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Erreur]', err.message);

  // Violation de contrainte unique Prisma (P2002)
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'Cette ressource existe déjà' });
    return;
  }

  // Enregistrement non trouvé Prisma (P2025)
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Ressource non trouvée' });
    return;
  }

  // Violation de clé étrangère Prisma (P2003)
  if (err.code === 'P2003') {
    res.status(400).json({ error: 'Référence invalide (ressource liée introuvable)' });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'Erreur interne du serveur' : err.message;

  res.status(statusCode).json({ error: message });
}
