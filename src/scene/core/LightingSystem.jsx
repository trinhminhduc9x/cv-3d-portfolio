/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
function LightingSystem({ shadowMapSize = 2048 }) {
    return (
        <>
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight
                position={[12, 15, 8]}
                intensity={1.5}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={shadowMapSize}
                shadow-mapSize-height={shadowMapSize}
            />
            <hemisphereLight skyColor="#87ceeb" groundColor="#2a2a2a" intensity={0.4} />
        </>
    );
}

export default LightingSystem;
