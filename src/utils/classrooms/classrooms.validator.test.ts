import { describe, it, expect } from 'vitest';
import { ClassroomValidator } from './classrooms.validator';

describe('ClassroomValidator', () => {
  describe('isInvalidName', () => {
    it('considera inválido um nome vazio', () => {
      expect(ClassroomValidator.isInvalidName('')).toBe(true);
    });

    it('considera válido um nome preenchido', () => {
      expect(ClassroomValidator.isInvalidName('Sala 101')).toBe(false);
    });
  });

  describe('isInvalidCapacity', () => {
    it('considera inválida uma capacidade negativa', () => {
      expect(ClassroomValidator.isInvalidCapacity(-1)).toBe(true);
    });

    it('considera válida uma capacidade zero ou positiva', () => {
      expect(ClassroomValidator.isInvalidCapacity(0)).toBe(false);
      expect(ClassroomValidator.isInvalidCapacity(40)).toBe(false);
    });
  });

  describe('isInvalidFloor', () => {
    it('considera inválido um andar negativo', () => {
      expect(ClassroomValidator.isInvalidFloor(-1)).toBe(true);
    });

    it('considera válido o térreo (0) ou andares positivos', () => {
      expect(ClassroomValidator.isInvalidFloor(0)).toBe(false);
      expect(ClassroomValidator.isInvalidFloor(3)).toBe(false);
    });
  });
});
