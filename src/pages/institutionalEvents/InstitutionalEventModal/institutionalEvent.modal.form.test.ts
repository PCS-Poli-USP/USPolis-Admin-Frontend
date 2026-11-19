import { describe, expect, it } from 'vitest';
import { schema } from './institutionalEvent.modal.form';

const validEvent = {
  title: 'Evento',
  description: 'Descrição',
  category: 'talk',
  start: '2026-11-12T10:00',
  end: '',
  location: 'Auditório',
};

describe('institutional event form schema', () => {
  it.each([undefined, null, ''])(
    'accepts an absent external link (%s)',
    async (external_link) => {
      await expect(
        schema.validate({ ...validEvent, external_link }),
      ).resolves.toBeDefined();
    },
  );

  it('rejects an invalid external link', async () => {
    await expect(
      schema.validate({ ...validEvent, external_link: 'not-a-url' }),
    ).rejects.toThrow('Link inválido');
  });
});
