"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import type { CharacterConfig } from "./CharacterCustomization";

interface DiveResult {
  score: number;
  tier: string;
  feePercentage: number;
  style: string;
  angle: number;
  rotations: number;
}

interface GameCharacterProps {
  onDive: (result: DiveResult) => void;
  poolPosition: { x: number; y: number; width: number; height: number };
  isEnabled: boolean;
  characterConfig: CharacterConfig;
}

export function GameCharacter({
  onDive,
  poolPosition,
  isEnabled,
  characterConfig,
}: GameCharacterProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [gameState, setGameState] = useState<
    "idle" | "dragging" | "diving" | "splashed"
  >("idle");

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 400,
      height: 300,
      parent: gameRef.current,
      backgroundColor: "transparent",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 800 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    let swimmer: Phaser.Physics.Arcade.Sprite;
    let isDragging = false;
    let dragStartPosition = { x: 0, y: 0 };
    let launchVector = { x: 0, y: 0 };
    let rotationSpeed = 0;
    let diveStyle = "straight";
    let airTime = 0;
    let maxHeight = 0;

    function preload(this: Phaser.Scene) {
      // Convert character colors to hex
      const primaryColor = parseInt(
        characterConfig.colors.primary.replace("#", ""),
        16
      );
      const secondaryColor = parseInt(
        characterConfig.colors.secondary.replace("#", ""),
        16
      );
      const accentColor = parseInt(
        characterConfig.colors.accent.replace("#", ""),
        16
      );

      // Create customized swimmer sprite
      this.add
        .graphics()
        .fillStyle(primaryColor)
        .fillCircle(16, 16, 12) // head
        .fillStyle(secondaryColor)
        .fillRect(8, 28, 16, 20) // body
        .fillStyle(accentColor)
        .fillRect(6, 20, 4, 8) // left arm
        .fillRect(26, 20, 4, 8) // right arm
        .fillStyle(primaryColor)
        .fillRect(10, 48, 6, 12) // left leg
        .fillRect(16, 48, 6, 12) // right leg
        .generateTexture("swimmer", 32, 64);

      // Create different swimming poses with character colors
      this.add
        .graphics()
        .fillStyle(primaryColor)
        .fillCircle(16, 16, 12) // head
        .fillStyle(secondaryColor)
        .fillRect(8, 28, 16, 20) // body
        .fillStyle(accentColor)
        .fillRect(2, 18, 8, 4) // left arm extended
        .fillRect(22, 18, 8, 4) // right arm extended
        .fillStyle(primaryColor)
        .fillRect(12, 48, 4, 12) // legs together
        .fillRect(16, 48, 4, 12)
        .generateTexture("swimmer_dive", 32, 64);

      // Create character-themed splash particles
      this.add
        .graphics()
        .fillStyle(accentColor)
        .fillCircle(4, 4, 4)
        .generateTexture("water_particle", 8, 8);
    }

    function create(this: Phaser.Scene) {
      // Create swimmer sprite
      swimmer = this.physics.add.sprite(200, 100, "swimmer");
      swimmer.setCollideWorldBounds(false);
      swimmer.setInteractive();
      swimmer.setDrag(50);

      // Make swimmer draggable
      this.input.setDraggable(swimmer);

      swimmer.on("dragstart", (pointer: Phaser.Input.Pointer) => {
        if (!isEnabled) return;
        isDragging = true;
        dragStartPosition = { x: swimmer.x, y: swimmer.y };
        setGameState("dragging");
        (swimmer.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        (swimmer.body as Phaser.Physics.Arcade.Body).setGravityY(0);
      });

      swimmer.on(
        "drag",
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          if (!isEnabled || !isDragging) return;
          swimmer.x = dragX;
          swimmer.y = Math.max(dragY, 50); // Prevent going too high

          // Calculate launch vector preview
          const deltaX = dragX - dragStartPosition.x;
          const deltaY = Math.max(0, dragStartPosition.y - dragY) * 2; // Amplify vertical component
          launchVector = { x: deltaX * 3, y: -deltaY * 2 };

          // Determine dive style based on drag pattern
          if (Math.abs(deltaX) > 50 && deltaY > 30) {
            diveStyle = "swan_dive";
            rotationSpeed = 2;
          } else if (deltaY > 60) {
            diveStyle = "straight_dive";
            rotationSpeed = 0;
          } else if (Math.abs(deltaX) > 80) {
            diveStyle = "cannonball";
            rotationSpeed = 8;
          } else {
            diveStyle = "belly_flop";
            rotationSpeed = 1;
          }
        }
      );

      swimmer.on("dragend", (pointer: Phaser.Input.Pointer) => {
        if (!isEnabled || !isDragging) return;
        isDragging = false;
        setGameState("diving");

        // Launch the swimmer
        (swimmer.body as Phaser.Physics.Arcade.Body).setGravityY(800);
        (swimmer.body as Phaser.Physics.Arcade.Body).setVelocity(
          launchVector.x,
          launchVector.y
        );
        swimmer.setTexture("swimmer_dive");

        airTime = 0;
        maxHeight = swimmer.y;
      });

      // Handle pool collision
      const poolBounds = new Phaser.Geom.Rectangle(
        poolPosition.x - poolPosition.width / 2,
        poolPosition.y - poolPosition.height / 2,
        poolPosition.width,
        poolPosition.height
      );

      this.physics.world.on("worldbounds", () => {
        if (gameState === "diving") {
          handleSplash();
        }
      });
    }

    function update(this: Phaser.Scene, time: number, delta: number) {
      if (gameState === "diving") {
        airTime += delta;
        maxHeight = Math.min(maxHeight, swimmer.y);

        // Apply rotation during dive
        swimmer.rotation += rotationSpeed * 0.1;

        // Check if swimmer hits pool area
        const poolBounds = new Phaser.Geom.Rectangle(
          poolPosition.x - poolPosition.width / 2,
          poolPosition.y - poolPosition.height / 2,
          poolPosition.width,
          poolPosition.height
        );

        if (
          Phaser.Geom.Rectangle.Contains(poolBounds, swimmer.x, swimmer.y) &&
          swimmer.y > poolPosition.y - 50
        ) {
          handleSplash();
        }
      }
    }

    function handleSplash() {
      if (gameState !== "diving") return;

      setGameState("splashed");

      // Calculate dive score
      const diveHeight = Math.max(0, 150 - maxHeight);
      const accuracy = calculateAccuracy();
      const rotations = Math.abs(swimmer.rotation) / (Math.PI * 2);
      const angle =
        Math.abs(swimmer.rotation % (Math.PI * 2)) * (180 / Math.PI);

      let baseScore = 0;
      let styleBonusMultiplier = 1;
      let feeModifier = 1;

      // Score based on dive style
      switch (diveStyle) {
        case "swan_dive":
          baseScore = 70;
          styleBonusMultiplier = 1.3;
          feeModifier = 0.7; // 30% fee reduction
          break;
        case "straight_dive":
          baseScore = 80;
          styleBonusMultiplier = 1.2;
          feeModifier = 0.8; // 20% fee reduction
          break;
        case "cannonball":
          baseScore = 60;
          styleBonusMultiplier = 1.1;
          feeModifier = 0.9; // 10% fee reduction
          break;
        case "belly_flop":
          baseScore = 20;
          styleBonusMultiplier = 0.8;
          feeModifier = 1.2; // 20% fee increase
          break;
      }

      // Height bonus
      const heightBonus = (diveHeight / 100) * 20;

      // Accuracy bonus
      const accuracyBonus = accuracy * 15;

      // Rotation bonus/penalty
      const optimalRotations =
        diveStyle === "cannonball" ? 2 : diveStyle === "swan_dive" ? 0.5 : 0;
      const rotationScore = Math.max(
        0,
        10 - Math.abs(rotations - optimalRotations) * 5
      );

      const totalScore = Math.round(
        (baseScore + heightBonus + accuracyBonus + rotationScore) *
          styleBonusMultiplier
      );

      // Calculate final fee
      const baseFee = 1.0; // 1% base fee
      const finalFee = Math.max(0.1, baseFee * feeModifier);

      // Determine tier
      let tier: string;
      if (totalScore >= 90) tier = "Olympic Dive";
      else if (totalScore >= 80) tier = "Perfect Dive";
      else if (totalScore >= 70) tier = "Great Dive";
      else if (totalScore >= 60) tier = "Good Dive";
      else if (totalScore >= 40) tier = "Splash Dive";
      else tier = "Belly Flop";

      const result: DiveResult = {
        score: Math.min(100, totalScore),
        tier,
        feePercentage: finalFee,
        style: diveStyle,
        angle,
        rotations,
      };

      // Create splash particles
      createSplashEffect(swimmer.x, swimmer.y);

      onDive(result);

      // Reset after delay
      setTimeout(() => {
        swimmer.setPosition(200, 100);
        swimmer.setTexture("swimmer");
        swimmer.rotation = 0;
        (swimmer.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        (swimmer.body as Phaser.Physics.Arcade.Body).setGravityY(0);
        setGameState("idle");
      }, 2000);
    }

    function calculateAccuracy(): number {
      const poolCenterX = poolPosition.x;
      const poolCenterY = poolPosition.y;
      const distance = Phaser.Math.Distance.Between(
        swimmer.x,
        swimmer.y,
        poolCenterX,
        poolCenterY
      );
      const maxDistance = Math.max(poolPosition.width, poolPosition.height) / 2;
      return Math.max(0, 1 - distance / maxDistance);
    }

    function createSplashEffect(x: number, y: number) {
      // Create water particles for splash effect
      const particles = phaserGameRef.current?.scene.scenes[0].add.particles(
        x,
        y,
        "water_particle",
        {
          speed: { min: 50, max: 150 },
          scale: { start: 0.3, end: 0 },
          lifespan: 600,
          quantity: 10,
          alpha: { start: 0.8, end: 0 },
        }
      );

      setTimeout(() => {
        particles?.destroy();
      }, 1000);
    }

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [poolPosition, isEnabled, onDive]);

  return (
    <div className="relative">
      <div
        ref={gameRef}
        className="relative rounded-lg overflow-hidden border-2 border-white/20 bg-gradient-to-b from-sky-200/20 to-sky-300/10"
        style={{ filter: isEnabled ? "none" : "grayscale(100%) opacity(50%)" }}
      />

      {/* Game state indicator */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
        {gameState === "idle" && "🏊‍♂️ Ready to dive"}
        {gameState === "dragging" && "🎯 Aim your dive"}
        {gameState === "diving" && "💨 Flying through air"}
        {gameState === "splashed" && "💦 Splash!"}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-white/70 text-xs">
        <div>Drag the swimmer to aim, release to dive!</div>
        <div className="mt-1 text-white/50">
          Different drag patterns = different dive styles
        </div>
      </div>
    </div>
  );
}
