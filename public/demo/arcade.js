/* Deterministic, renderer-independent arcade challenges.
   Fixed substeps keep collisions consistent at different frame rates. */
(() => {
  'use strict';
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const DRIVE_LENGTH = 11200, CHASE_LENGTH = 10800;
  const DRIVE_Y = 523, ROAD_SCALE = .72, LANE_WIDTH = 120;
  const roadCenter = z => 640 + Math.sin(z / 2100) * 110 + Math.sin(z / 3700) * 45;

  function createDrive(attempt = 1) {
    const traffic = [];
    // Every wave has an open lane; wave spacing allows even a two-lane change.
    const waves = [[0], [-1, 0], [0, 1], [-1], [0, 1], [-1, 1], [-1, 0],
      [1], [-1, 0], [-1, 1], [0, 1], [0], [-1, 0], [0, 1], [-1, 1], [0, 1]];
    waves.forEach((lanes, row) => lanes.forEach((lane, column) => {
      const truck = row % 5 === 3 && column === 0;
      traffic.push({id: traffic.length, z: 1100 + row * 635, lane, speed: 62,
        width: truck ? 72 : 62, length: truck ? 153 : 119, truck,
        color: ['#b96f58', '#c9b87b', '#577a93', '#b3bbb0', '#796a91'][(row + column) % 5],
        passed: false});
    }));
    return {attempt, distance: 0, x: roadCenter(0), offset: 0, targetX: null,
      speed: 0, countdown: 2.6, status: 'ready', elapsed: 0, traffic,
      passed: 0, nearMisses: 0, parked: false, bump: 0, crash: null};
  }

  function driveStep(d, dt, input) {
    if (d.status === 'crashed' || d.status === 'finished') return null;
    if (d.countdown > 0) {
      d.countdown = Math.max(0, d.countdown - dt);
      d.status = d.countdown > 0 ? 'ready' : 'running';
      return null;
    }
    d.elapsed += dt;
    const desired = input.brake ? 285 : input.gas ? 630 : 455 + d.distance / DRIVE_LENGTH * 65;
    d.speed += (desired - d.speed) * Math.min(1, dt * 4.5);
    d.distance += d.speed * dt;
    const centre = roadCenter(d.distance);
    if (input.steer) {
      d.offset += input.steer * 430 * dt;
      d.targetX = null;
    } else if (d.targetX !== null) {
      const target = clamp(d.targetX - centre, -170, 170);
      d.offset += clamp(target - d.offset, -430 * dt, 430 * dt);
    }
    d.offset = clamp(d.offset, -170, 170);
    d.x = centre + d.offset;
    for (const vehicle of d.traffic) {
      const previousGap = vehicle.z - (d.distance - d.speed * dt);
      vehicle.z += vehicle.speed * dt;
      const gap = vehicle.z - d.distance;
      const lateral = Math.abs(d.x - (roadCenter(vehicle.z) + vehicle.lane * LANE_WIDTH));
      const halfWidth = vehicle.width / 2 + 24;
      const halfLength = (vehicle.length + 104) / (2 * ROAD_SCALE);
      if (Math.abs(gap) < halfLength && lateral < halfWidth) {
        d.status = 'crashed';
        d.crash = {vehicle: vehicle.id, x: d.x, y: DRIVE_Y - Math.max(0, gap) * ROAD_SCALE};
        return 'crash';
      }
      if (!vehicle.passed && gap < -halfLength) {
        vehicle.passed = true;
        d.passed++;
      }
      if (previousGap >= 0 && gap < 0 && lateral >= halfWidth && lateral < halfWidth + 29) {
        d.nearMisses++;
      }
    }
    if (d.distance >= DRIVE_LENGTH) {
      d.distance = DRIVE_LENGTH;
      d.status = 'finished';
      return 'finish';
    }
    return null;
  }

  function createChase(attempt = 1) {
    const types = [
      {kind: 'cone', width: 44, height: 62},
      {kind: 'crate', width: 66, height: 77},
      {kind: 'barrier', width: 92, height: 88},
      {kind: 'double', width: 112, height: 73}
    ];
    const gaps = [610, 560, 670, 575, 640, 570, 690, 580];
    const obstacles = [];
    let z = 980;
    for (let i = 0; z < CHASE_LENGTH - 550; i++) {
      obstacles.push({id: i, z, ...types[[0, 1, 2, 1, 3, 0, 2, 3][i % 8]], passed: false});
      z += gaps[i % gaps.length];
    }
    return {attempt, distance: 0, speed: 0, countdown: 2.6, status: 'ready',
      elapsed: 0, jumpY: 0, vy: 0, jumpBuffer: 0, obstacles, cleared: 0,
      done: false, crash: null};
  }

  function queueJump(c) {
    if (c.status !== 'running' || c.countdown > 0) return false;
    c.jumpBuffer = .12;
    return true;
  }

  function chaseStep(c, dt) {
    if (c.status === 'crashed' || c.status === 'finished') return null;
    if (c.countdown > 0) {
      c.countdown = Math.max(0, c.countdown - dt);
      c.status = c.countdown > 0 ? 'ready' : 'running';
      return null;
    }
    c.elapsed += dt;
    c.speed = 390 + c.distance / CHASE_LENGTH * 110;
    c.distance += c.speed * dt;
    if (c.jumpBuffer > 0 && c.jumpY === 0) {
      c.vy = 650;
      c.jumpBuffer = 0;
    }
    c.jumpBuffer = Math.max(0, c.jumpBuffer - dt);
    if (c.jumpY > 0 || c.vy > 0) {
      c.jumpY = Math.max(0, c.jumpY + c.vy * dt - .5 * 1550 * dt * dt);
      c.vy -= 1550 * dt;
      if (c.jumpY === 0) c.vy = 0;
    }
    for (const obstacle of c.obstacles) {
      const gap = obstacle.z - c.distance;
      const radius = obstacle.width / 2 + 18;
      if (Math.abs(gap) < radius && c.jumpY < obstacle.height - 7) {
        c.status = 'crashed';
        c.crash = {obstacle: obstacle.id};
        return 'crash';
      }
      if (!obstacle.passed && gap < -radius) {
        obstacle.passed = true;
        c.cleared++;
      }
    }
    if (c.distance >= CHASE_LENGTH) {
      c.distance = CHASE_LENGTH;
      c.status = 'finished';
      c.done = true;
      return 'finish';
    }
    return null;
  }

  function advance(state, seconds, input, step) {
    let left = Math.max(0, seconds);
    while (left > .000001) {
      const dt = Math.min(1 / 120, left);
      const event = step(state, dt, input);
      if (event) return event;
      left -= dt;
    }
    return null;
  }

  function clubCast(chapter) {
    return {named: chapter === 2 ? ['me', 'luana'] : ['me', 'luana', 'pere', 'maria'], guests: 26};
  }

  window.MemoryArcade = Object.freeze({
    DRIVE_LENGTH, CHASE_LENGTH, DRIVE_Y, ROAD_SCALE, LANE_WIDTH,
    roadCenter, createDrive, createChase, queueJump, clubCast,
    updateDrive: (d, dt, input = {}) => advance(d, dt, input, driveStep),
    updateChase: (c, dt) => advance(c, dt, {}, chaseStep)
  });
})();
