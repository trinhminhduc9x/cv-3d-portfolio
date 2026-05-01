/* eslint-disable react/prop-types */
import BaseLayer from './BaseLayer';

// TODO: Move the architecture GLB/model module into src/scene/modules when ready.
function ArchitectureLayer({ active = false }) {
    return (
        <BaseLayer active={active} rotationSpeed={0.15}>
            <group />
        </BaseLayer>
    );
}

export default ArchitectureLayer;
