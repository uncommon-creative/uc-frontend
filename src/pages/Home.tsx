import { Button } from 'reactstrap';
import logo from '../logo.svg';

export const Home = () => {

  return (

        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
          </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button color="danger">Learn React</Button>
          </a>
          </header>
        </div>


  )
}