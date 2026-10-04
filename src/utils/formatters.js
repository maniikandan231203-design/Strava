// Convert mm:ss or hh:mm:ss to total seconds
export function timeStringToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

// Convert seconds back to formatted string (hh:mm:ss or mm:ss)
export function secondsToTimeString(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const pad = (n) => String(n).padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

// Parse pace string like "5:30/km" or "5:30" to seconds per km
export function paceStringToSeconds(paceStr) {
  if (!paceStr) return 0;
  const clean = paceStr.replace(/\/km/i, '').trim();
  return timeStringToSeconds(clean);
}

// Format seconds into "m:ss/km"
export function secondsToPaceString(secondsPerKm) {
  if (!secondsPerKm || isNaN(secondsPerKm) || secondsPerKm <= 0) return '--:--/km';
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  return `${mins}:${String(secs).padStart(2, '0')}/km`;
}

// Calculate summary stats from runs array
export function calculateStats(runs) {
  if (!runs || runs.length === 0) {
    return {
      totalRuns: 0,
      totalDistance: 0,
      avgPace: '--:--/km',
      totalElevation: 0,
      longestRun: 0,
    };
  }

  const totalRuns = runs.length;
  const totalDistance = runs.reduce((acc, r) => acc + (Number(r.distance) || 0), 0);
  const totalElevation = runs.reduce((acc, r) => acc + (Number(r.elevationGain) || 0), 0);
  const longestRun = Math.max(...runs.map((r) => Number(r.distance) || 0));

  // Calculate weighted average pace based on total moving time / total distance
  let totalMovingSeconds = 0;
  let distanceForPace = 0;

  runs.forEach((r) => {
    const dist = Number(r.distance) || 0;
    const timeSec = timeStringToSeconds(r.movingTime);
    if (dist > 0 && timeSec > 0) {
      totalMovingSeconds += timeSec;
      distanceForPace += dist;
    } else if (dist > 0 && r.avgPace) {
      const paceSec = paceStringToSeconds(r.avgPace);
      if (paceSec > 0) {
        totalMovingSeconds += paceSec * dist;
        distanceForPace += dist;
      }
    }
  });

  const avgPaceSec = distanceForPace > 0 ? totalMovingSeconds / distanceForPace : 0;

  return {
    totalRuns,
    totalDistance: Number(totalDistance.toFixed(2)),
    avgPace: secondsToPaceString(avgPaceSec),
    totalElevation: Math.round(totalElevation),
    longestRun: Number(longestRun.toFixed(2)),
  };
}

// Format date nicely (e.g., "Sep 26, 2026")
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
