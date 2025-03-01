import { useState, useEffect } from "react";
import axios from "axios";
import ReactGA from "react-ga4";

ReactGA.initialize("YOUR_GOOGLE_ANALYTICS_ID");

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const generateImage = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post("https://your-backend-url.com/generate-image/", { prompt });
            setImageUrl(res.data.output);
            ReactGA.event({ category: "AI", action: "Generated Image", label: prompt });
        } catch {
            alert("Failed to generate image.");
        }
        setLoading(false);
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "generated_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`min-h-screen flex flex-col items-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <button onClick={() => setDarkMode(!darkMode)} className="absolute top-5 right-5 p-2 bg-gray-800 text-white rounded">
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <h1 className="text-4xl font-bold">AI Image Generator</h1>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a prompt..."
                className="p-3 border rounded w-96 my-4 text-black" />
            <button onClick={generateImage} className="p-3 bg-blue-600 text-white rounded">
                {loading ? "Generating..." : "Generate"}
            </button>
            {imageUrl && (
                <>
                    <img src={imageUrl} alt="Generated" className="w-96 mt-4 rounded" />
                    <button onClick={downloadImage} className="p-2 bg-green-500 text-white rounded mt-2">
                        📥 Download Image
                    </button>
                </>
            )}
        </div>
    );
}

