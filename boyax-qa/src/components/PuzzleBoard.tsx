"use client";

import { useEffect, useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Props = {
  pieces: string[]; // sliced image data URLs
  rows: number;
  cols: number;
  username: string;
};

type Piece = {
  id: number;
  img: string;
  correctIndex: number;
};

const DraggablePiece = ({
  piece,
  index,
  swapPieces,
}: {
  piece: Piece;
  index: number;
  swapPieces: (from: number, to: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: "PIECE",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { index: number }) => {
      swapPieces(item.index, index);
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="w-full h-full">
      <img
        src={piece.img}
        className="w-full h-full object-cover border border-gray-300"
        draggable={false}
      />
    </div>
  );
};

export default function PuzzleBoard({ pieces, rows, cols, username }: Props) {
  const [puzzlePieces, setPuzzlePieces] = useState<Piece[]>([]);
  const [completed, setCompleted] = useState(false);

  // Initialize and shuffle pieces
  useEffect(() => {
    const initialPieces: Piece[] = pieces.map((img, idx) => ({
      id: idx,
      img,
      correctIndex: idx,
    }));

    setPuzzlePieces(initialPieces.sort(() => Math.random() - 0.5));
  }, [pieces]);

  const swapPieces = (from: number, to: number) => {
    setPuzzlePieces((prev) => {
      const copy = [...prev];
      [copy[from], copy[to]] = [copy[to], copy[from]];
      return copy;
    });
  };

  // Check if puzzle is completed
  useEffect(() => {
    if (puzzlePieces.length && !completed) {
      const isCompleted = puzzlePieces.every(
        (p, idx) => idx === p.correctIndex
      );

      if (isCompleted) {
        setCompleted(true);
        const now = Date.now();
        fetch("/api/puzzle/complete", {
          method: "POST",
          body: JSON.stringify({ username, completed_at: now }),
        });
      }
    }
  }, [puzzlePieces, completed, username]);

  return (
    <div className="flex flex-col items-center">
      {completed && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded-lg font-semibold">
          Puzzle Completed!
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div
          className="grid gap-1"
          style={{
            gridTemplateRows: `repeat(${rows}, 100px)`,
            gridTemplateColumns: `repeat(${cols}, 100px)`,
          }}
        >
          {puzzlePieces.map((p, idx) => (
            <DraggablePiece
              key={p.id}
              piece={p}
              index={idx}
              swapPieces={swapPieces}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}
