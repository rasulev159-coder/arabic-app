// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    const { email, name, password } = req.body || {};

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing fields', body: req.body });
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash: hash, language: 'ru' },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET || 'test',
      { expiresIn: '15m' }
    );

    await prisma.$disconnect();

    return res.status(201).json({ ok: true, user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e: any) {
    return res.status(500).json({ error: e.message, stack: e.stack?.split('\n').slice(0, 5) });
  }
}
