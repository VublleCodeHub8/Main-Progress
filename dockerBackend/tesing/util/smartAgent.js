const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY not found. Please set it in your environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

function getWeatherInfo(city) {
    return `The weather in ${city} is ${Math.floor(Math.random() * 100)} degree celsius.`;
}

function executeCommand(params){ // Changed 'command' to 'params'
    const commandToExecute = params.command; // Extract the actual command string

    if (typeof commandToExecute !== 'string') {
        console.error('[executeCommand] Error: command parameter must be a string. Received:', commandToExecute);
        return Promise.reject(new TypeError('The "command" property in parameters must be a string.'));
    }

    return new Promise((resolve, reject) => {
        exec(commandToExecute, (error, stdout, stderr) => { // Use the extracted string
            if (error) {
                console.error(`[executeCommand] Error executing: ${commandToExecute}`, error);
                reject(error);
                return; // Ensure no further processing after reject
            }
            resolve(`stdout: ${stdout}\nstderr: ${stderr}`);
        });
    });
}

async function writeToFile(params) {
    const { filePath, content } = params;

    // Enhanced validation for filePath
    if (typeof filePath !== 'string' || filePath.trim() === '') {
        const errorMsg = '[writeToFile] Error: filePath must be a non-empty string.';
        console.error(errorMsg, 'Received:', filePath);
        throw new TypeError(errorMsg); // Propagate error
    }

    // Enhanced validation for content
    if (typeof content !== 'string') {
        const errorMsg = '[writeToFile] Error: content must be a string.';
        console.error(errorMsg, 'Received type:', typeof content);
        throw new TypeError(errorMsg); // Propagate error
    }

    try {
        const dirPath = path.dirname(filePath);
        // Ensure the directory exists; fs.promises.mkdir is idempotent with recursive: true
        await fs.mkdir(dirPath, { recursive: true });

        // Write the file, explicitly using UTF-8 encoding
        await fs.writeFile(filePath, content, 'utf8');

        const successMsg = `Successfully wrote content to ${filePath}`;
        console.log(`[writeToFile] ${successMsg}`);
        return successMsg; // Return value resolves the promise in async functions
    } catch (err) {
        // Log a more contextual error message
        console.error(`[writeToFile] Error during file operation for '${filePath}': ${err.message || err}`);
        // Re-throw a new error with more context, or the original error,
        // to allow the caller to handle it.
        throw new Error(`Failed to write to file '${filePath}'. Original error: ${err.message || err}`);
    }
}

