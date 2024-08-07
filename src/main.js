import { k } from "./kaboomCtx";
// import { dialogueData, scaleFactor } from "./constants";
import { scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";
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

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
    // Load the map created with Tiled
    const mapData = await (await fetch("./map.json")).json();
    // Get the Layers from the map
    const layers = mapData.layers;

    // Create the maps as a game object
    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    // Create player as a game object
    const player = k.make([
        // Add sprite
        k.sprite("spritesheet", { anim: "idle-down" }),
        // Add the area that contains
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        // Gives it body characteristics and behaviour
        k.body(),
        // Draw the character from the center (instead of the corners)
        k.anchor("center"),
        // Use the pin from the map to set the player
        k.pos(),
        // Multiuplying for the size defined before
        k.scale(scaleFactor),
        // Hold specific characteristics of this game object that can be accessed later
        {
            speed: 250,
            direction: "down",
            // Prevent the character from moving
            isInDialogue: false,
        },
        // The following tag helps to identify the game object for collisions
        "player",
    ]);

    for (const layer of layers) {
        // "painting" map/objects behaviour
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    // Avoid character to overlaps boundaries
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(
                            dialogueData[boundary.name],
                            () => (player.isInDialogue = false)
                        );
                    });
                }
            }

            continue;
        }
        // "painting" chatacter behaviour
        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    // Camera behaviour.
    // Resize the camera given the size of the screen
    setCamScale(k);
    k.onResize(() => {
        setCamScale(k);
    });
    // Move camera following character position
    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y - 100);
    });

    // Movement behaviour
    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (
            mouseAngle > lowerBound &&
                mouseAngle < upperBound &&
                player.curAnim() !== "walk-up"
        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        }

        if (
            mouseAngle < -lowerBound &&
                mouseAngle > -upperBound &&
                player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        }
    });

    function stopAnims() {
        if (player.direction === "down") {
            player.play("idle-down");
            return;
        }
        if (player.direction === "up") {
            player.play("idle-up");
            return;
        }

        player.play("idle-side");
    }

    k.onMouseRelease(stopAnims);

});

// Excute the main scene
k.go("main");


