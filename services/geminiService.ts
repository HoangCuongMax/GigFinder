import { GoogleGenAI, Type } from "@google/genai";
import { Job, HeatMapData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const jobSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A realistic title for a casual, on-demand gig. E.g., 'Tourism Assistant', 'Cattle Station Hand', 'Mindil Beach Market Stall Helper'."
        },
        company: {
            type: Type.STRING,
            description: "A plausible, fictional name for a local company or individual hiring for the gig. E.g., 'Kakadu Dreaming Tours', 'Outback Cattle Co.', 'Darwin Local Markets'."
        },
        location: {
            type: Type.STRING,
            description: "A plausible town or region in the Northern Territory, Australia. E.g., 'Darwin, NT', 'Alice Springs, NT', 'Kakadu National Park'."
        },
        description: {
            type: Type.STRING,
            description: "A brief, 2-3 sentence description of the job duties."
        },
        payRate: {
            type: Type.NUMBER,
            description: "A realistic pay rate for the gig in AUD. E.g., 30, 150."
        },
        payType: {
            type: Type.STRING,
            enum: ['hourly', 'flat'],
            description: "The type of pay. Must be either 'hourly' or 'flat'."
        },
    },
    required: ["title", "company", "location", "description", "payRate", "payType"]
};


const heatMapSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            location: {
                type: Type.STRING,
                description: "The name of the city or region in the Northern Territory."
            },
            demand: {
                type: Type.NUMBER,
                description: "A score from 1 (low demand) to 10 (high demand)."
            }
        },
        required: ["location", "demand"]
    }
};

export const generateRandomJob = async (): Promise<Job> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a single, realistic job listing for a casual or gig worker based in Australia's Northern Territory. The job should be something that can be done in a day or a few hours and relevant to the region. Provide details according to the provided schema.",
            config: {
                responseMimeType: "application/json",
                responseSchema: jobSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const jobData = JSON.parse(jsonText);

        if (typeof jobData.title !== 'string' || typeof jobData.payRate !== 'number') {
            throw new Error('Received malformed job data from API.');
        }
        
        jobData.id = `${Date.now()}-${jobData.title.replace(/\s/g, '-')}`;

        return jobData as Job;

    } catch (error) {
        console.error("Error generating job from Gemini API:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

export const generateHeatMapData = async (): Promise<HeatMapData[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a JSON array of job demand data for these specific locations in Australia's Northern Territory: Darwin, Katherine, Kakadu, Arnhem Land, Alice Springs, Tennant Creek. Each object must have a 'location' string matching one of these names exactly, and a 'demand' score from 1 (low) to 10 (high).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: heatMapSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const heatMapData = JSON.parse(jsonText);
        
        if (!Array.isArray(heatMapData)) {
             throw new Error('Received malformed heat map data from API.');
        }

        return heatMapData as HeatMapData[];

    } catch (error) {
        console.error("Error generating heat map data from Gemini API:", error);
        throw new Error("Failed to generate heat map data.");
    }
};