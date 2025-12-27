import { useState } from 'react';
import { useCameraController } from '../core/useCameraController';
import { useTimelineScroll } from '../core/useTimelineScroll';
import { CAMERA_POSITIONS } from '../core/cameraState';
import { MechanicalLayer } from './MechanicalLayer';
import { ArchitectureLayer } from './ArchitectureLayer';
import { SoftwareLayer } from './SoftwareLayer';

export function SceneRoot() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const positions = [
        CAMERA_POSITIONS.mechanical,
        CAMERA_POSITIONS.architecture,
        CAMERA_POSITIONS.software
    ];

    useCameraController(positions[currentIndex]);
    useTimelineScroll(setCurrentIndex, 2);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <MechanicalLayer />
            <ArchitectureLayer />
            <SoftwareLayer />
        </>
    );
}