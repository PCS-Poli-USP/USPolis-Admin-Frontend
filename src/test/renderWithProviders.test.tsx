import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../components/common';
import { renderWithProviders } from './renderWithProviders';

describe('renderWithProviders', () => {
  it('gives the form-control kit a react-hook-form context', () => {
    renderWithProviders(<Input name='name' label='Nome' />, {
      formDefaultValues: { name: 'Sala 1' },
    });

    expect(screen.getByRole('textbox')).toHaveValue('Sala 1');
  });
});
