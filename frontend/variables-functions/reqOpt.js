/** @format */
const bruh = 'b7caca7f36fdb2bbc42998b31c4c93833994fe39';
const authorizationHeader = 'Bearer ' + bruh;
export const reqOpt = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		Authorization: authorizationHeader,
	},
};
