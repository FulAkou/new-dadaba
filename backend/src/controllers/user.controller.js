import { randomUUID } from 'crypto';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { hashPassword } from '../lib/bcrypt.js';
import { db } from '../lib/db.js';
import { users } from '../lib/schema.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    const filters = [];
    if (role) filters.push(eq(users.role, role));
    if (search) {
      filters.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const [rows, totalRows] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          telephone: users.telephone,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .offset(parseInt(skip))
        .limit(parseInt(limit))
        .orderBy(desc(users.createdAt)),
      db.select({ count: sql`count(*)::int` }).from(users).where(whereClause),
    ]);

    const total = totalRows?.[0]?.count || 0;

    res.json({
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        telephone: users.telephone,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const found = user[0];

    if (!found) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(found);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, telephone, role } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
        telephone,
        role: role || 'USER',
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        telephone: users.telephone,
        role: users.role,
        createdAt: users.createdAt,
      });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, telephone, role } = req.body;

    // Check if user exists
    const existingUserResult = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const existingUser = existingUserResult[0];

    if (!existingUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Check email uniqueness if email is being updated
    if (email && email !== existingUser.email) {
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (emailExists.length > 0) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé' });
      }
    }

    await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
        ...(role && { role }),
      })
      .where(eq(users.id, id));

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        telephone: users.telephone,
        role: users.role,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    res.json(user[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, telephone } = req.body;
    const userId = req.user.id;

    // Check email uniqueness if email is being updated
    if (email) {
      const existingUserResult = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const existingUser = existingUserResult[0];

      if (email !== existingUser.email) {
        const emailExists = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (emailExists.length > 0) {
          return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
      }
    }

    await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
      })
      .where(eq(users.id, userId));

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        telephone: users.telephone,
        role: users.role,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    res.json(user[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.delete(users).where(eq(users.id, id));

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};



