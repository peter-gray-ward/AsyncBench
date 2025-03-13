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
  execute(scenarioName, backend) {
    const results = {};
    const requests = (backend ? this.backends.filter(be => be.name == backend.name) : this.backends)
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
  new Backend("Java/Spring MVC", "http://localhost:9000"),
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
  const [loading, setLoading] = useState({
    all: false,
    ...(TEST_CASES.map(scenario => {
      return scenario.backends.map(backend => {
        return { [scenario.name + ':' + backend.name]: false }
      }).flat()
    }).flat())
  });
  const executeTestCase = useCallback((scenario, backend) => {
    if (backend) {
      setLoading({ [scenario.name + ':' + backend.name]: true })
    } else {
      setLoading({ all: true });
    }
    scenario.execute(scenario.name, backend).then(testResults => {
      if (backend) {
        setLoading({ [scenario.name + ':' + backend.name]: false })
        dispatch(testResults);
      } else {
        setLoading({ all: false });
        for (let backendName in testResults) {
          for (let tc of TEST_CASES) {
            if (tc.name == scenario.name) {
              for (let tcBackend of tc.backends) {
                if (backendName == tcBackend.name) {
                  tcBackend.time = testResults[backendName].time;
                }
              }
            }
          }
        }
        dispatch(TEST_CASES);
      }
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
                <ul>
                  <li><h3>Exceute {scenario.name}:</h3>
                    <button onClick={() => executeTestCase(scenario)}>all</button>
                    <div>{loading.all ? 'loading...' : ''}</div>
                  </li>
                  <li>
                    <ul>
                      {
                        scenario.backends.map((backend, index2) => <li key={index2}>
                          <button onClick={() => executeTestCase(scenario, backend)}>{backend.name}</button>
                          <div>{ loading[scenario.name + ':' + backend.name] ? 'loading...' : '' }</div>
                        </li>)
                      }
                    </ul>
                  </li>
                </ul>
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
