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

function App() {
  const [wordOfTheDay,setWordOfTheDay] = useState('')
  const [attempts,setAttempts] = useState(Array(ATTEMPT_LIMIT).fill(''))
  const [attemptCounter,setAttemptCounter] = useState(0)
  const [currentWord,setCurrentWord] = useState('')
  const [error,setError] = useState('')
  const [pressed, setPressed] = useState(false)
  const [won, setWon] = useState(false)

  const submitWord = () => {
    if(!won) {
      if(attemptCounter < ATTEMPT_LIMIT) {
        if(currentWord.length === WORD_LIMIT) {
          let temp_attempts = attempts;
          temp_attempts[attemptCounter] = currentWord;
          setAttempts(temp_attempts)
          setAttemptCounter(attemptCounter+1)
          setCurrentWord('')
          setWon(currentWord === wordOfTheDay)
        }
        else {
          setError('Please put all letters\n')
        }
      }
      else {
        setError('All attempts exhausted\n')
      }
    }
    return
  }
  
  useEffect(()=> {
    let fetchWords = async () => {
      let data = await fetch(API_URL)
      let words = await data.json()
      words = await words.filter(word => word.length === WORD_LIMIT)    
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
        else {
          setError('Only 5 letter words accepted\n')
        }
      }
      if(letter==="Backspace" && currentWord.length > 0) {
        let temp_word = currentWord;
        temp_word = temp_word.slice(0, -1)
        setCurrentWord(temp_word);
      }    
      if(letter==="Enter") {
        submitWord()
      }
      setPressed('');
    }
    return
  },[pressed]);
  
  useEffect(()=> {
    setTimeout(()=>{
      setError('');
    }, 4000)
  },[error]);

  return (
    <div className="App">
      <div className="App-header">
        <h1>WORDLE</h1>
        {wordOfTheDay==='' ? 'Loading...' :
        <div>          
          {attempts.map((word, index) => word!=='' && <TableRow word={word} wordOfTheDay={wordOfTheDay} key={index} submitted={true} />)}
          {attemptCounter<ATTEMPT_LIMIT && <TableRow word={currentWord} wordOfTheDay={wordOfTheDay} submitted={false} />}
          {attemptCounter<ATTEMPT_LIMIT && Array(ATTEMPT_LIMIT - attempts.indexOf('') - 1).fill(1).map((el, index) => <TableRow word='' wordOfTheDay={wordOfTheDay} key={index} />)}
          {error && <p style={{ color: 'white', fontSize: '0.75rem' }}>{error}</p>}

          {won && <p style={{ color: 'yellow', fontSize: '0.75rem' }}>Victory!</p>}
          {!won && <p style={{ color: 'white', fontSize: '0.75rem' }}>{ATTEMPT_LIMIT - attemptCounter} attempts left</p>}
          {attemptCounter===ATTEMPT_LIMIT && !won && <p style={{ color: 'yellow', fontSize: '0.75rem' }}>Sorry, the word was {wordOfTheDay}</p>}
        </div>}
      </div>
    </div>
  );
}

export default App;
