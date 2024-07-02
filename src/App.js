import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, {Component} from 'react';
import voting from './voting';
import web3 from './web3';

class App extends Component {
    state = {
        balance: '',
        currentAccount: '',
        manager: '',
        message: '',
        proposalID: '',
        proposals: [],
        remainingVotes: 0,
        value: ''
    };

    async componentDidMount() {
        try {
            let manager = await voting.methods.manager().call();
            manager = manager.toLowerCase();
            const proposals = await voting.methods.getProposals().call();
            const balance = await web3.eth.getBalance(voting.options.address);
            this.setState({message: '', manager, proposals, balance});
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const currentAccount = accounts[0];
                const voter = await voting.methods.getVoter().call({
                    from: currentAccount
                });
                this.setState({message: '', currentAccount, remainingVotes: Number(voter.remainingVotes)});
            } catch (error) {
                this.setState({message: 'Metamask has not connected yet'});
            }
        } catch (error) {
            this.setState({message: 'Metamask is not installed'});
        }
        if (!this.eventListenersSet) {
            this.setupEventListeners();
            this.eventListenersSet = true;
        }
    }

    setupEventListeners() {
        window.ethereum.on('accountsChanged', async (accounts) => {
            const currentAccount = accounts[0];
            const voter = await voting.methods.getVoter().call({
                from: currentAccount
            });
            this.setState({currentAccount, remainingVotes: Number(voter.remainingVotes)});
        });

        // voting.events.PlayerEntered().on('data', async (data) => {
        //   console.log(data.returnValues.player);
        //   const players = await voting.methods.getPlayers().call();
        //   const balance = await web3.eth.getBalance(voting.options.address);
        //   this.setState({ players, balance });
        // });

        // voting.events.WinnerPicked().on('data', async (data) => {
        //   console.log(data.returnValues.winner);
        //   const players = await voting.methods.getPlayers().call();
        //   const balance = await web3.eth.getBalance(voting.options.address);
        //   const lastWinner = data.returnValues.winner;
        //   this.setState({ lastWinner, players, balance });
        // });
    }

    handleVote = async (proposalID): Promise<any> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.vote(Number(proposalID)).send({
            from: this.state.currentAccount,
            value: web3.utils.toWei('0.01', 'ether')
        });
        const voter = await voting.methods.getVoter().call({
            from: this.state.currentAccount
        });
        const balance = await web3.eth.getBalance(voting.options.address);
        this.setState({message: 'Your vote inserted', balance, remainingVotes: Number(voter.remainingVotes)});
    };

    onClick = async () => {
        this.setState({message: 'Waiting on transaction success...'});

        await voting.methods.pickWinner().send({
            from: this.state.currentAccount
        });

        this.setState({message: 'A winner has been picked!'});
    };

    isManager = (): boolean => {
        return this.state.manager === this.state.currentAccount;
    };

    render() {
        return (
            <div className='contract-container'>
                <h1 className='title'>Scrum voting DApp</h1>

                <div className='proposals'>
                    {this.state.proposals.map(proposal => (
                        <div className='proposal'>
                            <h3>{proposal.title}</h3>
                            <img src={proposal.imageURL} alt={proposal.title}/>
                            {!this.isManager() && (<button onClick={() => this.handleVote(proposal.id)} type="button"
                                                           className="btn btn-primary">Vote</button>)}
                        </div>
                    ))}
                </div>

                <button type="button" className="btn btn-primary">History</button>

                <button type="button" className="btn btn-primary">Declare Winner</button>

                <button type="button" className="btn btn-primary">Withdraw</button>

                <button type="button" className="btn btn-primary">Reset</button>

                <button type="button" className="btn btn-primary">Change Owner</button>

                <button type="button" className="btn btn-primary">Destroy</button>

                <h4>Connected wallet address: {this.state.currentAccount}</h4>

                <h4>Contract manager: {this.state.manager}</h4>

                <h4>Balance: {parseFloat(web3.utils.fromWei(this.state.balance, 'ether')).toFixed(4)} ether</h4>

                {!this.isManager() && (<h4>Remaining votes: {this.state.remainingVotes}</h4>)}

                {/* <p>
          This contract is managed by {this.state.manager}. There are currently{' '}
          {this.state.proposals.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck? Connected wallet address: {this.state.currentAccount}</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
        {this.state.lastWinner &&
          <h3>Last Winner Address: {this.state.lastWinner}</h3>
        } */}
            </div>
        );
    }
}

export default App;
