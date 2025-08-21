// src/lib/sliceImage.ts
export function sliceImage(imageUrl: string, rows: number, cols: number): Promise<string[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const pieceWidth = img.width / cols;
        const pieceHeight = img.height / rows;
        const pieces: string[] = [];
  
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const canvas = document.createElement("canvas");
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(
              img,
              c * pieceWidth,
              r * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            );
            pieces.push(canvas.toDataURL());
          }
        }
  
        resolve(pieces);
      };
    });
  }
  