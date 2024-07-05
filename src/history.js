import web3 from './web3';

const address = '0xd434345d1240E669B1CfB73bc02FF10f6A307Ab7';

const abi = [
	{
		"inputs": [
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
		"name": "insertWinner",
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
				"internalType": "struct History.Winner[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const history = new web3.eth.Contract(abi, address);

export default history;
