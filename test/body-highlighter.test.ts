import { afterEach, describe, expect, it, vi } from 'vitest';

import createBodyHighlighter, { BodyHighlighterInstance, MuscleType } from '../src';

describe('createBodyHighlighter', () => {
  let instance: BodyHighlighterInstance;

  afterEach(() => {
    instance?.destroy();
  });

  it('creates DOM structure and appends it to the provided container', () => {
    const container = document.createElement('div');

    instance = createBodyHighlighter({ container });

    expect(container.contains(instance.element)).toBe(true);
    expect(instance.element.querySelector('svg')).not.toBeNull();
    expect(instance.element.querySelectorAll('polygon').length).toBeGreaterThan(0);
  });

  it('triggers callback when a muscle polygon is clicked', () => {
    const onClick = vi.fn();

    instance = createBodyHighlighter({
      data: [{ name: 'Bench Press', muscles: [MuscleType.CHEST] }],
      highlightedColors: ['#ff0000'],
      onClick,
    });

    const polygon = instance.element.querySelector('polygon');

    expect(polygon).not.toBeNull();

    polygon?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject({
      muscle: MuscleType.CHEST,
      data: {
        exercises: ['Bench Press'],
        frequency: 1,
      },
    });
  });

  it('updates polygon fill color when provided data or colors change', () => {
    instance = createBodyHighlighter({
      bodyColor: '#cccccc',
    });

    const polygon = instance.element.querySelector('polygon') as SVGPolygonElement;
    const initialStyle = polygon.getAttribute('style') ?? '';

    expect(initialStyle).toContain('#cccccc');

    instance.update({
      data: [{ name: 'Bench Press', muscles: [MuscleType.CHEST] }],
      highlightedColors: ['#111111'],
    });

    const updatedPolygon = instance.element.querySelector('polygon') as SVGPolygonElement;
    const updatedStyle = updatedPolygon.getAttribute('style') ?? '';

    expect(updatedStyle).toContain('#111111');
    expect(updatedStyle).not.toEqual(initialStyle);
  });
});
