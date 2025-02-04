import { Player, isSamePlayer } from './types/player';
import { Point, PointsData, Score, FortyData, deuce, advantage, game, forty, points } from './types/score';
import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

export const playerToString = (player: Player) =>
  player === 'PLAYER_ONE' ? 'Player 1' : 'Player 2';

export const otherPlayer = (player: Player): Player =>
  player === 'PLAYER_ONE' ? 'PLAYER_TWO' : 'PLAYER_ONE';

export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE': return 'Love';
    case 'FIFTEEN': return 'Fifteen';
    case 'THIRTY': return 'Thirty';
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'DEUCE': return "Deuce";
    case 'POINTS': return `Player 1: ${pointToString(score.pointsData.PLAYER_ONE)}, Player 2: ${pointToString(score.pointsData.PLAYER_TWO)}`;
    case 'FORTY': return `Forty: ${playerToString(score.fortyData.player)}, Other: ${pointToString(score.fortyData.otherPoint)}`;
    case 'ADVANTAGE': return `Advantage: ${playerToString(score.player)}`;
    case 'GAME': return `Game won by: ${playerToString(score.player)}`;
  }
};

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (advantagedPlayer: Player, winner: Player): Score =>
  isSamePlayer(advantagedPlayer, winner) ? game(winner) : deuce();

export const incrementPoint = (point: Point): Option<Point> => {
  switch (point.kind) {
    case 'LOVE': return some({ kind: 'FIFTEEN' });
    case 'FIFTEEN': return some({ kind: 'THIRTY' });
    case 'THIRTY': return none;
  }
};

export const scoreWhenForty = (currentForty: FortyData, winner: Player): Score => {
  return isSamePlayer(currentForty.player, winner)
    ? game(winner)
    : pipe(
        incrementPoint(currentForty.otherPoint),
        matchOpt(
          () => deuce(),
          (p) => forty(currentForty.player, p) as Score
        )
      );
};

export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  return pipe(
    incrementPoint(current[winner]),
    matchOpt(
      () => forty(winner, current[otherPlayer(winner)]),
      (p) => points(p, current[otherPlayer(winner)]) as Score

    )
  );
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS': return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY': return scoreWhenForty(currentScore.fortyData, winner);
    case 'ADVANTAGE': return scoreWhenAdvantage(currentScore.player, winner);
    case 'DEUCE': return scoreWhenDeuce(winner);
    case 'GAME': return currentScore;
  }
};
