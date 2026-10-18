---
title: "Mobile Robotics Hackathon: sorting waste with a robot arm"
summary: "Two days at CeTI, TU Dresden, to make a robot arm pick up paper cups, plastic bottles and glass bottles and put each one where it belongs. Everything rests on a calibration between camera and robot, done with AprilTags. We won first place."
description: "A hackathon write-up: camera-to-robot calibration with AprilTags from 20 poses, grasping with ROS 2 and MoveIt, sorting objects by their height, and the computer vision part that did not make it into the demo."
metaTitle: "Mobile Robotics Hackathon: Sorting Waste with a Robot Arm | Maximilian Köhlenbeck"
metaDescription: "A technical write-up of a robot arm that sorts paper cups, plastic bottles and glass bottles: AprilTag calibration from 20 poses, ROS 2 and MoveIt, and object classification by height."
lang: en
published: 2026-10-18
stack: [ROS 2, MoveIt, Python, AprilTag, Claude Code]
architecture:
  - label: Calibration
    nodes: [20 robot poses, One camera image each, AprilTag detection, Camera-to-robot transform]
  - label: Sorting
    nodes: [Object in camera view, Position in robot coordinates, Object type from height, Grasp with MoveIt, Bin or crate]
metrics:
  - label: Result
    value: "1st place"
    highlight: "1st place"
  - label: Calibration
    value: "20 robot poses, one AprilTag image per pose"
  - label: Objects
    value: "paper cups and plastic bottles into bins, glass bottles into a crate"
---

## What we had to build

The Mobile Robotics Hackathon took place in October 2026 at CeTI, the Centre for Tactile Internet with Human-in-the-Loop. CeTI is a Cluster of Excellence at TU Dresden. It felt less like a classic hackathon and more like a hands-on workshop. There was no fixed task. Instead there were paths you could pick, and I ended up in the motion path.

Our goal: a robot arm that sorts waste. Paper cups and plastic bottles go into the matching bin. Glass bottles go back into a crate, each into its own slot.

## Architecture

The stack was ROS 2 with MoveIt, written in Python, with Claude Code for writing the code.

The pipeline has two parts. Calibration runs once and gives us a transformation matrix from camera coordinates to robot coordinates. Sorting then runs per object: the camera sees an object, the matrix turns its position into a target the arm can reach, and the height of the object tells us what it is. MoveIt plans the grasp and the move to the bin or the crate.

## Calibration

Everything else depends on this step. If the transform between camera and robot is off, the gripper closes next to the cup.

We used AprilTags. The robot moved to 20 different poses, the camera took one image at each pose, and from those 20 pairs of robot pose and detected tag we computed the transformation matrix. We started with the motion planning and moved on to the calibration from there.

## Timeline

- **Day one:** motion planning, calibration and the transformation matrix. When most people left in the evening, the arm could grip a cup but not yet put it into a bin.
- **Day one, evening:** I kept going on my own until midnight. By the time the university closed, the arm picked up cups and bottles and dropped each into the right bin.
- **Day two:** a few small problems at the start, fixed quickly. Then glass bottles back into the crate at their positions.
- **End of day two:** I built the presentation and we pitched the result.

## Recognizing objects by height

We knew in advance which objects would be on the table: paper cups, plastic bottles and glass bottles. They differ clearly in height. So the demo classifies an object by its height instead of by its appearance. That is simple, but it is enough for a known set of objects, and it was the version we could make reliable in time.

## What failed

A separate computer vision pipeline with 6D pose estimation and machine learning worked on its own. We did not manage to connect it to the grasping in time, so the demo ran with the height-based detection. With a fixed set of objects that was fine. With unknown objects it would not be.

## What I learned

- **Only build what you can finish.** The computer vision part was good work that never reached the demo, because time ran out. Time was shorter at the end than we planned, again.
- **Calibration first.** Grasping, sorting and the crate positions all rest on one matrix. Getting it right early made the rest fast.
- **Pitch without reading.** The presentation was the part that almost cost us the win. Next time I present freely, without reading anything off the slides.
- **You can get far in a domain you only know from the surface.** I knew robotics from the outside. With a clear goal and AI-assisted coding, two days were enough for a working arm.
