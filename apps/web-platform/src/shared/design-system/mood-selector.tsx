import styles from '../../app/app.module.css';
import {
  PLATFORM_MOODS,
  type PlatformMoodKey,
} from '../layout/platform-shell.model';

type MoodSelectorProps = {
  mood: PlatformMoodKey;
  onMoodChange: (mood: PlatformMoodKey) => void;
};

export function MoodSelector({ mood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className={styles.moodPanel}>
      <div>
        <span>Modo visual</span>
        <strong>
          {PLATFORM_MOODS.find((platformMood) => platformMood.key === mood)?.label}
        </strong>
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
