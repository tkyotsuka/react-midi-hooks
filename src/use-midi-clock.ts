import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import { Input } from './types';
import { useConnectInput } from './use-connect-input';
import { MIDIConstants } from './constants';

export const useMIDIClock = (input: Input, division = 1) => {
  useConnectInput(input);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClockMessage = () => {
    // Keep track of count through closure. Is there a better way?
    let steps = 0;
    return (type: number) => {
      switch (type) {
        case MIDIConstants.tick:
          steps++;
          if (division === 1) setStep(steps);
          else if (steps % division === 0)
            setStep(Math.floor(steps / division));
          break;
        case MIDIConstants.play:
          setIsPlaying(true);
          break;
        case MIDIConstants.stop:
          steps = 0;
          setIsPlaying(false);
          setStep(0);
          break;
        default:
          break;
      }
    };
  };

  useEffect(() => {
    if (!input) return;
    const id = uniqid();
    input.clockListeners[id] = handleClockMessage();
    return () => {delete input.clockListeners[id];
    };
  }, [input]);
  return [step, isPlaying];
};