const TOOLS_MAP = {
    getWeatherInfo: getWeatherInfo, 
    executeCommand: executeCommand,
    writeToFile: writeToFile,
}
const SYSTEM_PROMPT = `
    You are an helpful AI assistant, who is designed to resolve the queries of users.
    You work on START, THINK, ACTION, OBSERVE, and OUTPUT mode.
    START: You start the process by understanding the query of the user.
    THINK: You think how to resolve the query of the user atleast 3-4 times make sure all clear.
    ACTION: If there is a need to call a tool, you call an ACTION event with tool and parameters.
    OBSERVE: If there is an action call, wait for the OBSERVE event to get the result of the action (that is output of tool).
    Based on the OBSERVE from prev step you either output or repeat the loop.
    OUTPUT: You output the final result of the process.

    RULES: 
    - Always wait for next step.
    - Always output a single step and wait for next step.
    - Output must be in JSON format.
    - Only call tools form available tools.
    - If there is no need to call a tool, you can output the final result.
    - If there is an error, you can output the error message.

    Available Tools:
    - getWeatherInfo(city: string): string
    - executeCommand(command: string): string (Executes a given command on user's device and returns the STDOUT and STDERR. Use for creating directories, listing files, etc.)
    - writeToFile(filePath: string, content: string): string (Writes the given content to the specified file path. Use for creating files like .html, .css, .js and writing their content.)

    Example:
    START: What is the weather in Bangalore?
    THINK: I need to call getWeatherInfo tool to get the weather information.
    ACTION: call tool getWeatherInfo with parameter city = "Bangalore"
    OBSERVE: 25 Degree C
    THINK: The output of tool getWeatherInfo for Banglore is 25 Degree C. Now I need to create a Todo app as requested.
    ACTION: call tool executeCommand with parameter command = "mkdir Todo"
    OBSERVE: stdout: 
stderr: 
    THINK: Todo directory created. Now I need to create index.html inside it.
    ACTION: call tool writeToFile with parameters filePath = "Todo/index.html", content = "<!DOCTYPE html><html><head><title>Todo App</title></head><body><h1>My Todo List</h1></body></html>"
    OBSERVE: Successfully wrote content to Todo/index.html
    THINK: index.html created. Now create style.css.
    ACTION: call tool writeToFile with parameters filePath = "Todo/style.css", content = "body { font-family: sans-serif; }"
    OBSERVE: Successfully wrote content to Todo/style.css
    THINK: style.css created. Now create script.js.
    ACTION: call tool writeToFile with parameters filePath = "Todo/script.js", content = "console.log('Todo app script loaded');"
    OBSERVE: Successfully wrote content to Todo/script.js
    THINK: All files for the Todo app are created with basic content.
    OUTPUT: Created a Todo folder with index.html, style.css, and script.js for your Todo app.

    Output Example:
    {"role": "user", "content": "What is the weather in Bangalore?"}
    {"step": "THINK", "content": "I need to call getWeatherInfo tool to get the weather information."}
    {"step": "ACTION", "tool": "getWeatherInfo", "parameters": {"city": "Bangalore"}, "content": "call tool getWeatherInfo with parameter city = \"Bangalore\""}
    {"step": "OBSERVE", "content": "25 Degree C"}
    {"step": "THINK", "content": "The output of tool getWeatherInfo for Banglore is 25 Degree C. Now I need to list files."}
    {"step": "ACTION", "tool": "executeCommand", "parameters": {"command": "mkdir Todo"}, "content": "call tool executeCommand with parameter command = \"mkdir Todo\""}
    {"step": "OBSERVE", "content": "stdout: \nstderr: "}
    {"step": "THINK", "content": "Todo directory created. Now I need to create index.html inside it."}
    {"step": "ACTION", "tool": "writeToFile", "parameters": {"filePath": "Todo/index.html", "content": "<!DOCTYPE html><html><head><title>Todo App</title></head><body><h1>My Todo List</h1></body></html>"}, "content": "call tool writeToFile with parameters filePath = Todo/index.html, content = <!DOCTYPE html>..."}
    {"step": "OBSERVE", "content": "Successfully wrote content to Todo/index.html"}
    {"step": "THINK", "content": "index.html created. Now create style.css."}
    {"step": "ACTION", "tool": "writeToFile", "parameters": {"filePath": "Todo/style.css", "content": "body { font-family: sans-serif; }"}, "content": "call tool writeToFile with parameters filePath = Todo/style.css, content = body { ... }"}
    {"step": "OBSERVE", "content": "Successfully wrote content to Todo/style.css"}
    {"step": "THINK", "content": "style.css created. Now create script.js."}
    {"step": "ACTION", "tool": "writeToFile", "parameters": {"filePath": "Todo/script.js", "content": "console.log('Todo app script loaded');"}, "content": "call tool writeToFile with parameters filePath = Todo/script.js, content = console.log(...)"}
    {"step": "OBSERVE", "content": "Successfully wrote content to Todo/script.js"}
    {"step": "THINK", "content": "All files for the Todo app are created with basic content."}
    {"step": "OUTPUT", "content": "Created a Todo folder with index.html, style.css, and script.js for your Todo app."}

    
    Output Format: 
    {"step": "string", "tool": "string", "parameters": "object", "content": "string"}


`;

