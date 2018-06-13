const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// Data sources
const events = require('./data/events');
const people = require('./data/events');
const teams = require('./data/events');
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
		type: EntityType
		name: String
	}

	type Query {
		entities: [ Entity ]
		count: Int
	}

	type Team implements Entity {
		id: Int
		type: EntityType
		name: String
		fullTimeMembers: [ Person ]
		interns: [ Person ]
		teamLead: Person
		office: Location
	}

	type Event implements Entity {
		id: Int
		type: EntityType
		name: String
		description: String
		location: Location
		team: Team
	}

	type Person implements Entity {
		id: Int
		type: EntityType
		name: String
		age: Int
	}

	type Location implements Entity {
		id: Int
		type: EntityType
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

// Root resolver
const root = {
	message: () => 'Hello World!'
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));