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
  const activeMood = PLATFORM_MOODS.find(
    (platformMood) => platformMood.key === mood,
  );

  if (variant === 'compact') {
    return (
      <label className={styles.moodCompact}>
        <span>Modo</span>
        <select
          aria-label="Elegir mood de interfaz"
          onChange={(event) => onMoodChange(event.target.value as PlatformMoodKey)}
          value={mood}
        >
          {PLATFORM_MOODS.map((platformMood) => (
            <option key={platformMood.key} value={platformMood.key}>
              {platformMood.label}
            </option>
          ))}
        </select>
        <i
          aria-hidden="true"
          className={styles.moodSwatch}
          data-preview-mood={activeMood?.key ?? mood}
        />
      </label>
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
