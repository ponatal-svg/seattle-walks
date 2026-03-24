import { walk10 } from '../data/walk10';

describe('walk10 data', () => {
  it('has correct id and metadata', () => {
    expect(walk10.id).toBe(10);
    expect(walk10.difficulty).toBe('strenuous');
    expect(walk10.totalStops).toBe(15);
  });

  it('has exactly 15 waypoints', () => {
    expect(walk10.waypoints).toHaveLength(15);
  });

  it('waypoint ids are sequential 1-15', () => {
    walk10.waypoints.forEach((wp, i) => {
      expect(wp.id).toBe(i + 1);
    });
  });

  it('every waypoint has valid coords in Seattle area', () => {
    walk10.waypoints.forEach(wp => {
      expect(wp.coords.lat).toBeGreaterThan(47.0);
      expect(wp.coords.lat).toBeLessThan(48.0);
      expect(wp.coords.lng).toBeGreaterThan(-123.0);
      expect(wp.coords.lng).toBeLessThan(-122.0);
    });
  });

  it('every waypoint has non-empty title, location, and content', () => {
    walk10.waypoints.forEach(wp => {
      expect(wp.title.trim().length).toBeGreaterThan(0);
      expect(wp.location.trim().length).toBeGreaterThan(0);
      expect(wp.content.trim().length).toBeGreaterThan(50);
    });
  });

  it('walk is marked as reversed', () => {
    expect(walk10.reversed).toBe(true);
  });

  it('first waypoint is the UW bus stop (reversed start)', () => {
    expect(walk10.waypoints[0].title).toContain('Metro');
  });

  it('last waypoint is Green Lake (reversed end)', () => {
    expect(walk10.waypoints[14].title).toContain('Green Lake');
  });
});
