import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, scoreWhenDeuce } from '../index';
import { advantage } from '../types/score';
import * as fc from 'fast-check';
import * as G from './generators';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    fc.assert(
      fc.property(G.getPlayer(), winner => {
        const score = scoreWhenDeuce(winner);
        expect(score).toStrictEqual(advantage(winner));
      })
    );
  });
});
