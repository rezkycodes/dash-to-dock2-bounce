// bounceAnimation.js - Multiple bounce animation variations (dash2dock-lite compatible)
'use strict';

import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export const ClickAnimationStyle = {
    DEFAULT: 0,
    BOUNCE: 1,
    BOUNCE_ONCE: 2,
    ELASTIC: 3,
    JELLY: 4,
    POP: 5,
    RUBBER: 6,
    WOBBLE: 7,
    HEARTBEAT: 8,
    SWING: 9,
    FLIP: 10,
    PULSE: 11,
    SHAKE: 12,
    TRAMPOLINE: 13,
    TWIST: 14,
    DROP: 15
};

// Easing functions from dash2dock-lite
const Linear = {
    easeNone: (t, b, c, d) => {
        return (c * t) / d + b;
    }
};

const Bounce = {
    easeOut: (t, b, c, d) => {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            let postFix = (t -= 1.5 / 2.75);
            return c * (7.5625 * postFix * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            let postFix = (t -= 2.25 / 2.75);
            return c * (7.5625 * postFix * t + 0.9375) + b;
        } else {
            let postFix = (t -= 2.625 / 2.75);
            return c * (7.5625 * postFix * t + 0.984375) + b;
        }
    }
};

const Back = {
    easeOut: (t, b, c, d) => {
        let s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
};

export class BounceAnimator {
    constructor(settings) {
        this._settings = settings;
        this._activeAnimations = new Map();
    }

    destroy() {
        for (let [actor, data] of this._activeAnimations) {
            if (data.sourceId) {
                GLib.source_remove(data.sourceId);
            }
            if (data.cloneActor && data.cloneActor.get_parent()) {
                data.cloneActor.get_parent().remove_child(data.cloneActor);
                data.cloneActor.destroy();
            }
            if (actor) {
                actor.opacity = 255;
            }
        }
        this._activeAnimations.clear();
    }

    _getAnimationStyle() {
        try {
            return this._settings.get_enum('click-animation-style');
        } catch (e) {
            return ClickAnimationStyle.BOUNCE;
        }
    }

    _getDockPosition() {
        try {
            return this._settings.get_enum('dock-position');
        } catch (e) {
            return 2; // BOTTOM
        }
    }

    _interpolate(progress, keyframes) {
        const totalFrames = keyframes.length - 1;
        const scaledProgress = progress * totalFrames;
        const frameIndex = Math.floor(scaledProgress);
        const frameFraction = scaledProgress - frameIndex;

        if (frameIndex >= totalFrames) {
            return keyframes[totalFrames];
        }

        const currentValue = keyframes[frameIndex];
        const nextValue = keyframes[frameIndex + 1];
        const t = frameFraction;
        const smoothT = t * t * (3 - 2 * t);
        
        return currentValue + (nextValue - currentValue) * smoothT;
    }

    /**
     * Create dash2dock-lite style bounce animation
     * Uses Linear easeNone for rise and Bounce easeOut for fall
     */
    _createDash2DockBounce(duration, travel) {
        const t = 250; // Duration for each rise
        const totalDuration = duration;
        const bounces = 3;
        const keyframes = [];

        // Create 3 bounces
        for (let i = 0; i < bounces; i++) {
            const riseStart = (t + t * 3) * i / totalDuration;
            const riseEnd = ((t + t * 3) * i + t) / totalDuration;
            const fallStart = riseEnd;
            const fallEnd = (t + t * 3) * (i + 1) / totalDuration;

            // Rise phase (Linear)
            for (let j = 0; j <= 10; j++) {
                const progress = j / 10;
                const time = progress * t;
                const value = Linear.easeNone(time, 0, travel, t) / travel;
                keyframes.push({y: value});
            }

            // Fall phase (Bounce easeOut)
            for (let j = 0; j <= 30; j++) {
                const progress = j / 30;
                const time = progress * (t * 3);
                const value = Bounce.easeOut(time, travel, -travel, t * 3) / travel;
                keyframes.push({y: value});
            }
        }

        keyframes.push({y: 0}); // Final settle
        return keyframes;
    }

    _getAnimationData(animStyle) {
        const configs = {
            [ClickAnimationStyle.BOUNCE]: {
                duration: 3000, // 3 seconds like dash2dock-lite (3 bounces)
                useDash2DockBounce: true
            },
            [ClickAnimationStyle.BOUNCE_ONCE]: {
                duration: 800,
                keyframes: [
                    {y: 0.00, scale: 1.00}, {y: 0.87, scale: 1.08}, {y: 0.76, scale: 1.04},
                    {y: 0.00, scale: 1.00}, {y: 0.17, scale: 1.01}, {y: 0.00, scale: 1.00},
                    {y: 0.07, scale: 1.00}, {y: 0.00, scale: 1.00}
                ]
            },
            [ClickAnimationStyle.ELASTIC]: {
                duration: 1000,
                keyframes: [
                    {y: 0.00, scale: 1.00}, {y: 1.09, scale: 1.10}, {y: -0.22, scale: 0.95},
                    {y: 0.43, scale: 1.05}, {y: -0.11, scale: 0.98}, {y: 0.17, scale: 1.02},
                    {y: 0.00, scale: 1.00}
                ]
            },
            [ClickAnimationStyle.JELLY]: {
                duration: 900,
                keyframes: [
                    {y: 0.00, scaleX: 1.00, scaleY: 1.00}, {y: 0.65, scaleX: 0.90, scaleY: 1.15},
                    {y: 0.00, scaleX: 1.15, scaleY: 0.85}, {y: 0.33, scaleX: 0.95, scaleY: 1.08},
                    {y: 0.00, scaleX: 1.08, scaleY: 0.92}, {y: 0.11, scaleX: 0.98, scaleY: 1.03},
                    {y: 0.00, scaleX: 1.00, scaleY: 1.00}
                ]
            },
            [ClickAnimationStyle.POP]: {
                duration: 500,
                keyframes: [
                    {scale: 1.00}, {scale: 1.25}, {scale: 0.90}, {scale: 1.10},
                    {scale: 0.97}, {scale: 1.00}
                ]
            },
            [ClickAnimationStyle.RUBBER]: {
                duration: 800,
                keyframes: [
                    {scaleX: 1.00, scaleY: 1.00}, {scaleX: 1.25, scaleY: 0.75},
                    {scaleX: 0.75, scaleY: 1.25}, {scaleX: 1.15, scaleY: 0.85},
                    {scaleX: 0.95, scaleY: 1.05}, {scaleX: 1.05, scaleY: 0.95},
                    {scaleX: 1.00, scaleY: 1.00}
                ]
            },
            [ClickAnimationStyle.WOBBLE]: {
                duration: 800,
                keyframes: [
                    {x: 0.00, y: 0.00, rot: 0}, {x: -0.33, y: 0.43, rot: -5},
                    {x: 0.22, y: 0.00, rot: 3}, {x: -0.17, y: 0.26, rot: -3},
                    {x: 0.11, y: 0.00, rot: 2}, {x: -0.07, y: 0.11, rot: -1},
                    {x: 0.00, y: 0.00, rot: 0}
                ]
            },
            [ClickAnimationStyle.HEARTBEAT]: {
                duration: 1200,
                keyframes: [
                    {scale: 1.0}, {scale: 1.3}, {scale: 1.0}, {scale: 1.3}, {scale: 1.0}, {scale: 1.0}
                ]
            },
            [ClickAnimationStyle.SWING]: {
                duration: 800,
                keyframes: [
                    {y: 0.00, rot: 0}, {y: 0.22, rot: 15}, {y: 0.00, rot: -10},
                    {y: 0.11, rot: 5}, {y: 0.00, rot: -3}, {y: 0.00, rot: 0}
                ]
            },
            [ClickAnimationStyle.SHAKE]: {
                duration: 600,
                keyframes: [
                    {x: 0.00, y: 0.00}, {x: -0.17, y: 0.11}, {x: 0.17, y: 0.22},
                    {x: -0.13, y: 0.33}, {x: 0.13, y: 0.22}, {x: -0.09, y: 0.11},
                    {x: 0.09, y: 0.00}, {x: -0.04, y: 0.07}, {x: 0.04, y: 0.00},
                    {x: -0.02, y: 0.02}, {x: 0.00, y: 0.00}
                ]
            },
            [ClickAnimationStyle.TRAMPOLINE]: {
                duration: 1000,
                keyframes: [
                    {y: 0.00, scaleY: 1.00}, {y: 0.00, scaleY: 0.80}, {y: 1.74, scaleY: 1.10},
                    {y: 0.00, scaleY: 0.85}, {y: 0.87, scaleY: 1.05}, {y: 0.00, scaleY: 0.92},
                    {y: 0.33, scaleY: 1.02}, {y: 0.00, scaleY: 1.00}
                ]
            },
            [ClickAnimationStyle.PULSE]: {
                duration: 800,
                keyframes: [
                    {scale: 1.00}, {scale: 1.15}, {scale: 0.95}, {scale: 1.05}, {scale: 1.00}
                ]
            },
            [ClickAnimationStyle.TWIST]: {
                duration: 1000,
                keyframes: [
                    {y: 0.00, rot: 0, scale: 1.00}, {y: 0.87, rot: 180, scale: 1.10},
                    {y: 0.00, rot: 360, scale: 0.95}, {y: 0.33, rot: 540, scale: 1.05},
                    {y: 0.00, rot: 720, scale: 1.00}
                ]
            },
            [ClickAnimationStyle.DROP]: {
                duration: 800,
                keyframes: [
                    {y: -2.17, opacity: 0}, {y: 0.00, opacity: 1}, {y: 0.65, opacity: 1},
                    {y: 0.00, opacity: 1}, {y: 0.33, opacity: 1}, {y: 0.00, opacity: 1},
                    {y: 0.11, opacity: 1}, {y: 0.00, opacity: 1}
                ]
            }
        };

        return configs[animStyle] || configs[ClickAnimationStyle.BOUNCE];
    }

    bounceIcon(actor, dockManager) {
        if (!actor) return;

        const animStyle = this._getAnimationStyle();
        if (animStyle === ClickAnimationStyle.DEFAULT) {
            return;
        }

        // Cancel existing animation
        if (this._activeAnimations.has(actor)) {
            const data = this._activeAnimations.get(actor);
            if (data.sourceId) GLib.source_remove(data.sourceId);
            if (data.cloneActor && data.cloneActor.get_parent()) {
                data.cloneActor.get_parent().remove_child(data.cloneActor);
                data.cloneActor.destroy();
            }
            actor.opacity = 255;
            this._activeAnimations.delete(actor);
        }

        const dockPosition = this._getDockPosition();
        const iconSize = actor.get_height() || 48;
        
        // Travel distance like dash2dock-lite
        const travel = (iconSize / 3) * ((0.25 + 0.5) * 1.5); // Using default animation_bounce value

        const isVertical = (dockPosition === 1 || dockPosition === 3);
        let direction = 1;
        if (dockPosition === 2) direction = -1;
        else if (dockPosition === 0) direction = 1;
        else if (dockPosition === 1) direction = -1;
        else if (dockPosition === 3) direction = 1;

        // Get position
        const [x, y] = actor.get_transformed_position();
        const [width, height] = actor.get_size();

        // Create clone at top level
        const cloneActor = new Clutter.Clone({
            source: actor,
            x: x,
            y: y,
            width: width,
            height: height,
        });

        Main.layoutManager.uiGroup.add_child(cloneActor);
        actor.opacity = 0;

        // Get animation config
        const animData = this._getAnimationData(animStyle);
        let keyframes = animData.keyframes;
        
        // For dash2dock-lite style bounce, generate keyframes dynamically
        if (animData.useDash2DockBounce) {
            keyframes = this._createDash2DockBounce(animData.duration, travel);
        }

        const {duration} = animData;
        const frameTime = 16;
        const startTime = GLib.get_monotonic_time();
        const initialY = y;
        const initialX = x;

        const animate = () => {
            const elapsed = (GLib.get_monotonic_time() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1.0);

            if (progress >= 1.0) {
                if (cloneActor.get_parent()) {
                    cloneActor.get_parent().remove_child(cloneActor);
                    cloneActor.destroy();
                }
                actor.opacity = 255;
                this._activeAnimations.delete(actor);
                return GLib.SOURCE_REMOVE;
            }

            // Interpolate values
            const totalFrames = keyframes.length - 1;
            const frameIdx = progress * totalFrames;
            const idx = Math.floor(frameIdx);
            const frac = frameIdx - idx;
            
            const current = keyframes[Math.min(idx, totalFrames)];
            const next = keyframes[Math.min(idx + 1, totalFrames)];

            // Apply transformations
            let offsetY = 0, offsetX = 0;
            let scaleVal = 1.0, scaleX = 1.0, scaleY = 1.0;
            let rotation = 0;
            let opacityVal = 1.0;

            if (current.y !== undefined) {
                const yVal = current.y + ((next.y || 0) - current.y) * frac;
                offsetY = travel * yVal * direction;
            }
            if (current.x !== undefined) {
                const xVal = current.x + ((next.x || 0) - current.x) * frac;
                offsetX = travel * xVal;
            }
            if (current.scale !== undefined) {
                scaleVal = current.scale + ((next.scale || 1) - current.scale) * frac;
            }
            if (current.scaleX !== undefined) {
                scaleX = current.scaleX + ((next.scaleX || 1) - current.scaleX) * frac;
            }
            if (current.scaleY !== undefined) {
                scaleY = current.scaleY + ((next.scaleY || 1) - current.scaleY) * frac;
            }
            if (current.rot !== undefined) {
                rotation = current.rot + ((next.rot || 0) - current.rot) * frac;
            }
            if (current.opacity !== undefined) {
                opacityVal = current.opacity + ((next.opacity || 1) - current.opacity) * frac;
            }

            // Apply transformations
            if (isVertical) {
                cloneActor.set_position(initialX + offsetY, initialY + offsetX);
            } else {
                cloneActor.set_position(initialX + offsetX, initialY + offsetY);
            }

            if (current.scaleX !== undefined || current.scaleY !== undefined) {
                cloneActor.set_scale(scaleX, scaleY);
            } else if (current.scale !== undefined) {
                cloneActor.set_scale(scaleVal, scaleVal);
            }

            if (current.rot !== undefined) {
                cloneActor.rotation_angle_z = rotation;
            }

            if (current.opacity !== undefined) {
                cloneActor.opacity = opacityVal * 255;
            }

            return GLib.SOURCE_CONTINUE;
        };

        const sourceId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, frameTime, animate);
        this._activeAnimations.set(actor, {sourceId, cloneActor});
    }

    /**
     * Generate dash2dock-lite style bounce keyframes
     * 3 bounces with Linear rise and Bounce easeOut fall
     */
    _createDash2DockBounce(duration, travel) {
        const keyframes = [];
        const t = 250; // Rise duration
        const bounceCount = 3;

        for (let bounce = 0; bounce < bounceCount; bounce++) {
            // Rise phase - Linear easeNone (250ms)
            for (let i = 0; i <= 10; i++) {
                const time = (i / 10) * t;
                const value = Linear.easeNone(time, 0, 1, t);
                keyframes.push({y: value});
            }

            // Fall phase - Bounce easeOut (750ms = 250 * 3)
            for (let i = 0; i <= 30; i++) {
                const time = (i / 30) * (t * 3);
                const value = Bounce.easeOut(time, 1, -1, t * 3);
                keyframes.push({y: value});
            }
        }

        keyframes.push({y: 0}); // Ensure final position
        return keyframes;
    }
}
