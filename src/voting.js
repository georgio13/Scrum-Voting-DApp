import web3 from './web3';

const address = '0x2Ca40bAfE346213Ed3d508318c7f4e537Fc05A58';

const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newManager",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "declareWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroyContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalID",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "proposal",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votingID",
						"type": "uint256"
					}
				],
				"indexed": false,
				"internalType": "struct Voting.Winner[]",
				"name": "winners",
				"type": "tuple[]"
			}
		],
		"name": "votingCompleted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProposals",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "imageURL",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Proposal[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVoter",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "id",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "remainingVotes",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Voter",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWinners",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "proposal",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votingID",
						"type": "uint256"
					}
				],
				"internalType": "struct Voting.Winner[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "imageURL",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stage",
		"outputs": [
			{
				"internalType": "enum Voting.Stage",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winners",
		"outputs": [
			{
				"internalType": "string",
				"name": "proposal",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votingID",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const voting = new web3.eth.Contract(abi, address);

export default voting;
