import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, {Component} from 'react';
import history from './history';
import voting from './voting';
import web3 from './web3';

class App extends Component {
    state = {
        balance: '',
        currentAccount: '',
        manager: '',
        message: '',
        messageClass: '',
        newManager: '',
        proposalID: '',
        proposals: [],
        remainingVotes: 0,
        stage: -1,
        winners: []
    };

    async componentDidMount(): Promise<void> {
        try {
            await this.getManager();
            await this.getStage();
            const proposals = await voting.methods.getProposals().call();
            const balance = await web3.eth.getBalance(voting.options.address);
            this.setState({
                balance,
                message: '',
                proposals
            });
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const currentAccount = accounts[0];
                this.setState({
                    currentAccount,
                    message: ''
                });
                await this.getVoter();
            } catch (error) {
                this.showMessage('Metamask has not connected yet', 'danger');
            }
        } catch (error) {
            this.showMessage('Metamask is not installed', 'danger');
        }
        if (!this.eventListenersSet) {
            this.setupEventListeners();
            this.eventListenersSet = true;
        }
    }

    changeOwner = async (): Promise<void> => {
        try {
            this.showInfoMessage();
            await voting.methods.changeOwner(this.state.newManager).send({
                from: this.state.currentAccount
            });
            this.showSuccessMessage('Owner has changed successfully!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    declareWinner = async (): Promise<void> => {
        try {
            this.showInfoMessage();
            await voting.methods.declareWinner().send({
                from: this.state.currentAccount
            });
            this.showSuccessMessage('Winner declaration completed successfully!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    destroyContract = async (): Promise<void> => {
        try {
            this.showInfoMessage();
            await voting.methods.destroyContract().send({
                from: this.state.currentAccount
            });
            this.showSuccessMessage('Contract has been destroyed!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    getManager = async (): Promise<void> => {
        const manager = await voting.methods.manager().call();
        this.setState({manager: manager.toLowerCase()});
    };

    getStage = async (): Promise<void> => {
        const stage = await voting.methods.stage().call();
        this.setState({stage: Number(stage)});
    };

    getVoter = async (): Promise<void> => {
        const voter = await voting.methods.getVoter().call({
            from: this.state.currentAccount
        });
        this.setState({remainingVotes: Number(voter.remainingVotes)});
    };

    getWinners = async (): Promise<void> => {
        const winners = await history.methods.getWinners().call();
        this.setState({winners});
    };

    isManager = (): boolean => {
        return this.state.manager === this.state.currentAccount;
    };

    isStage = (stage: number): boolean => {
        return this.state.stage === stage;
    };

    reset = async (): Promise<void> => {
        try {
            this.showInfoMessage();
            await voting.methods.reset().send({
                from: this.state.currentAccount
            });
            this.showSuccessMessage('Reset has completed successfully!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    setupEventListeners(): void {
        window.ethereum.on('accountsChanged', async (accounts): Promise<void> => {
            const currentAccount = accounts[0];
            this.setState({currentAccount});
            await this.getVoter();
        });

        voting.events.ContractWithdrawed().on('data', async (data): Promise<void> => {
            const balance = await web3.eth.getBalance(voting.options.address);
            this.setState({balance});
        });

        voting.events.ContractReseted().on('data', async (data): Promise<void> => {
            const proposals = await voting.methods.getProposals().call();
            await this.getStage();
            await this.getVoter();
            this.setState({proposals});
        });

        voting.events.OwnerChanged().on('data', async (data): Promise<void> => {
            await this.getManager();
        });

        voting.events.VoteInserted().on('data', async (data): Promise<void> => {
            const proposals = await voting.methods.getProposals().call();
            const balance = await web3.eth.getBalance(voting.options.address);
            this.setState({balance, proposals});
        });

        voting.events.WinnerDeclared().on('data', async (data): Promise<void> => {
            await this.getStage();
        });
    }

    showErrorMessage(): void {
        this.showMessage('An error has occurred.', 'danger');
    }

    showInfoMessage(): void {
        this.showMessage('Waiting on transaction success...', 'primary');
    }

    showMessage(message: string, messageClass: string): void {
        this.setState({
            message,
            messageClass
        });
    }

    showSuccessMessage(message: string): void {
        this.showMessage(message, 'success');
    }

    vote = async (proposalID): Promise<any> => {
        try {
            this.showInfoMessage();
            await voting.methods.vote(Number(proposalID)).send({
                from: this.state.currentAccount,
                value: web3.utils.toWei('0.01', 'ether')
            });
            await this.getVoter();
            this.showSuccessMessage('Your vote has inserted successfully!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    withdraw = async (): Promise<void> => {
        try {
            this.showInfoMessage();
            await voting.methods.withdraw().send({
                from: this.state.currentAccount
            });
            this.showSuccessMessage('Withdraw done successfully!');
        } catch (error) {
            this.showErrorMessage();
        }
    };

    render() {
        return (
            <div className='contract-container'>
                <h1 className='title'>Scrum voting DApp</h1>

                <div className={'alert alert-' + this.state.messageClass} role='alert'>
                    {this.state.message}
                </div>

                <div className='proposals'>
                    {this.state.proposals.map(proposal => (
                        <div className='proposal'>
                            <h3>{proposal.title}</h3>
                            <img src={proposal.imageURL} alt={proposal.title}/>
                            <h5>Votes: {Number(proposal.votes)}</h5>
                            {!this.isManager() && this.state.remainingVotes > 0 && this.isStage(0) &&
                                (<button className='btn btn-primary'
                                         onClick={(): Promise<any> => this.vote(proposal.id)}
                                         type='button'>Vote</button>)}
                        </div>
                    ))}
                </div>

                <div className='action-buttons'>
                    {this.isManager() && this.isStage(0) &&
                        (<button className='btn btn-primary'
                                 onClick={(): Promise<void> => this.declareWinner()}
                                 type='button'>
                            Declare Winner
                        </button>)}

                    {this.isManager() && (<button className='btn btn-primary'
                                                  onClick={(): Promise<void> => this.withdraw()}
                                                  type='button'>Withdraw</button>)}

                    {this.isManager() && this.isStage(1) &&
                        (<button className='btn btn-primary'
                                 onClick={(): Promise<void> => this.reset()}
                                 type='button'>
                            Reset
                        </button>)}

                    {this.isManager() && this.isStage(1) &&
                        (<div>
                            <input onChange={event => this.setState({newManager: event.target.value})}
                                   value={this.state.newManager}/>
                            <button className='btn btn-primary'
                                    onClick={(): Promise<void> => this.changeOwner()}
                                    type='button'>
                                Change Owner
                            </button>
                        </div>)
                    }

                    {this.isManager() && (<button className='btn btn-primary'
                                                  onClick={(): Promise<void> => this.destroyContract()}
                                                  type='button'>Destroy</button>)}
                </div>

                <h4>Connected wallet address: {this.state.currentAccount}</h4>

                <h4>Contract manager: {this.state.manager}</h4>

                <h4>Balance: {parseFloat(web3.utils.fromWei(this.state.balance, 'ether')).toFixed(4)} ether</h4>

                {!this.isManager() && (<h4>Remaining votes: {this.state.remainingVotes}</h4>)}

                <button className='btn btn-primary'
                        onClick={(): Promise<void> => this.getWinners()}
                        type='button'>
                    History
                </button>

                <ul className='list-group'>
                    {this.state.winners.map(winner => (
                        <li className='list-group-item'>
                            <b>Voting</b>: {Number(winner.votingID)}, <b>Proposal</b>: {winner.proposal}, <b>Votes</b>: {Number(winner.votes)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default App;
