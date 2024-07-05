import web3 from './web3';

const address = '0x32f9E5843Fe7C2e539BbA240b70BbcDD6979e0B7';

const abi = [
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
	},
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
	}
];

const history = new web3.eth.Contract(abi, address);

export default history;
