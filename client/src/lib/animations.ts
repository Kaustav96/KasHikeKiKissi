/**
 * Animation Constants - Standardized timing and easing for consistent UX
 * Use these throughout the application for professional motion design
 */

export const ANIMATION_CONSTANTS = {
  // Durations (in seconds)
  duration: {
    instant: 0.2,
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    verySlow: 1.2,
  },

  // Easing curves for natural motion
  easing: {
    // Smooth deceleration - best for most UI animations
    smooth: [0.16, 1, 0.3, 1] as const,

    // Slight bounce - for playful interactions
    bounce: [0.68, -0.55, 0.265, 1.55] as const,

    // Sharp deceleration - for quick transitions
    sharp: [0.4, 0, 0.2, 1] as const,

    // Gentle ease - for subtle movements
    gentle: [0.25, 0.46, 0.45, 0.94] as const,
  },

  // Stagger timing for sequential animations
  stagger: {
    fast: 0.08,
    normal: 0.15,
    slow: 0.25,
  },

  // Delays for coordinated sequences
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.4,
  },
};

/**
 * Common animation variants for Framer Motion
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: {
    duration: ANIMATION_CONSTANTS.duration.normal,
    ease: ANIMATION_CONSTANTS.easing.smooth
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: ANIMATION_CONSTANTS.duration.normal
  },
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: {
    duration: ANIMATION_CONSTANTS.duration.normal,
    ease: ANIMATION_CONSTANTS.easing.smooth
  },
};

export const slideInFromLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    duration: ANIMATION_CONSTANTS.duration.normal,
    ease: ANIMATION_CONSTANTS.easing.smooth
  },
};

export const slideInFromRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    duration: ANIMATION_CONSTANTS.duration.normal,
    ease: ANIMATION_CONSTANTS.easing.smooth
  },
};

/**
 * Stagger container for sequential children animations
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONSTANTS.stagger.normal,
    },
  },
};

