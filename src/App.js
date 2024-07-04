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
        newManager: '',
        proposalID: '',
        proposals: [],
        remainingVotes: 0,
        stage: -1
    };

    async componentDidMount() {
        try {
            let manager = await voting.methods.manager().call();
            manager = manager.toLowerCase();
            let stage = await voting.methods.stage().call();
            stage = Number(stage);
            const proposals = await voting.methods.getProposals().call();
            const balance = await web3.eth.getBalance(voting.options.address);
            this.setState({
                balance,
                manager,
                message: '',
                proposals,
                stage
            });
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const currentAccount = accounts[0];
                const voter = await voting.methods.getVoter().call({
                    from: currentAccount
                });
                this.setState({
                    currentAccount,
                    message: '',
                    remainingVotes: Number(voter.remainingVotes)
                });
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

    changeOwner = async (): Promise<void> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.changeOwner(this.state.newManager).send({
            from: this.state.currentAccount
        });
        this.setState({message: 'Changed owner successfully.'});
    };

    declareWinner = async (): Promise<void> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.declareWinner().send({
            from: this.state.currentAccount
        });
        this.setState({message: 'Declare winner done successfully.'});
    };

    destroyContract = async (): Promise<void> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.destroyContract().send({
            from: this.state.currentAccount
        });
        this.setState({message: 'Contract has been destroyed!'});
    };

    getWinners = async (): Promise<void> => {
        const winners = await voting.methods.getWinners().call();
        console.log(winners)
    };

    isManager = (): boolean => {
        return this.state.manager === this.state.currentAccount;
    };

    isStage = (stage: number): boolean => {
        return this.state.stage === stage;
    };

    reset = async (): Promise<void> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.reset().send({
            from: this.state.currentAccount
        });
        this.setState({message: 'Reset done successfully.'});
    };

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

    vote = async (proposalID): Promise<any> => {
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

    withdraw = async (): Promise<void> => {
        this.setState({message: 'Waiting on transaction success...'});
        await voting.methods.withdraw().send({
            from: this.state.currentAccount
        });
        this.setState({message: 'Withdraw done successfully.'});
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
                            <h5>Votes: {Number(proposal.votes)}</h5>
                            {!this.isManager() && this.state.remainingVotes > 0 && this.isStage(0) &&
                                (<button className="btn btn-primary"
                                         onClick={(): Promise<any> => this.vote(proposal.id)}
                                         type="button">Vote</button>)}
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary"
                        onClick={(): Promise<void> => this.getWinners()}
                        type="button">
                    History
                </button>

                {this.isManager() && this.isStage(0) &&
                    (<button className="btn btn-primary"
                             onClick={(): Promise<void> => this.declareWinner()}
                             type="button">
                        Declare Winner
                    </button>)}

                {this.isManager() && (<button className="btn btn-primary"
                                              onClick={(): Promise<void> => this.withdraw()}
                                              type="button">Withdraw</button>)}

                {this.isManager() && this.isStage(1) &&
                    (<button className="btn btn-primary"
                             onClick={(): Promise<void> => this.reset()}
                             type="button">
                        Reset
                    </button>)}

                {this.isManager() && this.isStage(1) &&
                    (<div>
                        <input onChange={event => this.setState({newManager: event.target.value})}
                               value={this.state.newManager}/>
                        <button className="btn btn-primary"
                                onClick={(): Promise<void> => this.changeOwner()}
                                type="button">Change Owner
                        </button>
                    </div>)
                }

                {this.isManager() && (<button className="btn btn-primary"
                                              onClick={(): Promise<void> => this.destroyContract()}
                                              type="button">Destroy</button>)}

                <h4>Connected wallet address: {this.state.currentAccount}</h4>

                <h4>Contract manager: {this.state.manager}</h4>

                <h4>Balance: {parseFloat(web3.utils.fromWei(this.state.balance, 'ether')).toFixed(4)} ether</h4>

                {!this.isManager() && (<h4>Remaining votes: {this.state.remainingVotes}</h4>)}
            </div>
        );
    }
}

export default App;
