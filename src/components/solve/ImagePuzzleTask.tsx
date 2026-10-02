import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RotateCcw, Check, Sparkles, Trophy, Image as ImageIcon } from 'lucide-react';
import { PropellerBannerAd } from '../ads/PropellerBannerAd';
import { sound } from '../../utils/sound';
import bengalTigerImg from '../../assets/images/puzzle_bengal_tiger_1790938719942.jpg';
import ancientTempleImg from '../../assets/images/puzzle_ancient_temple_1790938737422.jpg';

interface ImagePuzzleTaskProps {
  isBoostActive: boolean;
  onClaim: (coins: number) => void;
}

const PUZZLE_IMAGES = [
  {
    name: 'Bengal Tiger in Rainforest',
    src: bengalTigerImg,
  },
  {
    name: 'Ancient Temple & Cherry Blossoms',
    src: ancientTempleImg,
  },
];

export const ImagePuzzleTask: React.FC<ImagePuzzleTaskProps> = ({
  isBoostActive,
  onClaim,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [showReference, setShowReference] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const pointsToEarn = isBoostActive ? 12 : 10;
  const currentImage = PUZZLE_IMAGES[imageIndex];

  // Check if current tiles are in correct 0..8 order
  const checkSolved = (arr: number[]) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== i) return false;
    }
    return true;
  };

  // Shuffle tiles (making sure it doesn't accidentally start solved)
  const shuffleTiles = () => {
    sound.playClick();
    let shuffled: number[];
    do {
      shuffled = [...Array(9).keys()].sort(() => Math.random() - 0.5);
    } while (checkSolved(shuffled));

    setTiles(shuffled);
    setSelectedTileIndex(null);
    setMoveCount(0);
    setIsSolved(false);
  };

  useEffect(() => {
    shuffleTiles();
  }, [imageIndex]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    if (selectedTileIndex === null) {
      sound.playClick();
      setSelectedTileIndex(index);
    } else {
      if (selectedTileIndex === index) {
        // Deselect
        setSelectedTileIndex(null);
        return;
      }

      // Swap the two tiles
      const newTiles = [...tiles];
      const temp = newTiles[selectedTileIndex];
      newTiles[selectedTileIndex] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedTileIndex(null);
      setMoveCount((prev) => prev + 1);

      if (checkSolved(newTiles)) {
        sound.playSuccess();
        setIsSolved(true);
      } else {
        sound.playClick();
      }
    }
  };

  const handleClaim = () => {
    sound.playClick();
    onClaim(pointsToEarn);
    // Switch image or reshuffle
    setImageIndex((prev) => (prev + 1) % PUZZLE_IMAGES.length);
  };

  return (
    <div className="space-y-6">
      <PropellerBannerAd zoneId="8492024" size="slim" />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">TASK 3</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-xs font-semibold text-rose-700">Hard Image Jumble</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">3x3 Photo Jumble Challenge</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Reward:</span>
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>{pointsToEarn} Coins</span>
              {isBoostActive && <span className="text-[10px] text-amber-700">(+2 Boosted)</span>}
            </div>
          </div>
        </div>

        {/* Sub-toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>
              Moves: <strong className="text-slate-900 font-mono">{moveCount}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate max-w-[180px] sm:max-w-xs">{currentImage.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReference(!showReference)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {showReference ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showReference ? 'Hide Sample' : 'View Sample'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowNumbers(!showNumbers)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                showNumbers
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Numbers: {showNumbers ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={shuffleTiles}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              title="Reshuffle Puzzle"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Reference Image Preview Drawer */}
        {showReference && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Target Image Reference:</span>
              <span className="text-[11px] text-slate-500">Arrange tiles to match this picture</span>
            </div>
            <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-lg overflow-hidden border border-slate-300 shadow-sm">
              <img
                src={currentImage.src}
                alt="Target Solution Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* 3x3 Puzzle Arena */}
        <div className="max-w-[340px] sm:max-w-[380px] mx-auto space-y-4">
          <div className="aspect-square w-full rounded-2xl border-4 border-slate-900 bg-slate-900 p-1.5 shadow-md">
            <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full">
              {tiles.map((tileIndex, slotIndex) => {
                const row = Math.floor(tileIndex / 3);
                const col = tileIndex % 3;
                const isSelected = selectedTileIndex === slotIndex;
                const isCorrect = tileIndex === slotIndex;

                return (
                  <button
                    key={slotIndex}
                    type="button"
                    onClick={() => handleTileClick(slotIndex)}
                    className={`relative overflow-hidden rounded-lg select-none transition-all active:scale-95 focus:outline-hidden ${
                      isSelected
                        ? 'ring-4 ring-amber-400 z-10 shadow-lg scale-98'
                        : 'hover:brightness-105'
                    }`}
                    style={{
                      backgroundImage: `url(${currentImage.src})`,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${col * 50}% ${row * 50}%`,
                    }}
                  >
                    {/* Visual guide number if enabled */}
                    {showNumbers && (
                      <div
                        className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-mono font-bold shadow-xs ${
                          isCorrect
                            ? 'bg-emerald-600/90 text-white'
                            : 'bg-black/75 text-white'
                        }`}
                      >
                        {tileIndex + 1}
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-400/25 border-2 border-amber-400 rounded-lg flex items-center justify-center">
                        <span className="rounded bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                          Selected
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Click any tile to select, then click another tile to swap them into the correct order.
          </p>

          {/* Solved Banner & Claim CTA */}
          {isSolved && (
            <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-center space-y-1">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs mb-1">
                  <Trophy className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Image Puzzle Mastered!
                </h4>
                <p className="text-xs text-emerald-700">
                  You arranged all 9 tiles in {moveCount} moves! Click below to view the sponsor ad and claim your {pointsToEarn} coins.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaim}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 px-6 text-sm font-black text-slate-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 active:scale-98 transition-all animate-bounce"
              >
                <Sparkles className="h-4 w-4 fill-slate-950" />
                <span>Claim {pointsToEarn} Coins Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <PropellerBannerAd zoneId="8492025" size="responsive" />
    </div>
  );
};
