import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// 🎯 VISUAL EXAMPLE 1: useEffect Patterns
const UseEffectDemo = () => {
	const [count, setCount] = useState(0);
	const [name, setName] = useState('');
	const [logs, setLogs] = useState([]);

	// Add log function
	const addLog = (message) => {
		setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
	};

	// 🟢 Pattern 1: Run after EVERY render (no dependency array)
	/*
	useEffect(() => {
		addLog('🔄 Effect 1: Runs after EVERY render');
	});*/

	// 🟡 Pattern 2: Run ONCE on mount (empty dependency array)
	useEffect(() => {
		addLog('🚀 Effect 2: Runs ONCE on mount');
		
		// Cleanup function (runs when component unmounts)
		return () => {
			console.log('🧹 Cleanup: Component unmounting');
		};
	}, []); // Empty array = runs once

	// 🔵 Pattern 3: Run when dependencies change
	useEffect(() => {
		if (count > 0) { // Only log after initial render
			addLog(`📊 Effect 3: Count changed to ${count}`);
		}
	}, [count]); // Runs when count changes

	useEffect(() => {
		if (name) { // Only log when name has value
			addLog(`📝 Effect 4: Name changed to "${name}"`);
		}
	}, [name]); // Runs when name changes

	return (
		<div style={{ border: '2px solid blue', padding: '20px', margin: '10px' }}>
			<h2>🎯 useEffect Visual Demo</h2>
			
			{/* Controls */}
			<div style={{ marginBottom: '20px' }}>
				<button onClick={() => setCount(c => c + 1)}>
					Count: {count} (Click to increment)
				</button>
				<br /><br />
				<input 
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Type your name..."
					style={{ padding: '5px' }}
				/>
				<br /><br />
				<button onClick={() => setLogs([])}>
					🗑️ Clear Logs
				</button>
			</div>

			{/* Live Log Display */}
			<div style={{ 
				backgroundColor: '#f0f0f0', 
				padding: '10px', 
				maxHeight: '200px', 
				overflowY: 'auto',
				fontFamily: 'monospace',
				fontSize: '12px'
			}}>
				<strong>📋 Live Effect Logs:</strong>
				{logs.map((log, index) => (
					<div key={index}>{log}</div>
				))}
				{logs.length === 0 && <div style={{ color: '#888' }}>No logs yet...</div>}
			</div>
		</div>
	);
};

// 🎯 VISUAL EXAMPLE 2: Timer with Cleanup
const TimerDemo = () => {
	const [inputSeconds, setInputSeconds] = useState('')
	const [seconds, setSeconds] = useState(0);
	const [flagTime, setFlagTime] = useState(false);
	const [flagLogs, setFlagLogs] = useState('');
	const [logs, setLogs] = useState([]);
	const [startTime, setStartTime] = useState('');
	const [finishTime, setFinishTime] = useState(0);
	const [logsCounts, setLogsCount] = useState(0)
	const [showLogs, setShowLogs] = useState(true)

	useEffect(() => {
		let interval = null;

		if (!(seconds > 0))
			setFlagTime(false);
		if (flagTime) {
			setFlagLogs('on');
			interval = setInterval(() => {
				setSeconds(seconds => seconds - 1);
			},1000)
		}
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		}
	}, [flagTime])

	useEffect(() => {
		if (!(seconds  > 0))
		{
			if (flagLogs === 'on') {
				setFlagLogs('off');
			}
			setFlagTime(false)
		}

	}, [seconds])

	useEffect(() => {
		if (flagLogs === 'off') {
			setLogsCount((logsCounts) => logsCounts + 1)
			setLogs((logs) => [...logs, {index: Date.now() , message: `(${logsCounts}) start time: ${startTime} finish time: ${finishTime} - it took you ${startTime - finishTime}`}])
			setStartTime('')
			setFinishTime(0)
		}
	}, [flagLogs])

	const resetClock = () => {
		setFinishTime(seconds)
		setSeconds(0);
		setFlagTime(false)
	}

	const getTime = (e) => {
		const time = e.target.value;

		// Allow empty input OR numbers that don't start with 0
		if (time === '' || /^[1-9]\d*$/.test(time)) {
			setStartTime(time)
			setInputSeconds(time)
		}
	}

	const deleteLog = (i) => {
		setLogs(logs.filter(log => log.index !== i))
	}
	
	return (
		<div style={{ border: '2px solid green', padding: '20px', margin: '10px' }}>
			<h2>⏰ Timer Demo (with Cleanup)</h2>
			<input value={inputSeconds} onChange={getTime}  placeholder='enter time'></input>
			<button onClick={() => {setSeconds(Number(inputSeconds) || 0); setInputSeconds('')}}>Add time</button>
			<div style={{ fontSize: '24px', margin: '20px 0' }}>
				⏱️ {seconds} seconds
			</div>
			
			<button onClick={() => setFlagTime(!flagTime)}>
				{flagTime ? '⏸️ Pause' : '▶️ Start'}
			</button>
			<button onClick={resetClock} style={{ marginLeft: '10px' }}>
				🔄 Reset
			</button>
			<br/><br/>
			<button onClick={() => setShowLogs(!showLogs)}>
				{showLogs ? 'Hide Logs' : 'Show Logs'}
			</button>
			{showLogs && <div>
				{
					logs.map((log) => (
						<div key={log.index} style={{ 
							display: 'flex', 
							justifyContent: 'space-between', 
							alignItems: 'center',
							marginBottom: '5px',
							padding: '5px',
							border: '1px solid #ccc'
						}}>
							<span>{log.message}</span>
							<button onClick={() => deleteLog(log.index)}>🗑️</button>
						</div>
					))
				}
				{logs.length === 0 && <div>No logs yet...</div>}
			</div>
			}
			
			<div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
				Open browser console to see cleanup messages!
			</div>
		</div>
	);
};


