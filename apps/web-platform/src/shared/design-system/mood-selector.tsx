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

function SlidersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M2 14h4" />
      <path d="M10 8h4" />
      <path d="M18 16h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

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
          aria-label="Design mood"
          className={styles.moodCompactButton}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <SlidersIcon />
        </button>
        {isOpen ? (
          <div className={styles.moodCompactMenu} role="menu">
            <div className={styles.moodCompactEyebrow}>Design mood</div>
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
                <span className={styles.moodCompactOptionText}>
                  <span>{platformMood.label}</span>
                  <small>{platformMood.summary}</small>
                </span>
                {mood === platformMood.key ? <CheckIcon /> : null}
              </button>
            ))}
            <p className={styles.moodCompactNote}>
              Frontend-only preference. Backend persistence is future backlog.
            </p>
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
