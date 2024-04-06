const CATEGORES = [
    {name: 'General', color: '#3b82f6'},
    {name: 'Business', color: '#16a34a'},
    {name: 'Dynamics', color: '#ef4444'},
    {name: 'Structures', color: '#eab308'},
    {name: 'Porpulsion', color: '#db2777'},
    {name: 'Control', color: '#14b8a6'},
    {name: 'FlightSys', color: '#f97316'},
    {name: 'Payload', color: '#8b5cf6'}
];
const initialFacts = [
    {
        id: 1,
        text: 'Zenith is the name of our rocket for SAC2025',
        source: 'https://zenith.com/',
        category: 'General',
        votesInteresting: 24,
        votesMindblowing: 9,
        votesFalse: 4,
        createdIn: 2021,
    },
    {
        id: 2,
        text: 'We currently have 3 Alex in HPR',
        source: 'https://teams.com/',
        category: 'Dynamics',
        votesInteresting: 11,
        votesMindblowing: 2,
        votesFalse: 0,
        createdIn: 2019,
    },
    {
        id: 3,
        text: 'Aether aims to 30,000 ft',
        source: 'https://www.monashhpr.com/',
        category: 'Structures',
        votesInteresting: 8,
        votesMindblowing: 3,
        votesFalse: 1,
        createdIn: 2015,
    }
]

// Select DOM elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".factform");
const factsList = document.querySelector(".facts-list")


// Create DOM elements: Render facts in list
factsList.innerHTML = "";

// Load data from Supabase
loadFacts();
async function loadFacts() {
    const res = await fetch("https://fdbfrpptpijxaarzcizt.supabase.co/rest/v1/facts", {
        headers: {
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYmZycHB0cGlqeGFhcnpjaXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNjk2NTIsImV4cCI6MjAyNzg0NTY1Mn0.TCdX4fdgemcu7Cicl2kuORublnM01t4YyrtldIZYrFs",
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYmZycHB0cGlqeGFhcnpjaXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNjk2NTIsImV4cCI6MjAyNzg0NTY1Mn0.TCdX4fdgemcu7Cicl2kuORublnM01t4YyrtldIZYrFs",
        }
    });
    const data = await res.json();
    // const filteredData = data.filter((fact)=>fact.category==="General");
    // console.log(filteredData);
    createFactsList(data);
}

function createFactsList(dataArray) {
    // factsList.insertAdjacentHTML("afterbegin","<li>HI</li>");
    // const htmlArr = initialFacts.map(
    //     (fact)=> factsList.insertAdjacentHTML("afterbegin",
    //     `<li class="fact">${fact.text}</li>`)
    // );
    const htmlArr = dataArray.map((fact)=>
    `<li class="fact">
        <p class="fact-text">
            ${fact.text}
            <a class="source" href=${fact.source} target="_blank">(Source)</a>
        </p>
        <span class="tag" style="background-color: 
            ${CATEGORES.find((cat)=> cat.name===fact.category).color};">
            ${fact.category}</span>`
    );

    const html = htmlArr.join("");
    factsList.insertAdjacentHTML("afterbegin", html);
}


// Toggle form visibility
btn.addEventListener("click", function(){
    if(form.classList.contains("hidden")){
        form.classList.remove("hidden");
        form.classList.add("open");
        btn.textContent = "CLOSE";
    } else {
        form.classList.remove("open");
        form.classList.add("hidden");
        btn.textContent = "SHARE A FACT";
    }
});