// 🎯 VISUAL EXAMPLE 3: Local Storage Persistence
const LocalStorageDemo = () => {
	const [savedValue, setSavedValue] = useState('');

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('demoValue');
		if (saved) {
			setSavedValue(saved);
			console.log('📥 Loaded from localStorage:', saved);
		}
	}, []); // Run once on mount

	// Save to localStorage whenever value changes
	useEffect(() => {
		if (savedValue) {
			localStorage.setItem('demoValue', savedValue);
			console.log('💾 Saved to localStorage:', savedValue);
		}
	}, [savedValue]); // Run when savedValue changes

	return (
		<div style={{ border: '2px solid purple', padding: '20px', margin: '10px' }}>
			<h2>💾 Local Storage Demo</h2>
			
			<input 
				value={savedValue}
				onChange={(e) => setSavedValue(e.target.value)}
				placeholder="Type something..."
				style={{ padding: '5px', width: '200px' }}
			/>
			
			<div style={{ marginTop: '10px', fontSize: '14px' }}>
				✨ This value persists even after page refresh!
			</div>
			
			<button 
				onClick={() => {
					localStorage.removeItem('demoValue');
					setSavedValue('');
				}}
				style={{ marginTop: '10px' }}
			>
				🗑️ Clear Storage
			</button>
		</div>
	);
};

const TodoList = () => {

	const [valueInput, setValueInput] = useState('');
	const [todo, setTodo] = useState([])
	const [count, setCount] = useState(0);
	const [bool, setBool] = useState(false)

	const changeMe = (e) => {
		const value = e.target.value;

		if (/^[\d-]*$/.test(value)) {
			setValueInput(value);
	}
}

const addTodo = () => {
	if (valueInput.trim()) {
		setTodo(todo => [...todo, {id: Date.now(), text: valueInput, done: false}])
		setValueInput('')
		console.log("setting todo", valueInput)
	}
}

const modifyLine = (id) => {
	setTodo(prevtodo => prevtodo.map(todo => 
		todo.id === id ? {...todo, done: !todo.done} : todo)
	)
}

const deleteTodo = (id) => {
	setTodo(todo.filter(todo => todo.id != id))
}


useEffect(() => {
	valueInput === "2323" || "4242" ? setBool(true) : setBool(false)
	setCount((count) => count + 1)
	console.log("todo: ", todo)
}, [todo, valueInput])

useEffect(() => {
	valueInput === "2323" ? setBool(true) : setBool(false)
}, [])


	return (
		<div className='todoList'>
			<p onClick={() => setCount((count) => count + 1)}> The count is: {count}</p>
			<p onClick={() => setBool((bool) => !bool)}> The bool is: {bool ? 'true' : 'false'}</p>
			<input
				value={valueInput}
				onChange={changeMe}
				placeholder='enter some...'
			/>
			<button onClick={addTodo}>
				+ add Todo
			</button>
			<ul>
				{
					todo.map(todo => (
						<li key={todo.id}>
							<span onClick={() => modifyLine(todo.id)}
								style={{
									textDecoration: todo.done ? 'line-through' : 'none',
									color: 'red'
								}}>
								{todo.text}
							</span>
							<button onClick={() => deleteTodo(todo.id)}>Delete TODO</button>
						</li>
					))
				}
			</ul>
		</div>
	)
}

const Email = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,  // Keep existing properties
      [field]: value // Update only the specified field
    }));
  };
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => handleInputChange('age', Number(e.target.value))}
        placeholder="Age"
      />
      <div>
        <h3>User Info:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
    </div>
  );
}



function App() {
  const [count, setCount] = useState(0)
  const [showDemos, setShowDemos] = useState(true);

  return (
    <>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => setShowDemos(!showDemos)} style={{ marginLeft: '10px' }}>
          {showDemos ? '🙈 Hide' : '👁️ Show'} Demos
        </button>
      </div>

      {showDemos && (
        <div>
          <UseEffectDemo />
          <TimerDemo />
          <LocalStorageDemo />
        </div>
      )}
      
      <div>
        <TodoList/>
      </div>
      
      <p className="read-the-docs">
        🧪 Experiment with the demos above to see useEffect in action!
      </p>
    </>
  )
}

export default App