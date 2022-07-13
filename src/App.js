import React, { useEffect, useState } from "react"
import './App.css';
const API_URL = "https://random-word-api.herokuapp.com/all";
const WORD_LIMIT = 5;
const ATTEMPT_LIMIT = 6;

const TableRow = ({ word, wordOfTheDay, submitted }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      {Array(WORD_LIMIT).fill(1).map((el, index) => <div style={{ display: 'inline-block', border: '1px solid black', marginLeft: '5px', marginRight: '5px', height: '30px', width: '30px', background: !submitted ? 'lightgray' : word.charAt(index)=== wordOfTheDay.charAt(index) ? 'green' : wordOfTheDay.includes(word.charAt(index)) ? 'yellow' : 'lightgray' }} key={index}>
        <p style={{ textTransform: 'uppercase', margin: 0, textAlign: 'center', color: word.charAt(index) ? 'black' : 'lightgray', fontSize:"1rem", fontWeight: 700, marginTop: '5px' }}>{word.charAt(index) ? word.charAt(index) : '-'}</p>
      </div>)}
    </div>
  )
}

const Keyboard = ({ attempts, attemptCounter, wordOfTheDay, typed }) => {
  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['Enter','z','x','c','v','b','n','m','Backspace']
  ]
  let called = []
  attemptCounter > 0 && attempts.map((attempt, index) => index < attemptCounter && attempt.split('').map((key) => !called.includes(key) && called.push(key)))
  return (
    rows.map((keys,index) => <div key={index} style={{ paddingBottom: '3px', display: 'block'}}>
      {keys.map((key, i) => <div style={{ padding: '2.5px', display: 'inline-block', border: '1px solid black', borderRadius:'5px', marginLeft: '2.5px', marginRight: '2.5px', height: '32px', width: key.length > 1 ? 'initial' : '30px', background: wordOfTheDay.includes(key) && called.includes(key) ?  'azure' : called.includes(key) ? '#222' : 'slategray', color: wordOfTheDay.includes(key) && called.includes(key) ? 'black' : 'white', cursor: 'pointer'}} key={i} onClick={()=>typed(key)}>
        <p style={{ textTransform: key.length > 1 ? 'initial' : 'uppercase', margin: 0, textAlign: 'center', fontSize:"1rem", marginTop: '5px' }}>{key}</p>
      </div>)}
    </div>)
  )
}

function App() {
  const [words,setWords] = useState([''])
  const [wordOfTheDay,setWordOfTheDay] = useState('')
  const [attempts,setAttempts] = useState(Array(ATTEMPT_LIMIT).fill(''))
  const [attemptCounter,setAttemptCounter] = useState(0)
  const [currentWord,setCurrentWord] = useState('')
  const [error,setError] = useState('')
  const [pressed, setPressed] = useState(false)
  const [won, setWon] = useState(false)
  
  useEffect(()=> {
    let fetchWords = async () => {
      let data = await fetch(API_URL)
      let words = await data.json()
      words = await words.filter(word => word.length === WORD_LIMIT)
      setWords(words)    
      setWordOfTheDay(words[Math.round(Math.random() * (words.length))])
    };
    fetchWords();
    document.addEventListener('keydown', (e) => setPressed(e.key));
  },[]);
  
  useEffect(()=> {
    if(!won) {
      const letter = pressed
      if(/^[a-zA-Z]{1}$/.test(letter)) {
        if(currentWord.length < WORD_LIMIT) {
          let temp_word = currentWord;
          temp_word = temp_word + letter
          setCurrentWord(temp_word);
        }
      }
      if(letter==="Backspace" && currentWord.length > 0) {
        let temp_word = currentWord;
        temp_word = temp_word.slice(0, -1)
        setCurrentWord(temp_word);
      }    
      if(letter==="Enter") {
        if(!won) {
          if(attemptCounter < ATTEMPT_LIMIT) {
            if(currentWord.length === WORD_LIMIT) {
              if(!words.includes(currentWord)) {
                setError('Not in word list\n')
              }
              else {
                let temp_attempts = attempts;
                temp_attempts[attemptCounter] = currentWord;
                setAttempts(temp_attempts)
                setAttemptCounter(attemptCounter+1)
                setCurrentWord('')
                setWon(currentWord === wordOfTheDay)
              }
            }
            else {
              setError('Please put all letters\n')
            }
          }
          else {
            setError('All attempts exhausted\n')
          }
        }
      }
      setPressed('');
    }
    return
  },[pressed, currentWord, won, attemptCounter, attempts, wordOfTheDay]);
  
  useEffect(()=> {
    setTimeout(()=>{
      setError('');
    }, 3000)
  },[error]);

  return (
    <div className="App">
      <div className="App-header">
        <h1>WORDLE</h1>
        {wordOfTheDay==='' ? 'Loading...' :
        <div>          
          {error && <div style={{ position: 'fixed', top: '30px', left: 0, right: 0 }}><p style={{ display: 'inline-block', color: 'black', background: 'white', fontSize: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '0.75rem' }}>{error}</p></div>}
          {won && <p style={{ color: 'yellow', fontSize: '0.75rem' }}>Victory!</p>}
          {!won && <p style={{ color: 'white', fontSize: '0.75rem' }}>{ATTEMPT_LIMIT - attemptCounter} attempts left</p>}
          {attemptCounter===ATTEMPT_LIMIT && !won && <p style={{ color: 'yellow', fontSize: '0.75rem' }}>Sorry, the word was {wordOfTheDay}</p>}

          {attempts.map((word, index) => word!=='' && <TableRow word={word} wordOfTheDay={wordOfTheDay} key={index} submitted={true} />)}
          {attemptCounter<ATTEMPT_LIMIT && <TableRow word={currentWord} wordOfTheDay={wordOfTheDay} submitted={false} />}
          {attemptCounter<ATTEMPT_LIMIT && Array(ATTEMPT_LIMIT - attempts.indexOf('') - 1).fill(1).map((el, index) => <TableRow word='' wordOfTheDay={wordOfTheDay} key={index} />)}<br/>
          <Keyboard attempts={attempts} attemptCounter={attemptCounter} wordOfTheDay={wordOfTheDay} typed={(key)=>setPressed(key)} />
          <p style={{ color: 'white', fontSize: '0.75rem' }}>By Shivam Soni</p>
        </div>}
      </div>
    </div>
  );
}

export default App;