// Main agentic conversation function using Gemini API
async function agentConversationInternal(initialUserQuery) { // Renamed and added parameter
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Removed hardcoded initialUserQuery

    // Note: SYSTEM_PROMPT and TOOLS_MAP are already defined globally in this file.
    initialUserQuery = "first go inside the user folder and then " + initialUserQuery;
    let conversationHistory = [
        {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\n\nUser Query: " + initialUserQuery }]
        }
    ];

    console.log("Starting agentic conversation with Gemini...");
    console.log("Initial Query:", initialUserQuery);

    let lastOutput = null; // To store the final output

    while (true) {
        try {
            // console.log("\nSending to Gemini, current history:", JSON.stringify(conversationHistory, null, 2)); // Uncomment for deep debugging
            const result = await model.generateContent({
                contents: conversationHistory,
                generationConfig: {
                    responseMimeType: "application/json", // Request JSON output from Gemini
                }
            });
            const response = await result.response;
            const responseText = response.text();
            // console.log("Gemini RAW Response Text:", responseText); // For debugging model's direct output

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(responseText);
                console.log("Gemini Parsed JSON Response:", parsedResponse);
            } catch (parseError) {
                console.error("Failed to parse JSON response from Gemini:", parseError);
                console.error("Non-JSON response was:", responseText);
                // Add error observation to history and let the model try to recover or inform next step
                const errorObservation = JSON.stringify({ step: 'OBSERVE', content: `Error: Model returned non-JSON response. Response: ${responseText.substring(0, 500)}...` });
                conversationHistory.push({
                    role: "model", // Model's attempt resulted in this observation
                    parts: [{ text: errorObservation }]
                });
                // If parsing fails repeatedly, it might be an unrecoverable state for this loop.
                // Consider adding a counter or specific error handling to break if it persists.
                continue; // Continue the loop to see if the model can self-correct or provide further instructions
            }

            // Add AI's valid JSON response to history for the next turn
            conversationHistory.push({
                role: "model",
                parts: [{ text: responseText }] // Store the raw JSON string as the model's turn
            });

            if (parsedResponse.step && parsedResponse.step === 'THINK') {
                console.log("THINK:", parsedResponse.content);
                // The thought is already in history, loop continues for the next model call based on this thought.
                continue;
            }
            if (parsedResponse.step && parsedResponse.step === 'ACTION') {
                console.log("ACTION:", parsedResponse.content);
                const toolName = parsedResponse.tool;
                const parameters = parsedResponse.parameters;
                let toolOutputText;
                
                if (TOOLS_MAP[toolName]) {
                    try {
                        const toolResult = await TOOLS_MAP[toolName](parameters); // Call the tool from the global TOOLS_MAP
                        console.log(`[Tool Execution] Tool '${toolName}' called. Result:`, toolResult);
                        toolOutputText = JSON.stringify({ step: 'OBSERVE', content: toolResult });
                    } catch (toolError) {
                        console.error(`[Tool Execution] Error during execution of tool '${toolName}':`, toolError);
                        toolOutputText = JSON.stringify({ step: 'OBSERVE', content: `Error executing tool '${toolName}': ${toolError.message}` });
                    }
                } else {
                    console.error(`[Tool Execution] Error: Tool '${toolName}' not found in TOOLS_MAP.`);
                    toolOutputText = JSON.stringify({ step: 'OBSERVE', content: `Error: Tool '${toolName}' not found.` });
                }
                // Add the observation from the tool execution to the history as if the model is stating the observation.
                conversationHistory.push({
                    role: "model", 
                    parts: [{ text: toolOutputText }]
                });
                continue;
            }
            if (parsedResponse.step && parsedResponse.step === 'OUTPUT') {
                console.log("OUTPUT:", parsedResponse.content);
                lastOutput = parsedResponse.content; // Store the final output
                break; // End of conversation
            }

            // Handle unrecognized step from the model
            console.warn("Unrecognized step in response from Gemini:", parsedResponse.step, "Content:", parsedResponse.content);
            const unexpectedResponseObservation = JSON.stringify({ step: 'OBSERVE', content: `Model returned an unrecognized step or structure: ${JSON.stringify(parsedResponse).substring(0,500)}...` });
            conversationHistory.push({
                role: "model",
                parts: [{ text: unexpectedResponseObservation }]
            });
            // Decide if to break or continue. For now, let's continue to see if it self-corrects.
            // If it loops without resolution, manual intervention or more sophisticated error handling is needed.
            continue;

        } catch (error) {
            console.error("Error during agent conversation loop (outer try-catch):", error);
            // Add a general error observation to history
            const errorObservation = JSON.stringify({ step: 'OBSERVE', content: `An error occurred in the conversation loop: ${error.message}` });
            conversationHistory.push({
                role: "model",
                parts: [{ text: errorObservation }]
            });
            console.error("Breaking loop due to unhandled error.");
            return { error: `Agent conversation failed: ${error.message}` }; // Return error object
        }
    }
    return lastOutput; // Return the final output
}

// Export the main function to be used as a tool using CommonJS
async function runSmartAgent(initialUserQuery) {
    if (!initialUserQuery || typeof initialUserQuery !== 'string' || initialUserQuery.trim() === '') {
        console.error('[runSmartAgent] Error: initialUserQuery must be a non-empty string.');
        return { error: 'Initial user query must be a non-empty string.' };
    }
    return await agentConversationInternal(initialUserQuery);
}

module.exports = { runSmartAgent };

// Removed direct call: agentConversation();