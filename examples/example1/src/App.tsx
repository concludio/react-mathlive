import React from 'react';
import { MathFieldComponent } from 'react-mathlive';

interface State {
  latex: string;
}

class App extends React.Component<{}, State> {
  public state: State = { latex: "\\frac{1}{x}" };

  public render() {
    return (
      <div>
        MathField:
        <MathFieldComponent
          latex={this.state.latex}
          onChange={this.onLatexChange}
        />
        <br/>
        TextField:
        <input 
          type="text"
          value={this.state.latex}
          onChange={ev => this.onLatexChange(ev.target.value)}
        />
      </div>
    );
  }

  private readonly onLatexChange = (latex: string) => this.setState({ latex });
}

export default App;
