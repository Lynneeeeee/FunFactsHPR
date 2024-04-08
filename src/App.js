import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";
// import { layui } from "layui";


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
    {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts}/>}
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
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(e) {
    // 1.Prevent browser reload
    e.preventDefault();

    // 2.Check if data is valid. If so, create a new fact
    if (text && text.length<=200 && category) {
      // 3.Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 10000000000),// Will get from Supabase later
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(), // Will make sure same as Supabase representation later
      // }
      // 3.Upload fact to Supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{text, source, category}])
        .select();
      setIsUploading(false);

      // 4.Add the new fact to the UI and state
      if(!error) setFacts((facts) => [newFact[0], ...facts]);
      else alert("There was a problem loading new fact to UI")
      

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
    value={text} disabled={isUploading}
    onChange={(e) => setText(e.target.value)}/>
    <span>{200-text.length}</span>
    
    <input type="text" placeholder="Trustworthy source..."
    value={source} disabled={isUploading}
    onChange={(e) => setSource(e.target.value)}/>
    
    <select value={category} disabled={isUploading}
    onChange={(e)=>setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat)=>
        <option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>)}
    </select>

    <button className="btn btn-large" disabled={isUploading}> Post </button>
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

function FactList({ facts, setFacts }) {
  if(facts.length === 0)
    return (<p className="message">
            No facts for this section yet 😭 Add your first fact!
            </p>);
  return <section>
    <ul className="facts-list">{facts.map((fact)=>
      <Fact key={fact.id} fact={fact} setFacts={setFacts}/>)}</ul>
    <p>There are {facts.length} facts in the database now.</p>
  </section>;
}

function Fact({fact, setFacts}) {
  const [isUpdatingVotes, setIsUpdatingVotes] = useState(false);
  const isDisputed = 
    fact.votesInteresting + fact.votesMindblowing
    < fact.votesFalse;

  async function handleVotes(columnName) {
    setIsUpdatingVotes(true);
    const { data: updatedFact, error } = await supabase
    .from("facts")
    .update({ [columnName]: fact[columnName] + 1 })
    .eq("id", fact.id)
    .select()
    setIsUpdatingVotes(false);

    if(!error) setFacts((facts) => facts.map((el) => 
      el.id === fact.id ? updatedFact[0] : el));
      // else alert("There was a problem updating votes")
  }

  return (
  <li className="fact">
    <p className="fact-text">
      {isDisputed ? <span className="disputed">[❗️DISPUTED]</span> : null}
      {fact.text}
      <a className="source" href={fact.source} target="_blank">(Source)</a>
    </p>

    <span className="tag" style={{backgroundColor: CATEGORIES.find((cat)=> cat.name===fact.category).color}}>
      {fact.category}
    </span>

    <div className="vote-buttons">
        <button onClick={() => handleVotes("votesInteresting")} disabled={isUpdatingVotes}>
          👍 {fact.votesInteresting}</button>
        <button onClick={() => handleVotes("votesMindblowing")} disabled={isUpdatingVotes}>
          🤯 {fact.votesMindblowing}</button>
        <button onClick={() => handleVotes("votesFalse")} disabled={isUpdatingVotes}>
          ❌ {fact.votesFalse}</button>
    </div>
  </li>);
}
export default App;
