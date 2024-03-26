#!/usr/bin/node
const fs = require('fs');


// template for the list of things to do
const list_template = `# Plans
+ [ ] Build..
+

# Events
+ Read about...
+
`;

// template for llm prompt augmentation
const base_prompt_template = `Mission Objective: 
Discover fun and novel ideas, 
by learning game development, data science, and full-stack web development.
Ideally these excursions will be interesting enough to post on social media, 
building a following, and will help to build a portfolio.
`;


// read the journal directory path from env variable
const journal_directory =  process.env.TURBO_ADVENTURE_JOURNAL_DIRECTORY ||
                        `${process.env.HOME}/turbo_adventure/journal`;

if (!fs.existsSync(journal_directory)) {
    fs.mkdirSync(journal_directory, {recursive: true});
}


function createTemplate() { 
    
    
    // check if journal_directory/year.md exists, and if not, create it
    const date = new Date();
    const year = date.getFullYear().toString();
    const year_file_name = `${journal_directory}/${year}.md`;
    fs.openSync(year_file_name, 'a');

    // read base prompt from year.md file
    const base_prompt = fs.readFileSync(year_file_name, 'utf8');


    // check if journal_directory/year_month.md exists, and if not, create it
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const month_file_name = `${journal_directory}/${year}_${month}.md`;
    fs.openSync(month_file_name, 'a');

    // read month prompt from year_month.md file
    const month_prompt = fs.readFileSync(month_file_name, 'utf8');


    return `
    ${ base_prompt  || base_prompt_template }

    ${ month_prompt || '' }

    ${ list_template }

    `;
}

// prompt for copilot llm, to initialise each journal entry, providing better auto completions
const template = createTemplate();


function make_file_name() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${journal_directory}/${year}_${month}_${day}.md`;
}



// read the editor from env variable, defaulting to vi
const editor = process.env.TURBO_ADVENTURE_EDITOR || 'vi';

// check if the file exists already, and show a warning if it does
const file_name = make_file_name();
if (!fs.existsSync(file_name)) {
    // write the system prompt to the file
    fs.writeFileSync(file_name, template); 
}

// open today's turbo adventure in the editor
const child_process = require('child_process');
child_process.spawnSync(editor, [file_name], {stdio: 'inherit'});