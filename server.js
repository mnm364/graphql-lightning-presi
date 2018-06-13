const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// Data sources
const events = require('./data/events');
// const people = require('./data/people');
const teams = require('./data/teams');
const locations = require('./data/locations')

// GraphQL schema
const schema = buildSchema(`
	enum EntityType {
		TEAM
		EVENT
		PERSON
		LOCATION
	}

	interface Entity {
		id: Int
		type: String
		name: String
	}

	type Query {
		entities: [ Person ]
		count: Int
	}

	type Team implements Entity {
		id: Int
		type: String
		name: String
		fullTimeMembers: [ Person ]
		interns: [ Person ]
		teamLead: Person
		office: Location
	}

	type Event implements Entity {
		id: Int
		type: String
		name: String
		description: String
		location: Location
		team: Team
	}

	type Person implements Entity {
		id: Int
		type: String
		name: String
		age: Int
	}

	type Location implements Entity {
		id: Int
		type: String
		name: String
		address: LocationAddress
	}

	type LocationAddress {
		line1: String
		line2: String
		city: String
		state: String
		postalCode: String
	}
`);

const people = [
	{
		"id": 200,
		"name": "Michael Miller",
		"age": 23
	},
	{
		"id": 201,
		"name": "Sean Egan",
		"age": 21
	},
	{
		"id": 202,
		"name": "Peter Rimshnick",
		"age": 35
	},
	{
		"id": 203,
		"name": "Oscar Li",
		"age": 25
	},
	{
		"id": 204,
		"name": "Alex Politis",
		"age": 27
	},
	{
		"id": 205,
		"name": "Yi Liu",
		"age": 29 // idk
	},
	{
		"id": 206,
		"name": "Sharang Chakraborty",
		"age": 23
	},
	{
		"id": 207,
		"name": "Diana Chang",
		"age": 21
	},
	{
		"id": 208,
		"name": "Naomi Levin",
		"age": 28 // idk
	},
	{
		"id": 209,
		"name": "Matthew Spencer",
		"age": 29 // idk
	}
];

const renderedPeople = people.map(p => {
	p.type = "PERSON";
	return p;
});

// Root resolver
const root = {
	entities: () => renderedPeople,
	count: () => 2
};


// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));