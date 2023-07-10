import type { Node } from 'typescript';

import { SyntaxKind } from 'typescript';
import {
  conditional,
  forLoop,
  simpleFunction,
  simpleProgram,
  statement
} from './fixtures';

import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery - :not:', () => {
    it('should find any nodes that are not a specific SyntaxKind', () => {
      const ast = tsquery.ast(conditional);
      const result = tsquery<Node>(ast, ':not(Identifier)');

      expect(result.length).toEqual(68);
      expect(
        result.every((node) => node.kind !== SyntaxKind.Identifier)
      ).toEqual(true);
    });

    it('should find any nodes that do not have a specific attribute', () => {
      const ast = tsquery.ast(forLoop);
      const result = tsquery(ast, ':not([name="x"])');

      expect(result.length).toEqual(38);
    });

    it('should handle an inverse wildcard query', () => {
      const ast = tsquery.ast(simpleFunction);
      const result = tsquery(ast, ':not(*)');

      expect(result.length).toEqual(0);
    });

    it('should find any notes that are not one of several SyntaxKind', () => {
      const ast = tsquery.ast(simpleProgram);
      const result = tsquery<Node>(ast, ':not(Identifier, IfStatement)');

      expect(result.length).toEqual(38);
      expect(
        result.every((node) => {
          const { kind } = node;
          return (
            kind !== SyntaxKind.Identifier && kind !== SyntaxKind.IfStatement
          );
        })
      ).toEqual(true);
    });

    it('should find any nodes that do not have an attribute', () => {
      const ast = tsquery.ast(statement);
      const result = tsquery(ast, ':not([text=1])');

      expect(result.length).toEqual(11);
    });
  });
});
