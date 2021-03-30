export function debunce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}

export const publicKey = `MIIDRjCCAjkGByqGSM44BAEwggIsAoIBAQC+CNyjRFHqRrOCeM8V1Ov1GtUDaxzL
L59Sdxs2UHqNR1Wisqs/vDxlEqMZnqc2qmxzlRBKtTrXFVQxxzwINV2CFu1jMs4j
ebYgDASrYiDveBR27CgXgBrWzJOtoazLnodihogMOJqKI6eiLFpSNEQxU3U/Y79S
Va5tbAFudg+I7nL+KgL73W2e1+poSaMcbXnDmVdJx2E2ptdvEmtrZUIFcMDgeqjW
fAVZGg6It2/ReE6l81h233XcIIdw2EGOYmi8h2lj7m0cKHqo/3QzwCglFxWLnkRH
1NHabCuVWw/6F8cP+4RiEpyXP8idJCwKd//Il9u4R4mUUuBmJzshOtd3AiEA/KlQ
e1PSKJ6JrlxIv5ylK1/xIx/MW5s+NZspCOh2UPUCggEAZvwI7T7UrqDIPd8OLbmB
49YRxXSQv7ne36Rl103ZyFPc0wpLiOgaMb4cERRG0nB5KBoi9+hmSN7s4ntoMGTT
vTLpoPuFpKhZHnz9iHLHDZ/sfBrc3N1Fhnt+Y/nS6X1OCE0FN3T7zkYEZAH7xNqi
tcSbgR8zrN3xbeasquSt5UlNvIjuMiy+vTCUiFn+jfDmoOxeMsctwHzJDmpbzKWz
OF96fz2F1VnjXr5ZKbfZjxsKMQnuEdLExf6IR4vmAbKILZ0FuohJWsrKWM7zOWGH
VpGLH8GbxVX1XHRQnMUNc1wiAOXZJfwJrQx6W0eJxgMkXPXL/r+XXdeVrFaFYn+E
iAOCAQUAAoIBAFN9fiZNp7rQ7aKUdeNdthhK3n+ejHgnyYk9lIPNYmOFGuo9pX4M
Hs+jgOsX2stmTsLeEM90gCp/is/gIdAh4UZLQClimSRVWzHk2VZuvs10uX5ubQa6
RgsnPKwMCRgsN3lIdDDAvLABzDpZpBOAS3Hv89CdfPKW3pMhQ3Vq7GkEuxYZYCz8
LbVNh0IGc21i9ZpJMnL5WenhgAO6/DljcYnIc56c4BSFjXUDtaqcIBNiHV13Ev30
meLQD92usbzWAlvYtkNxkinz7ZYAQBWtwzqQ7oZeKnppTTwcfsyFQqggExRm2F5B
fk4W9k2JuHQAIMLZMNJZbgdZ1s03HNI2+qo=`;