import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
  The source constraint in code. 04-konzept.md section 6.6.
  A record card without period, source, or the honest "what did not work" field
  does not render. It breaks the build.
  Every field below is required and must not be an empty string.
*/
const nonEmpty = (label: string) =>
  z.string().trim().min(1, `Record card field "${label}" must not be empty`);

const records = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/records' }),
  schema: z.object({
    // Order of the six fields on the card, concept 4.4.
    baseline: nonEmpty('baseline'),
    period: nonEmpty('period'),
    whatWeDid: nonEmpty('whatWeDid'),
    whatHappened: nonEmpty('whatHappened'),
    whatDidNotWork: nonEmpty('whatDidNotWork'),
    source: nonEmpty('source'),
    readAt: nonEmpty('readAt'),
    // Draft cards are excluded from the published page but still schema checked.
    draft: z.boolean().default(false),
    // Marks a structural placeholder so the page says so on its face.
    placeholder: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { records };
