import type { ReelId } from '../state/store';
import Canister from './Canister';
import { CANISTER_POSITIONS } from './layout';

const REELS: ReelId[] = ['I', 'II', 'III'];

// The three film canisters at the foot of the stool, one per reel.
export default function Canisters() {
  return (
    <>
      {REELS.map((reel, index) => (
        <Canister key={reel} reel={reel} number={index + 1} position={CANISTER_POSITIONS[index]} />
      ))}
    </>
  );
}
