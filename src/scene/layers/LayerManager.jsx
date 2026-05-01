/* eslint-disable react/prop-types, react/no-unknown-property */
import ArchitectureLayer from './ArchitectureLayer';
import MechanicalLayer from './MechanicalLayer';
import SoftwareLayer from './SoftwareLayer';
import LazyLayerMount from '../performance/LazyLayerMount';
import { LAYER_DATA } from './layerData';

const LAYER_COMPONENTS = {
    mechanical: MechanicalLayer,
    architecture: ArchitectureLayer,
    software: SoftwareLayer,
};

function LayerManager({ activeLayerId, layers = LAYER_DATA, unloadDelay = 1000 }) {
    return (
        <>
            {layers.map((layer) => {
                const LayerComponent = LAYER_COMPONENTS[layer.component];

                if (!LayerComponent) {
                    return null;
                }

                return (
                    <group key={layer.id} position={layer.position}>
                        <LazyLayerMount active={layer.id === activeLayerId} unloadDelay={unloadDelay}>
                            <LayerComponent active={layer.id === activeLayerId} layer={layer} />
                        </LazyLayerMount>
                    </group>
                );
            })}
        </>
    );
}

export default LayerManager;
