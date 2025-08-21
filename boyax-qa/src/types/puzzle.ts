export type PuzzleImage = {
  id: string;
  url: string;
  rows: number;
  cols: number;
};

export type PuzzlePiece = {
  id: string;
  imageId: string;
  correctRow: number;
  correctCol: number;
  currentRow: number;
  currentCol: number;
};
