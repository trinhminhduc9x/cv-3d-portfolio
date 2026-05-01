/* eslint-disable react/prop-types */
import BaseLayer from './BaseLayer';

// TODO: Move the mechanical GLB/model module into src/scene/modules when ready.
function MechanicalLayer({ active = false }) {
    return (
        <BaseLayer active={active} rotationSpeed={0.15}>
            <group />
        </BaseLayer>
    );
}

export default MechanicalLayer;
