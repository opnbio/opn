import { getSecret } from 'astro:env/server'; // eslint-disable-line

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(getSecret('DATABASE_URL')!);

export const db = drizzle({ client: sql });
