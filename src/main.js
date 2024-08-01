import { k } from "./kaboomCtx";
k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 788,
        "walk-down": { from: 788, to: 789, loop: true, speed: 8 },
        "idle-side": 790,
        "walk-side": { from: 790, to: 791, loop: true, speed: 8 },
        "idle-up": 827,
        "walk-up": { from: 827, to: 828, loop: true, speed: 8 },
    },
});
