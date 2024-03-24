#!/usr/bin/node
const fs = require('fs');

// prompt for copilot llm, to initialise each journal entry, providing better auto completions
const system_prompt = `Mission Objective: 
Discover fun and novel ideas, 
by learning game development, data science, and full-stack web development.
Ideally these excursions will be interesting enough to post on social media, 
building a following, and will help to build a portfolio.


# Plans
+ [ ] Build..
+

# Events
+ Read about...
+

`;


function make_file_name() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${journal_directory}/${year}_${month}_${day}.md`;
}

// read the journal directory path from env variable
const journal_directory =  process.env.TURBO_ADVENTURE_JOURNAL_DIRECTORY ||
                        `${process.env.HOME}/turbo_adventure/journal`;

if (!fs.existsSync(journal_directory)) {
    fs.mkdirSync(journal_directory, {recursive: true});
}

// read the editor from env variable, defaulting to vi
const editor = process.env.TURBO_ADVENTURE_EDITOR || 'vi';

// check if the file exists already, and show a warning if it does
const file_name = make_file_name();
if (fs.existsSync(file_name)) {
    console.log(`Warning: ${file_name} already exists, you silly ;P`);
} else {
    // write the system prompt to the file
    fs.writeFileSync(file_name, system_prompt); 
}

// open today's turbo adventure in the editor
const child_process = require('child_process');
child_process.spawnSync(editor, [file_name], {stdio: 'inherit'});