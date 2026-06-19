import { useState } from 'react';
import styles from '../../app/app.module.css';
import {
  PLATFORM_MOODS,
  type PlatformMoodKey,
} from '../layout/platform-shell.model';

type MoodSelectorProps = {
  mood: PlatformMoodKey;
  onMoodChange: (mood: PlatformMoodKey) => void;
  variant?: 'full' | 'compact';
};

export function MoodSelector({
  mood,
  onMoodChange,
  variant = 'full',
}: MoodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeMood = PLATFORM_MOODS.find(
    (platformMood) => platformMood.key === mood,
  );

  if (variant === 'compact') {
    return (
      <div className={styles.moodCompact}>
        <button
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={`Mood: ${activeMood?.label ?? mood}`}
          className={styles.moodCompactButton}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span
            aria-hidden="true"
            className={styles.moodSwatch}
            data-preview-mood={activeMood?.key ?? mood}
          />
          <span>{activeMood?.label ?? mood}</span>
        </button>
        {isOpen ? (
          <div className={styles.moodCompactMenu} role="menu">
            {PLATFORM_MOODS.map((platformMood) => (
              <button
                aria-checked={mood === platformMood.key}
                className={styles.moodCompactOption}
                key={platformMood.key}
                onClick={() => {
                  onMoodChange(platformMood.key);
                  setIsOpen(false);
                }}
                role="menuitemradio"
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={styles.moodSwatch}
                  data-preview-mood={platformMood.key}
                />
                <span>{platformMood.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.moodPanel}>
      <div>
        <span>Modo visual</span>
        <strong>{activeMood?.label}</strong>
      </div>
      <div
        aria-label="Elegir mood de interfaz"
        className={styles.moodSelector}
        role="radiogroup"
      >
        {PLATFORM_MOODS.map((platformMood) => (
          <button
            aria-checked={mood === platformMood.key}
            aria-label={`${platformMood.label}: ${platformMood.summary}`}
            className={`${styles.moodButton} ${
              mood === platformMood.key ? styles.moodButtonActive : ''
            }`}
            key={platformMood.key}
            onClick={() => onMoodChange(platformMood.key)}
            role="radio"
            title={platformMood.summary}
            type="button"
          >
            <span
              className={styles.moodSwatch}
              data-preview-mood={platformMood.key}
            />
            <span>{platformMood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
