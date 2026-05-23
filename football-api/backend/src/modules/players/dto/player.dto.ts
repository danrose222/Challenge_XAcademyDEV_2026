export class PlayerDto {
  id: number;
  longName: string;
  clubName: string;
  playerPositions: string;
  nationalityName: string;
  overall: number;
  pace: number;
  shooting: number;
  dribbling: number;
  passing: number;
  defending: number;
  physic: number;

  constructor(partial: Partial<PlayerDto>) {
    Object.assign(this, partial);
  }
}