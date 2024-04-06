import "./style.css"

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
  },
]

function App() {
  // JSX
  const title = "I know about HPR";
  return (<>
  {/* Header */}
  <header className="header">
    <div className="logo">
        <img src="chat-icon.png" alt="Today fun fact logo"/>
        <h1>{title}</h1>
    </div>
    <button className="btn btn-large btn-open"> Share a fact </button>
  </header> 
  <NewFactForm />

  <main className="main">
    <CategoryFilter />
    <FactList />
  </main>
  </>);
}

function NewFactForm() {
  return <form className="factform">New fact form</form>;
}
function CategoryFilter() {
  return <aside>Category filter</aside>;
}

function FactList() {
  const facts = initialFacts;
  return <section>
    <ul className="facts-list">{facts.map((fact)=><Fact key={fact.id} fact={fact}/>)}</ul>
    <p>There are {facts.length} facts in the database now.</p>
  </section>;
}

function Fact({fact}) {
  // const {factObj} = props;
  return (
  <li className="fact">
    <p className="fact-text">{fact.text}
      <a className="source" href={fact.source} target="_blank">(Source)</a>
    </p>

    <span className="tag" style={{backgroundColor: CATEGORES.find((cat)=> cat.name===fact.category).color}}>
      {fact.category}
    </span>

    <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>❌ {fact.votesFalse}</button>
    </div>
  </li>);
}
export default App;
