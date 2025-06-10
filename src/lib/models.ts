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
		description: "Gemini 2.5 Pro is Google’s state-of-the-art AI model designed for advanced reasoning, coding, mathematics, and scientific tasks. It employs “thinking” capabilities, enabling it to reason through responses with enhanced accuracy and nuanced context handling. Gemini 2.5 Pro achieves top-tier performance on multiple benchmarks, including first-place positioning on the LMArena leaderboard, reflecting superior human-preference alignment and complex problem-solving abilities.",
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
		description: "May 28th update to the original DeepSeek R1. Performance on par with OpenAI o1, but open-sourced and with fully open reasoning tokens. It's 671B parameters in size, with 37B active in an inference pass. Fully open-source model.",
		pricing: {
			prompt: "0.0000005",
			completion: "0.00000215",
		},
	},
	{
		id: "anthropic/claude-opus-4",
		name: "Claude Opus 4",
		provider: "Anthropic",
		description: "Claude Opus 4 is benchmarked as the world’s best coding model, bringing sustained performance on complex, long-running tasks and agent workflows. It sets new benchmarks in software engineering, achieving leading results on SWE-bench (72.5%) and Terminal-bench (43.2%).",
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
		description: "Claude Sonnet 4 significantly enhances the capabilities of its predecessor, Sonnet 3.7, excelling in both coding and reasoning tasks with improved precision and controllability. Achieving state-of-the-art performance on SWE-bench (72.7%), Sonnet 4 balances capability and computational efficiency.",
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
		description: "Gemini 2.5 Flash May 20th Checkpoint is Google's state-of-the-art workhorse model, specifically designed for advanced reasoning, coding, mathematics, and scientific tasks. It includes built-in 'thinking' capabilities.",
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
		description: "A lightweight and ultra-fast variant of Llama 3.3 70B, for use when quick response times are needed most.",
		pricing: {
			prompt: "0",
			completion: "0",
		},
	},
	{
		id: "mistralai/mistral-medium-3",
		name: "Mistral Medium 3",
		provider: "Mistral",
		description: "Mistral Medium 3 is a high-performance enterprise-grade language model designed to deliver frontier-level capabilities at significantly reduced operational cost. It balances state-of-the-art reasoning and multimodal performance with 8× lower cost.",
		pricing: {
			prompt: "0.0000004",
			completion: "0.000002",
		},
	},
	{
		id: "google/gemma-3-4b-it",
		name: "Gemma 3 4B",
		provider: "Google",
		description: "Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling.",
		pricing: {
			prompt: "0.00000002",
			completion: "0.00000004",
		},
	},
	{
		id: "google/gemma-3-12b-it",
		name: "Gemma 3 12B",
		provider: "Google",
		description: "Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling.",
		pricing: {
			prompt: "0.00000005",
			completion: "0.0000001",
		},
	},
	{
		id: "google/gemma-3-27b-it",
		name: "Gemma 3 27B",
		provider: "Google",
		description: "Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling.",
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
		description: "GPT-4o mini is OpenAI's newest model, supporting both text and image inputs with text outputs. It maintains SOTA intelligence, while being significantly more cost-effective.",
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
		description: "GPT-4o ('o' for 'omni') is OpenAI's latest AI model, supporting both text and image inputs with text outputs. It maintains the intelligence level of GPT-4 Turbo while being twice as fast and 50% more cost-effective.",
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
		description: "GPT-4.1 is a flagship large language model optimized for advanced instruction following, real-world software engineering, and long-context reasoning. It supports a 1 million token context window and outperforms GPT-4o and GPT-4.5 across coding (54.6% SWE-bench Verified), instruction compliance (87.4% IFEval), and multimodal understanding benchmarks.",
		pricing: {
			prompt: "0.000002",
			completion: "0.000008",
		},
	},
	{
		id: "openai/gpt-4.1-mini",
		name: "GPT-4.1 Mini",
		provider: "OpenAI",
		description: "GPT-4.1 Mini is a mid-sized model delivering performance competitive with GPT-4o at substantially lower latency and cost. It retains a 1 million token context window and scores 45.1% on hard instruction evals, 35.8% on MultiChallenge, and 84.1% on IFEval.",
		pricing: {
			prompt: "0.0000004",
			completion: "0.0000016",
		},
	},
	{
		id: "openai/gpt-4.1-nano",
		name: "GPT-4.1 Nano",
		provider: "OpenAI",
		description: "For tasks that demand low latency, GPT‑4.1 nano is the fastest and cheapest model in the GPT-4.1 series. It delivers exceptional performance at a small size with its 1 million token context window, and scores 80.1% on MMLU, 50.3% on GPQA, and 9.8% on Aider polyglot coding – even higher than GPT‑4o mini. It’s ideal for tasks like classification or autocompletion.",
		pricing: {
			prompt: "0.0000001",
			completion: "0.0000004",
		},
	},
	{
		id: "anthropic/claude-3.7-sonnet",
		name: "Claude 3.7 Sonnet",
		provider: "Anthropic",
		description: "Claude 3.7 Sonnet is an advanced large language model with improved reasoning, coding, and problem-solving capabilities. It introduces a hybrid reasoning approach, allowing users to choose between rapid responses and extended, step-by-step processing for complex tasks.",
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
		description: "Claude 3.5 Haiku features offers enhanced capabilities in speed, coding accuracy, and tool use. Engineered to excel in real-time applications, it delivers quick response times that are essential for dynamic tasks such as chat interactions and immediate coding suggestions.",
		pricing: {
			prompt: "0.0000008",
			completion: "0.000004",
		},
	},
	{
		id: "anthropic/claude-3-opus",
		name: "Claude 3 Opus",
		provider: "Anthropic",
		description: "Claude 3 Opus is Anthropic's most powerful model for highly complex tasks. It boasts top-level performance, intelligence, fluency, and understanding.",
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
		description: "Claude 3 Sonnet is an ideal balance of intelligence and speed for enterprise workloads. Maximum utility at a lower price, dependable, balanced for scaled deployments.",
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
		description: "Meta's latest class of model (Llama 3.1) launched with a variety of sizes & flavors. This 8B instruct-tuned version is fast and efficient. It has demonstrated strong performance compared to leading closed-source models in human evaluations.",
		pricing: {
			prompt: "0.000000019",
			completion: "0.00000003",
		},
	},
	{
		id: "meta-llama/llama-3.1-70b-instruct",
		name: "Llama 3.1 70B Instruct",
		provider: "Meta",
		description: "Meta's latest class of model (Llama 3.1) launched with a variety of sizes & flavors. This 70B instruct-tuned version is optimized for high quality dialogue usecases. It has demonstrated strong performance compared to leading closed-source models in human evaluations.",
		pricing: {
			prompt: "0.0000001",
			completion: "0.00000028",
		},
	},
	{
		id: "meta-llama/llama-3.1-405b-instruct",
		name: "Llama 3.1 405B Instruct",
		provider: "Meta",
		description: "The highly anticipated 400B class of Llama3 is here! Clocking in at 128k context with impressive eval scores, the Meta AI team continues to push the frontier of open-source LLMs. This 405B instruct-tuned version is optimized for high quality dialogue usecases.",
		pricing: {
			prompt: "0.0000008",
			completion: "0.0000008",
		},
	},
	{
		id: "mistralai/mistral-nemo",
		name: "Mistral Nemo",
		provider: "Mistral",
		description: "A 12B parameter model with a 128k token context length built by Mistral in collaboration with NVIDIA. The model is multilingual, supporting English, French, German, Spanish, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, and Hindi. It supports function calling and is released under the Apache 2.0 license.",
		pricing: {
			prompt: "0.00000001",
			completion: "0.000000028",
		},
	},
	{
		id: "mistralai/mixtral-8x22b-instruct",
		name: "Mixtral 8x22B Instruct",
		provider: "Mistral",
		description: "Mistral's official instruct fine-tuned version of Mixtral 8x22B. It uses 39B active parameters out of 141B, offering unparalleled cost efficiency for its size. Its strengths include strong math, coding, and reasoning, and a large context length (64k).",
		pricing: {
			prompt: "0.0000009",
			completion: "0.0000009",
		},
	},
	{
		id: "openrouter/auto",
		name: "Auto Router",
		provider: "OpenRouter",
		description: "Your prompt will be processed by a meta-model and routed to one of dozens of models, optimizing for the best possible output. To see which model was used, visit Activity, or read the model attribute of the response. Your response will be priced at the same rate as the routed model.",
		pricing: {
			prompt: "-1",
			completion: "-1",
		},
	},
];
