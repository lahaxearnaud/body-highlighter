import createBodyHighlighter, {
  BodyHighlighterInstance,
  IExerciseData,
  IMuscleStats,
  ModelType,
  MuscleType,
} from 'body-highlighter';

const anteriorContainer = document.getElementById('anterior-model');
const posteriorContainer = document.getElementById('posterior-model');
const logContainer = document.getElementById('log');
const addExerciseButton = document.getElementById('add-exercise');
const resetButton = document.getElementById('reset');

if (!anteriorContainer || !posteriorContainer) {
  throw new Error('Example markup is missing model containers.');
}

const INITIAL_DATA: IExerciseData[] = [
  { name: 'Bench Press', muscles: [MuscleType.CHEST, MuscleType.TRICEPS, MuscleType.FRONT_DELTOIDS] },
  { name: 'Deadlift', muscles: [MuscleType.HAMSTRING, MuscleType.LOWER_BACK, MuscleType.GLUTEAL] },
  { name: 'Extensions lombaires', muscles: ['Erector Spinae'] },
];

let currentData: IExerciseData[] = [...INITIAL_DATA];

const renderLog = (payload: IMuscleStats | null) => {
  if (!logContainer) return;

  logContainer.textContent = payload
    ? `${payload.muscle.toUpperCase()} (${payload.data.frequency}) -> ${JSON.stringify(payload.data.exercises)}`
    : 'Click a muscle to view its stats';
};

const createInstance = (options: Partial<Parameters<typeof createBodyHighlighter>[0]> = {}): BodyHighlighterInstance =>
  createBodyHighlighter({
    data: currentData,
    highlightedColors: ['#7ed6df', '#e056fd', '#686de0'],
    style: { width: '240px', padding: '24px' },
    svgStyle: { borderRadius: '16px', backgroundColor: '#1e272e' },
    onClick: stats => renderLog(stats),
    ...options,
  });

const anteriorHighlighter = createInstance({ container: anteriorContainer });
const posteriorHighlighter = createInstance({ container: posteriorContainer, type: ModelType.POSTERIOR });

const syncHighlighters = () => {
  anteriorHighlighter.update({ data: currentData });
  posteriorHighlighter.update({ data: currentData });
};

addExerciseButton?.addEventListener('click', () => {
  currentData = [
    ...currentData,
    {
      name: 'Pull Ups',
      muscles: [MuscleType.BICEPS, MuscleType.UPPER_BACK, MuscleType.BACK_DELTOIDS],
    },
  ];

  syncHighlighters();
});

resetButton?.addEventListener('click', () => {
  currentData = [...INITIAL_DATA];
  renderLog(null);
  syncHighlighters();
});

renderLog(null);

// Expose for quick debugging in the console
(window as unknown as { highlighter?: BodyHighlighterInstance }).highlighter = anteriorHighlighter;
