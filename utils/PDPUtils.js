export const getProductDetails = (product) => {
    // Helper to filter out items with no description to keep the UI clean
    const formatDetail = (title, desc) => (desc ? { title, desc } : null);

    const leftDetails = [
        formatDetail("Finish", product?.finish),
        formatDetail("Aroma", product?.aroma),
        formatDetail("Variety", product?.variety),
        formatDetail("Body", product?.body),
    ].filter(Boolean);

    const rightDetails = [
        formatDetail("Roast Level", product?.roast),
        formatDetail("Brewing", product?.brewing),
        formatDetail("Altitude", product?.altitude),
        formatDetail("Process", product?.process),
    ].filter(Boolean);

    return {
        leftDetails,
        rightDetails,
    };
};

const filter = [
    {
        title: "Ratio",
        value: "1:15"
    },
    {
        title: "Grind Size",
        value: "Medium-fine (21–28 clicks MK4 / 14–18 C2)"
    },
    {
        title: "Coffee Age",
        value: "14–17 days, ideally"
    },
    {
        title: "Water",
        value: "255ml @ 90°C – 93°C"
    },
    {
        title: "Target Time",
        value: "2.5 – 3 minutes"
    },
]

const espresso = [
    {
        title: "Dose",
        value: "18 to 20 grams"
    },
    {
        title: "Yield",
        value: "32 to 36 grams"
    },
    {
        title: "Time",
        value: "22 to 26 seconds"
    },
    {
        title: "Ratio",
        value: "1:18"
    },
    {
        title: "Temperature",
        value: "90°C – 93°C"
    }
];

const milk = [
    {
        title: "Dose",
        value: "18 to 20 grams"
    },
    {
        title: "Yield",
        value: "27 to 30 grams"
    },
    {
        title: "Time",
        value: "20 to 24 seconds"
    },
    {
        title: "Ratio",
        value: "1:15"
    },
    {
        title: "Temperature",
        value: "90°C – 93°C"
    }
];

export const CraftingComponentData = (brewingGuide) => {
    if (!brewingGuide) return null;

    const dataMap = { espresso, filter, milk };
    const result = {};

    Object.keys(brewingGuide).forEach((key) => {
        if (brewingGuide[key] === true && dataMap[key]) {
            result[key] = dataMap[key];
        }
    });

    return result;
};
