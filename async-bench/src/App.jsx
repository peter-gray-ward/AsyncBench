import React, { useReducer, useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const SCENARIOS = {
  "REST API: GET for Large Dataset": function(url) {
    return new Promise(resolve => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url + "/all-posts");
      xhr.addEventListener("load", function() {
        console.log("--- request loaded", this.response)
        resolve(JSON.parse(this.response));
      });
      xhr.send();
    });
  }
}

class Scenario {
  constructor(name, backends) {
    this.name = name;
    this.backends = backends;
  }
  execute(scenarioName) {
    console.log('Executing', scenarioName);
    const results = {};
    const requests = this.backends
      .filter(b => b.url !== '')
      .map(backend => {
        results[backend.name] = {
          time: new Date().getTime(),
          backendName: backend.name,
          scenarioName
        };
        
        return SCENARIOS[this.name](backend.url).then(resolution => {
          results[backend.name].time = new Date().getTime() - results[backend.name].time;
        });
      });

    return Promise.all(requests).then(() => results);
  }

}

class Backend {
  time = 0;
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
  execute(promise) {
    let time = new Date().getTime();
    promise
  }
}

const BackendFactory = () => [
  new Backend("Java/Spring MVC", ""),
  new Backend("Java/Spring Web Flux", ""),
  new Backend("Go/Gin", "http://localhost:8080"),
  new Backend("C#/.NET", "http://localhost:5188"),
  new Backend("Python/FastAPI", "http://localhost:8000"),
];

const tests = Object.keys(SCENARIOS);
const TEST_CASES = tests.map(name => new Scenario(name, BackendFactory()));

function TestReducer(state, testResults) {
  let reducedState = state.map(testcase => {
    for (let backendName in testResults) {
      for (let backend of testcase.backends) {
        if (backend.name == backendName) {
          backend.time = testResults[backendName].time;
        }
      }
    }
    return testcase;
  });
  return reducedState
}

function BenchmarkTable() {
  const [state, dispatch] = useReducer(TestReducer, TEST_CASES);
  const [loading, setLoading] = useState(false);
  const executeTestCase = useCallback((scenario) => {
    setLoading(true);
    scenario.execute(scenario.name).then(testResults => {
      dispatch(testResults);
      setLoading(false);
    });
  });
  return <>
    <table>
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Backends</th>
        </tr>
      </thead>
      <tbody>
        {
          TEST_CASES.map((scenario, index) =>
            <tr key={index}>
              <td>
                <button onClick={() => executeTestCase(scenario)}>{scenario.name}</button>
                <div>{loading ? 'loading...' : ''}</div>
              </td>
              <td>
                <ul>
                  {
                    scenario.backends.map((backend, index2) => <li key={index2}>
                      <strong>{backend.name}</strong> ({backend.time})
                    </li>)
                  }
                </ul>
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  </>;
}

function App() {
  return (
    <>
      <BenchmarkTable />
    </>
  )
}

export default App
