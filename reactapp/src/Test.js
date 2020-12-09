import React, { Component } from "react";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            text: '',
            items: []
        }
    }

    componentDidMount() {
        fetch('/api/text/', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    handleText = (event) => {
        this.setState({
            text: event.target.value
        })
    }

    handleSubmit = event => {
        console.log(this.state.text)
        const data = {input_text: this.state.text}
        fetch('/api/text/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => console.log('Success: ', data))
            .catch((error) => {
                console.error('Error: ', error)
            });
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label>text</label>
                        <input type="text"
                               value={this.state.text}
                               onChange={this.handleText}
                        />
                    </div>
                    <button type="submit">Submit</button>
                    <ul>
                        {items.map(item => (
                            <li>{item.input_text}</li>
                        ))}
                    </ul>
                </form>

            );
        }
    }
}

export default Test