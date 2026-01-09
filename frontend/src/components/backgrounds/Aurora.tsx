import Aurora from '../layout/AuthBackground';

export default function AuroraBackground() {
    return (
        <Aurora
            colorStops={["#3A29FF", "#6C63FF", "#00E5FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
    );
}