export type ModelInfo = {
	id: string;
	name: string;
	provider: string;
	description: string;
	pricing: {
		prompt: string;
		completion: string;
		image?: string;
	};
};


export const popularModels: ModelInfo[] = [
	{
		id: "google/gemini-2.5-pro-preview",
		name: "Gemini 2.5 Pro Preview 06-05",
		provider: "Google",
		description: "Advanced reasoning, coding, math, science.",
		pricing: {
			prompt: "0.00000125",
			completion: "0.00001",
			image: "0.00516",
		},
	},
	{
		id: "deepseek/deepseek-r1-0528",
		name: "R1 0528",
		provider: "DeepSeek",
		description: "Open-source, 671B parameters, 37B active.",
		pricing: {
			prompt: "0.0000005",
			completion: "0.00000215",
		},
	},
	{
		id: "anthropic/claude-opus-4",
		name: "Claude Opus 4",
		provider: "Anthropic",
		description: "World's best coding model.",
		pricing: {
			prompt: "0.000015",
			completion: "0.000075",
			image: "0.024",
		},
	},
	{
		id: "anthropic/claude-sonnet-4",
		name: "Claude Sonnet 4",
		provider: "Anthropic",
		description: "Enhanced coding and reasoning tasks.",
		pricing: {
			prompt: "0.000003",
			completion: "0.000015",
			image: "0.0048",
		},
	},
	{
		id: "google/gemini-2.5-flash-preview-05-20",
		name: "Gemini 2.5 Flash Preview 05-20",
		provider: "Google",
		description: "Workhorse for reasoning, coding, math.",
		pricing: {
			prompt: "0.00000015",
			completion: "0.0000006",
			image: "0.0006192",
		},
	},
	{
		id: "meta-llama/llama-3.3-8b-instruct:free",
		name: "Llama 3.3 8B Instruct (free)",
		provider: "Meta",
		description: "Lightweight, ultra-fast, quick responses.",
		pricing: {
			prompt: "0",
			completion: "0",
		},
	},
	{
		id: "mistralai/mistral-medium-3",
		name: "Mistral Medium 3",
		provider: "Mistral",
		description: "High-performance, cost-effective enterprise model.",
		pricing: {
			prompt: "0.0000004",
			completion: "0.000002",
		},
	},
	{
		id: "google/gemma-3-4b-it",
		name: "Gemma 3 4B",
		provider: "Google",
		description: "Multimodal, 128k context, 140+ languages.",
		pricing: {
			prompt: "0.00000002",
			completion: "0.00000004",
		},
	},
	{
		id: "google/gemma-3-12b-it",
		name: "Gemma 3 12B",
		provider: "Google",
		description: "Multimodal, 128k context, 140+ languages.",
		pricing: {
			prompt: "0.00000005",
			completion: "0.0000001",
		},
	},
	{
		id: "google/gemma-3-27b-it",
		name: "Gemma 3 27B",
		provider: "Google",
		description: "Multimodal, 128k context, 140+ languages.",
		pricing: {
			prompt: "0.0000001",
			completion: "0.0000002",
			image: "0.0000256",
		},
	},
	{
		id: "openai/gpt-4o-mini",
		name: "GPT-4o-mini",
		provider: "OpenAI",
		description: "Text/image input, cost-effective intelligence.",
		pricing: {
			prompt: "0.00000015",
			completion: "0.0000006",
			image: "0.000217",
		},
	},
	{
		id: "openai/gpt-4o",
		name: "GPT-4o",
		provider: "OpenAI",
		description: "Text/image input, fast, cost-effective.",
		pricing: {
			prompt: "0.0000025",
			completion: "0.00001",
			image: "0.003613",
		},
	},
	{
		id: "openai/gpt-4.1",
		name: "GPT-4.1",
		provider: "OpenAI",
		description: "Flagship for coding, reasoning, long-context.",
		pricing: {
			prompt: "0.000002",
			completion: "0.000008",
		},
	},
	{
		id: "openai/gpt-4.1-mini",
		name: "GPT-4.1 Mini",
		provider: "OpenAI",
		description: "Mid-sized, low latency, cost-effective.",
		pricing: {
			prompt: "0.0000004",
			completion: "0.0000016",
		},
	},
	{
		id: "openai/gpt-4.1-nano",
		name: "GPT-4.1 Nano",
		provider: "OpenAI",
		description: "Fastest, cheapest, 1M token context.",
		pricing: {
			prompt: "0.0000001",
			completion: "0.0000004",
		},
	},
	{
		id: "anthropic/claude-3.7-sonnet",
		name: "Claude 3.7 Sonnet",
		provider: "Anthropic",
		description: "Improved reasoning, coding, problem-solving.",
		pricing: {
			prompt: "0.000003",
			completion: "0.000015",
			image: "0.0048",
		},
	},
	{
		id: "anthropic/claude-3.5-haiku",
		name: "Claude 3.5 Haiku",
		provider: "Anthropic",
		description: "Enhanced speed, coding, tool use.",
		pricing: {
			prompt: "0.0000008",
			completion: "0.000004",
		},
	},
	{
		id: "anthropic/claude-3-opus",
		name: "Claude 3 Opus",
		provider: "Anthropic",
		description: "Most powerful for complex tasks.",
		pricing: {
			prompt: "0.000015",
			completion: "0.000075",
			image: "0.024",
		},
	},
	{
		id: "anthropic/claude-3-sonnet",
		name: "Claude 3 Sonnet",
		provider: "Anthropic",
		description: "Balance of intelligence and speed.",
		pricing: {
			prompt: "0.000003",
			completion: "0.000015",
			image: "0.0048",
		},
	},
	{
		id: "meta-llama/llama-3.1-8b-instruct",
		name: "Llama 3.1 8B Instruct",
		provider: "Meta",
		description: "Fast, efficient, strong performance.",
		pricing: {
			prompt: "0.000000019",
			completion: "0.00000003",
		},
	},
	{
		id: "meta-llama/llama-3.1-70b-instruct",
		name: "Llama 3.1 70B Instruct",
		provider: "Meta",
		description: "Optimized for high-quality dialogue.",
		pricing: {
			prompt: "0.0000001",
			completion: "0.00000028",
		},
	},
	{
		id: "meta-llama/llama-3.1-405b-instruct",
		name: "Llama 3.1 405B Instruct",
		provider: "Meta",
		description: "128k context, impressive eval scores.",
		pricing: {
			prompt: "0.0000008",
			completion: "0.0000008",
		},
	},
	{
		id: "mistralai/mistral-nemo",
		name: "Mistral Nemo",
		provider: "Mistral",
		description: "Multilingual, 128k context, function calling.",
		pricing: {
			prompt: "0.00000001",
			completion: "0.000000028",
		},
	},
	{
		id: "mistralai/mixtral-8x22b-instruct",
		name: "Mixtral 8x22B Instruct",
		provider: "Mistral",
		description: "Cost-efficient, strong math, coding, reasoning.",
		pricing: {
			prompt: "0.0000009",
			completion: "0.0000009",
		},
	},
	{
		id: "openrouter/auto",
		name: "Auto Router",
		provider: "OpenRouter",
		description: "Routes to best possible model.",
		pricing: {
			prompt: "-1",
			completion: "-1",
		},
	},
	{
		id: "openai/o3",
		name: "o3",
		provider: "OpenAI",
		description: "Powerful, excels in STEM, visual reasoning.",
		pricing: {
			prompt: "0.00001",
			completion: "0.00004",
			image: "0.00765",
		},
	},
	{
		id: "openai/o3-mini-high",
		name: "o3 Mini High",
		provider: "OpenAI",
		description: "Cost-efficient, STEM reasoning, high effort.",
		pricing: {
			prompt: "0.0000011",
			completion: "0.0000044",
		},
	},
	{
		id: "openai/o3-mini",
		name: "o3 Mini",
		provider: "OpenAI",
		description: "Cost-efficient, STEM reasoning, adjustable effort.",
		pricing: {
			prompt: "0.0000011",
			completion: "0.0000044",
		},
	},
];
