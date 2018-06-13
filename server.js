const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// Data sources
const events = [
	{
		"id": 100,
		"name": "Dinner @ 11 Madison",
		"description": "Pete treats his team to Eleven Madison Park",
		"locationId": 400,
		"teamId": 300
	}
];

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
	},
	{
		"id": 209,
		"name": "Matthew Spencer",
	}
];

const teams =[
	{
		"id": 300,
		"name": "apollo",
		"fullTimeMemberIds": [
			200,
			202,
			203,
			204,
			205,
			206,
			208,
			209
		],
		"internIds": [
			201,
			207
		],
		"teamLeadId": 202,
		"officeLocationId": 401
	}
];

const locations = [
	{
		"id": 400,
		"name": "Eleven Madison ParK",
		"address": {
			"line1": "11 Madison Ave",
			"city": "New York City",
			"state": "NY",
			"postalCode": "10010"
		}
	},
	{
		"id": 401,
		"name": "Yext NYC",
		"address": {
			"line1": "1 Madison Ave",
			"line2": "Floor 5",
			"city": "New York City",
			"state": "NY",
			"postalCode": "10010"
		}
	}
];

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
		entities(id: Int, name: String, type: EntityType): [ Entity ]
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

const renderPerson = person => {
	person.type = "PERSON";
	person['__typename'] = "Person";
	return person;
};

const renderLocation = location => {
	location.type = "LOCATION";
	location['__typename'] = "Location";
	return location;
};

const renderTeam = team => {
	var renderedTeam = {};
	renderedTeam.id = team.id;
	renderedTeam.name = team.name;
	renderedTeam.fullTimeMembers = team.fullTimeMemberIds
		.map(id => people.filter(person => person.id == id)[0])
		.map(renderPerson);
	renderedTeam.interns = team.internIds
		.map(id => people.filter(person => person.id == id)[0])
		.map(renderPerson);
	renderedTeam.teamLead = renderPerson(people.filter(person => person.id == team.teamLeadId)[0]);
	renderedTeam.office = renderLocation(locations.filter(location => location.id == team.officeLocationId)[0]);
	renderedTeam.type = "TEAM";
	renderedTeam['__typename'] = "Team";
	return renderedTeam;
};

const renderEvent = event => {
	var renderedEvent = {};
	renderedEvent.id = event.id;
	renderedEvent.name = event.name;
	renderedEvent.type = "EVENT";
	renderedEvent['__typename'] = "Event";
	renderedEvent.description = event.description;
	renderedEvent.location = renderLocation(locations.filter(location => location.id == event.locationId)[0]);
	renderedEvent.team = renderTeam(teams.filter(team => team.id == event.teamId)[0]);
	return renderedEvent;
}

const renderedPeople = people.map(renderPerson);
const renderedLocation = locations.map(renderLocation);
const renderedTeams = teams.map(renderTeam);
const renderedEvents = events.map(renderEvent);

const getEntities = args => {
	var all = renderedPeople
		.concat(renderedLocation)
		.concat(renderedTeams)
		.concat(renderedEvents);

	var filtered = all;

	if (args.type) {
		filtered = filtered.filter(e => e.type == args.type);
	}

	if (args.name) {
		filtered = filtered.filter(e => e.name == args.name);
	}

	if (args.id) {
		filtered = filtered.filter(e => e.id == args.id);
	}

	return filtered;
}

// Root resolver
const root = {
	entities: getEntities
};


// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));