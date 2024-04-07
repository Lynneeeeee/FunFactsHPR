import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";
// import { layui } from "layui";

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
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCatgory] = useState("All");

  useEffect(function() {
    async function getFacts(){
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if(currentCategory !== "All"){
        query = query.eq("category", currentCategory)}

      const { data: facts, error } = await query
        .order("votesInteresting", {ascending:false})
        .limit(1000);  // Will do "next page" later

      if (!error) setFacts(facts);
      else alert("There was a problem getting data")
      setIsLoading(false);;
      }
    getFacts();
  }, [currentCategory]);

  // JSX
  return (<>
  <Header showForm={showForm} setShowForm={setShowForm}/>
  {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : null}

  <main className="main">
    <CategoryFilter setCategory={setCatgory}/>
    {isLoading ? <Loader /> : <FactList facts={facts} />}
  </main>
  </>);
}

function Loader() {
  return<p className="message">Loading...</p>
}

function Header({ showForm, setShowForm }) {
  const title = "I know about HPR";
  return (
  <header className="header">
    <div className="logo">
        <img src="chat-icon.png" alt="Today fun fact logo"/>
        <h1>{title}</h1>
    </div>
    <button className="btn btn-large btn-open" onClick={()=>setShowForm((show)=> !show)}>
      {showForm ? "Close" : "Share a fact"}
    </button>
  </header>   
  );
}

// function isValidHttpUrl(string) {
//   let url;
//   try{
//     url = new URL(string);
//   } catch(_) {
//     return false;
//   }
//   return url.protocol === "http:"|| url.protocol === "https:";
// }

function NewFactForm( {setFacts, setShowForm} ) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e) {
    // 1.Prevent browser reload
    e.preventDefault();

    // 2.Check if data is valid. If so, create a new fact
    if (text && text.length<=200 && category) {
      // 3.Create a new fact object
      const newFact = {
        id: Math.round(Math.random() * 10000000000),// Will get from Supabase later
        text: text,
        source: source,
        category: category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(), // Will make sure same as Supabase representation later
      }

      // 4.Add the new fact to the UI&state
      setFacts((facts) => [newFact, ...facts]);

      // 5.Reset input fields
      setText("");
      setSource("");
      setCategory("");

      // 6. Close the form, pop up a successful window
      setShowForm(false);
      alert("Submit Successfully!");
    }
  }

  return (
  <form className="factform" onSubmit={handleSubmit}>
    <input type="text" placeholder="Share a fact about HPR..." 
    value={text}
    onChange={(e) => setText(e.target.value)}/>
    <span>{200-text.length}</span>
    
    <input type="text" placeholder="Trustworthy source..."
    value={source}
    onChange={(e) => setSource(e.target.value)}/>
    
    <select value={category}
    onChange={(e)=>setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat)=>
        <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>)}
    </select>

    <button className="btn btn-large"> Post </button>
  </form>);
}

// Sidebar category
const CATEGORIES = [
  {name: 'General', color: '#3b82f6'},
  {name: 'Business', color: '#16a34a'},
  {name: 'Dynamics', color: '#ef4444'},
  {name: 'Structures', color: '#eab308'},
  {name: 'Porpulsion', color: '#db2777'},
  {name: 'Control', color: '#14b8a6'},
  {name: 'FlightSys', color: '#f97316'},
  {name: 'Payload', color: '#8b5cf6'}
];

function CategoryFilter({fact, setCategory}) {
  return (<aside>
    <ul>
      <li className="category"><button className="btn btn-all"
      onClick={()=>setCategory("All")}>All</button></li>
      {CATEGORIES.map((cat)=>
      <li key={cat.name} className="category"><button className="btn btn-cat" 
      style={{backgroundColor: cat.color}}
      onClick={()=>setCategory(cat.name)}>
        {cat.name}</button>
      </li>)}
    </ul>
  </aside>);
}

function FactList({ facts }) {
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

    <span className="tag" style={{backgroundColor: CATEGORIES.find((cat)=> cat.name===fact.category).color}}>
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
